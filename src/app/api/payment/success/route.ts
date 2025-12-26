// app/api/payment/success/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

async function validatePayment(val_id: string) {
  const sslApiUrl = is_live
    ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
    : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

  const params = new URLSearchParams({
    val_id: val_id,
    store_id: store_id,
    store_passwd: store_passwd,
    format: 'json',
  });

  const response = await fetch(`${sslApiUrl}?${params.toString()}`);
  return await response.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = Object.fromEntries(body);

    const val_id = data.val_id as string;
    const tran_id = data.tran_id as string;
    const amount = data.amount as string;
    const status = data.status as string;
    const userEmail = data.value_a as string;

    console.log('Payment Success Callback:', { tran_id, val_id, status });

    if (!val_id || !tran_id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?reason=missing_data`
      );
    }

    const validation = await validatePayment(val_id);

    const isValid =
      validation &&
      (validation.status === 'VALID' || validation.status === 'VALIDATED');

    if (isValid && status === 'VALID') {
      const ordersCollection = await dbConnect('orders');

      const updateResult = await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            paid: true,
            status: 'paid',
            val_id: val_id,
            paymentMethod: data.card_type || 'unknown',
            bankTranId: data.bank_tran_id || '',
            cardIssuer: data.card_issuer || '',
            cardBrand: data.card_brand || '',
            paidAt: new Date(),
            updatedAt: new Date(),
            validationResponse: validation,
          }
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log('Order updated to paid status:', tran_id);

        // ✅ CART CLEAR করুন এখানেই!
        if (userEmail) {
          try {
            const cartCollection = await dbConnect('cart');
            await cartCollection.deleteMany({ userEmail });
            console.log('Cart cleared for user:', userEmail);
          } catch (error) {
            console.error('Failed to clear cart:', error);
          }
        }
      } else {
        console.warn('Order not found or already updated:', tran_id);
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?tran_id=${tran_id}&amount=${amount}`
      );
    } else {
      console.error('Payment validation failed:', validation);
      
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            status: 'failed',
            failedReason: 'Validation failed',
            updatedAt: new Date(),
          }
        }
      );

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

export async function GET(req: NextRequest) {
  return POST(req);
}