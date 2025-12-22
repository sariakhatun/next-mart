import ProductDetailClient from "@/src/components/ProductDetailClient";
import { Product } from "@/src/types/product";


async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`http://localhost:5000/products/${id}`, {
    cache: 'no-store',  // real-time data
  });

  if (!res.ok) {
    throw new Error('Product not found');
  }

  return res.json();
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  
  return <ProductDetailClient product={product} />;
}