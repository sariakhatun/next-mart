import { dbConnect } from '@/src/lib/dbConnect';
import { CartItem } from '@/src/types/cart';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });

  try {
    const cartCollection = await dbConnect('cart');
    const cart = await cartCollection.find({ userEmail }).toArray();
    return NextResponse.json(cart, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data: CartItem = await req.json();
  if (!data.userEmail) return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });

  try {
    const cartCollection = await dbConnect('cart');

    // check if product already in cart
    const existing = await cartCollection.findOne({ userEmail: data.userEmail, id: data.id });
    if (existing) {
      // increase quantity (but not exceed stock)
      const updatedQty = Math.min(existing.quantity + data.quantity, data.stock);
      await cartCollection.updateOne(
        { userEmail: data.userEmail, id: data.id },
        { $set: { quantity: updatedQty } }
      );
    } else {
      await cartCollection.insertOne(data);
    }

    return NextResponse.json({ message: 'Added to cart' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add cart' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userEmail, productId, quantity } = await req.json();
  if (!userEmail || !productId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  try {
    const cartCollection = await dbConnect('cart');
    await cartCollection.updateOne(
      { userEmail, id: productId },
      { $set: { quantity: Math.max(1, quantity) } }
    );

    return NextResponse.json({ message: 'Quantity updated' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');
  const productId = searchParams.get('productId');

  if (!userEmail || !productId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const cartCollection = await dbConnect('cart');

    const result = await cartCollection.deleteOne({
      userEmail,
      id: productId, // ✅ string match
    });

    return NextResponse.json(
      { message: 'Removed from cart', deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove cart' }, { status: 500 });
  }
}

