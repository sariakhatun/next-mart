// app/api/payment/fail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function handlePaymentFail(data: Record<string, string>) {
  const tran_id = data.tran_id;
  const error = data.error || data.reason || 'Payment failed';

  console.log('Payment FAILED:', { tran_id, error });

  if (tran_id) {
    try {
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            paid: false,
            status: 'failed',
            failedReason: error,
            failedAt: new Date(),
            updatedAt: new Date(),
          }
        }
      );
      console.log('Order marked as failed:', tran_id);
    } catch (dbError) {
      console.error('Failed to update order:', dbError);
    }
  }

  return NextResponse.redirect(
    `${base_url}/payment/fail?tran_id=${tran_id || ''}&reason=${encodeURIComponent(error)}`,
    303
  );
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== FAIL POST REQUEST ===');
    
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

    console.log('Fail POST data:', data);

    return await handlePaymentFail(data);
  } catch (error) {
    console.error('Payment fail callback error:', error);
    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=server_error`,
      303
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('=== FAIL GET REQUEST ===');
    
    const { searchParams } = new URL(req.url);
    
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });

    console.log('Fail GET data:', data);

    return await handlePaymentFail(data);
  } catch (error) {
    console.error('Fail GET error:', error);
    return NextResponse.redirect(
      `${base_url}/payment/fail?reason=server_error`,
      303
    );
  }
}