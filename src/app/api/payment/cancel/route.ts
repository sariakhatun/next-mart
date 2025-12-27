// app/api/payment/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = Object.fromEntries(body);

    const tran_id = data.tran_id as string;

    console.log('Payment CANCELLED by user:', { tran_id });

    if (tran_id) {
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.updateOne(
        { transactionId: tran_id },
        {
          $set: {
            status: 'cancelled',
            updatedAt: new Date(),
          }
        }
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?tran_id=${tran_id || ''}`
    );
  } catch (error) {
    console.error('Payment cancel callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tran_id = searchParams.get('tran_id') || '';
  
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?tran_id=${tran_id}`
  );
}