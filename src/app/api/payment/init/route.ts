// app/api/payment/init/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/src/lib/dbConnect';

export const runtime = 'nodejs';

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

interface RequestBody {
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  totalAmount: number;
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

    const body = await req.json() as RequestBody;
    const { cartItems, shippingInfo, totalAmount } = body;

    // Validation
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    const tran_id = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // ✅ DATABASE এ ORDER CREATE করুন (PAID: FALSE)
    try {
      const ordersCollection = await dbConnect('orders');
      
      const orderData = {
        transactionId: tran_id,
        userEmail: session.user.email,
        cartItems: cartItems,
        shippingInfo: shippingInfo,
        amount: totalAmount,
        currency: 'BDT',
        status: 'pending', // বা 'unpaid'
        paid: false,
        paymentMethod: null,
        val_id: null,
        bankTranId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await ordersCollection.insertOne(orderData);
      console.log('Order created with pending status:', tran_id);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to create order' },
        { status: 500 }
      );
    }

    // SSLCommerz payment data
    const paymentData = {
      store_id: store_id,
      store_passwd: store_passwd,
      total_amount: totalAmount.toString(),
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
      
      shipping_method: 'Courier',
      product_name: cartItems.map(item => item.name).join(', ').substring(0, 255),
      product_category: 'E-commerce',
      product_profile: 'general',
      
      cus_name: shippingInfo.name,
      cus_email: shippingInfo.email,
      cus_add1: shippingInfo.address,
      cus_city: shippingInfo.city,
      cus_postcode: shippingInfo.postcode || '1000',
      cus_country: shippingInfo.country || 'Bangladesh',
      cus_phone: shippingInfo.phone,
      
      ship_name: shippingInfo.name,
      ship_add1: shippingInfo.address,
      ship_city: shippingInfo.city,
      ship_postcode: shippingInfo.postcode || '1000',
      ship_country: shippingInfo.country || 'Bangladesh',
      
      num_of_item: cartItems.length.toString(),
      multi_card_name: 'mastercard,visacard,amexcard',
      
      value_a: session.user.email,
      value_b: tran_id, // শুধু transaction ID পাঠান
      value_c: '',
    };

    console.log('Initializing payment...', { tran_id, totalAmount });

    const sslApiUrl = is_live
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    const formBody = new URLSearchParams(paymentData).toString();

    const response = await fetch(sslApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    const apiResponse = await response.json();

    console.log('SSLCommerz API Response:', apiResponse);

    if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId: tran_id,
      });
    }

    // যদি payment init fail হয়, order delete করুন
    try {
      const ordersCollection = await dbConnect('orders');
      await ordersCollection.deleteOne({ transactionId: tran_id });
    } catch (error) {
      console.error('Failed to delete order:', error);
    }

    return NextResponse.json(
      { 
        success: false, 
        message: apiResponse.failedreason || 'Payment initiation failed' 
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment init error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    );
  }
}