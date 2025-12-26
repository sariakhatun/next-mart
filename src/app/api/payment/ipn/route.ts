// app/api/payment/ipn/route.ts
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
    const status = data.status as string;

    console.log('IPN Received:', { tran_id, val_id, status });

    if (!val_id || !tran_id || status !== 'VALID') {
      return NextResponse.json({ message: 'Invalid IPN' }, { status: 400 });
    }

    const validation = await validatePayment(val_id);

    const isValid =
      validation &&
      (validation.status === 'VALID' || validation.status === 'VALIDATED');

    if (isValid) {
      // ✅ IPN দিয়ে ORDER UPDATE (যদি আগে update না হয়ে থাকে)
      const ordersCollection = await dbConnect('orders');

      await ordersCollection.updateOne(
        { 
          transactionId: tran_id,
          paid: false // শুধু unpaid orders update করবে
        },
        {
          $set: {
            paid: true,
            status: 'paid',
            val_id: val_id,
            paymentMethod: data.card_type || 'unknown',
            bankTranId: data.bank_tran_id || '',
            paidAt: new Date(),
            updatedAt: new Date(),
            validationResponse: validation,
            notifiedVia: 'IPN',
          }
        }
      );

      console.log('IPN: Order updated successfully:', tran_id);
    }

    return NextResponse.json({ message: 'IPN Received' }, { status: 200 });
  } catch (error) {
    console.error('IPN error:', error);
    return NextResponse.json({ message: 'IPN Error' }, { status: 500 });
  }
}