// app/api/payment/fail/route.ts
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

    const tran_id = data.tran_id as string;
    const amount = data.amount as string;

    // Optional: Log failed payment
    console.log('Payment FAILED:', { tran_id, reason: data.tran_date });

    // Redirect to fail page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail?tran_id=${tran_id}&amount=${amount}&status=failed`
    );
  } catch (error) {
    console.error('Payment fail callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`);
  }
}