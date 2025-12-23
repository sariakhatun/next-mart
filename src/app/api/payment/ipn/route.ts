// app/api/payment/ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';
import { dbConnect } from '@/src/lib/dbConnect';

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
    const status = data.status as string;

    if (!val_id || !tran_id || status !== 'VALID') {
      return NextResponse.json({ message: 'Invalid IPN' }, { status: 400 });
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    const isValid =
      validation &&
      (validation.status === 'VALID' || validation.status === 'VALIDATED');

    if (isValid) {
      const ordersCollection = await dbConnect('orders');

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
        sslResponse: validation,
        notifiedVia: 'IPN',
      };

      // Duplicate prevent করতে upsert ব্যবহার করো (tran_id unique)
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        { $setOnInsert: orderData },
        { upsert: true }
      );

      console.log('IPN: Order saved successfully:', tran_id);
    }

    // SSLCommerz expects 200 OK
    return NextResponse.json({ message: 'IPN Received' }, { status: 200 });
  } catch (error) {
    console.error('IPN error:', error);
    return NextResponse.json({ message: 'IPN Error' }, { status: 500 });
  }
}