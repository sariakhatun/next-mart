// app/api/payment/success/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function validatePayment(val_id: string) {
  try {
    const sslApiUrl = is_live
      ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

    const params = new URLSearchParams({
      val_id: val_id,
      store_id: store_id,
      store_passwd: store_passwd,
      format: 'json',
    });

    console.log('Validating payment:', val_id);
    const response = await fetch(`${sslApiUrl}?${params.toString()}`);
    const data = await response.json();
    console.log('Validation response:', data);
    return data;
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}

async function handlePaymentSuccess(data: Record<string, string>) {
  const val_id = data.val_id;
  const tran_id = data.tran_id;
  const amount = data.amount;
  const status = data.status;
  const userEmail = data.value_a;

  console.log('Payment Success Callback:', { tran_id, val_id, status });

  if (!val_id || !tran_id) {
    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=missing_data`,
      303
    );
  }

  const validation = await validatePayment(val_id);

  const isValid =
    validation &&
    (validation.status === 'VALID' || validation.status === 'VALIDATED');

  if (isValid && status === 'VALID') {
    try {
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
        `${base_url}/payment/success?tran_id=${tran_id}&amount=${amount}`,
        303
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(
        `${base_url}/payment/fail?reason=database_error`,
        303
      );
    }
  } else {
    console.error('Payment validation failed:', validation);
    
    try {
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            status: 'failed',
            failedReason: 'Validation failed',
            updatedAt: new Date(),
            validationResponse: validation,
          }
        }
      );
    } catch (error) {
      console.error('Failed to update order:', error);
    }

    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=validation_failed`,
      303
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== POST REQUEST RECEIVED ===');
    
    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, string> = {};

    if (contentType.includes('application/x-www-form-urlencoded') || 
        contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      data = Object.fromEntries(formData) as Record<string, string>;
    } else if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const text = await req.text();
      if (text) {
        const params = new URLSearchParams(text);
        data = Object.fromEntries(params) as Record<string, string>;
      }
    }

    console.log('POST data received:', data);

    if (Object.keys(data).length === 0) {
      console.error('No data received');
      return NextResponse.redirect(
        `${base_url}/payment/fail?reason=no_data`,
        303
      );
    }

    return await handlePaymentSuccess(data);
  } catch (error) {
    console.error('Payment success callback error:', error);
    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=server_error`,
      303
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('=== GET REQUEST RECEIVED ===');
    
    const { searchParams } = new URL(req.url);
    
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });

    console.log('GET data received:', data);

    if (Object.keys(data).length === 0) {
      console.error('No query parameters');
      return NextResponse.redirect(
        `${base_url}/payment/fail?reason=no_data`,
        303
      );
    }

    return await handlePaymentSuccess(data);
  } catch (error) {
    console.error('GET request error:', error);
    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=server_error`,
      303
    );
  }
}