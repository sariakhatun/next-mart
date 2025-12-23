// app/api/payment/success/route.ts
import { dbConnect } from '@/src/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = Object.fromEntries(body);

    const val_id = data.val_id as string;
    const tran_id = data.tran_id as string;
    const amount = data.amount as string;
    const status = data.status as string; // VALID, FAILED, CANCELLED

    if (!val_id || !tran_id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`
      );
    }

    // SSLCommerz থেকে payment validate করি
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    // validation.response একটা object আসবে (status: 'VALID' / 'VALIDATED' / অন্য কিছু)
    const isValid =
      validation &&
      (validation.status === 'VALID' || validation.status === 'VALIDATED');

    if (isValid && status === 'VALID') {
      // এখানে order MongoDB-এ সেভ করি
      const ordersCollection = await dbConnect('orders'); // 'orders' collection নাম, চাইলে change করো

      // init route-এ value_a/b/c দিয়ে data store করেছিলে, তাই এখানে retrieve করতে পারি
      const userEmail = data.value_a as string;
      const cartItems = JSON.parse((data.value_b as string) || '[]');
      const shippingInfo = JSON.parse((data.value_c as string) || '{}');

      const orderData = {
        transactionId: tran_id,
        val_id,
        amount: parseFloat(amount),
        currency: data.currency || 'BDT',
        status: 'paid',
        paymentMethod: data.card_type || 'unknown',
        userEmail,
        cartItems,
        shippingInfo,
        createdAt: new Date(),
        sslResponse: validation, // full response save করতে চাইলে
      };

      await ordersCollection.insertOne(orderData);

      // Optional: এখানে stock update, cart clear ইত্যাদি করতে পারো

      // Success page-এ redirect
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?tran_id=${tran_id}&amount=${amount}&status=success`
      );
    } else {
      // Validation failed
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?reason=validation_failed`
      );
    }
  } catch (error) {
    console.error('Payment success callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?reason=server_error`
    );
  }
}