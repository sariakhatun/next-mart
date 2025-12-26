// app/api/payment/fail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = Object.fromEntries(body);

    const tran_id = data.tran_id as string;
    const error = data.error as string;

    console.log('Payment FAILED:', { tran_id, error });

    // ✅ ORDER STATUS UPDATE করুন (FAILED)
    if (tran_id) {
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            status: 'failed',
            failedReason: error || 'Payment failed',
            updatedAt: new Date(),
          }
        }
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?tran_id=${tran_id || ''}&reason=${error || 'unknown'}`
    );
  } catch (error) {
    console.error('Payment fail callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?reason=server_error`
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reason = searchParams.get('error') || 'unknown';
  const tran_id = searchParams.get('tran_id') || '';
  
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?tran_id=${tran_id}&reason=${reason}`
  );
}