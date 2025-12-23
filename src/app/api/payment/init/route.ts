// app/api/payment/init/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'cross-fetch';
globalThis.fetch = fetch;



import { getServerSession } from 'next-auth';
import SSLCommerzPayment from 'sslcommerz-lts';
import { SSLCommerzPaymentData } from '@/src/types/payment';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country?: string;
}

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as {
      cartItems: CartItem[];
      shippingInfo: ShippingInfo;
      totalAmount: number;
    };

    const { cartItems, shippingInfo, totalAmount } = body;

    const tran_id = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const data: SSLCommerzPaymentData & {
      multi_card_name: string;
      value_a: string;
      value_b: string;
      value_c: string;
    } = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
      shipping_method: 'Courier',

      product_name: cartItems.map(item => item.name).join(', '),
      product_category: 'E-commerce',
      product_profile: 'general',

      cus_name: shippingInfo.name,
      cus_email: shippingInfo.email,
      cus_add1: shippingInfo.address,
      cus_city: shippingInfo.city,
      cus_postcode: shippingInfo.postcode,
      cus_country: shippingInfo.country ?? 'Bangladesh',
      cus_phone: shippingInfo.phone,

      num_of_item: cartItems.length,
      multi_card_name: 'mastercard,visacard,amexcard',

      value_a: session.user.email,
      value_b: JSON.stringify(cartItems),
      value_c: JSON.stringify(shippingInfo),
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId: tran_id,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Payment initiation failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment init error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
