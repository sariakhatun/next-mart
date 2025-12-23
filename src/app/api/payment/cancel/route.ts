// app/api/payment/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = Object.fromEntries(body);

    const tran_id = data.tran_id as string;
    const amount = data.amount as string;

    // Optional: Log cancelled payment
    console.log('Payment CANCELLED by user:', { tran_id });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?tran_id=${tran_id}&amount=${amount}&status=cancelled`
    );
  } catch (error) {
    console.error('Payment cancel callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`);
  }
}