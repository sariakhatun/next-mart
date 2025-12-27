import ProductDetailClient from '@/src/components/ProductDetailClient';
import { getProductById } from '@/src/lib/getProductById';
import { Product } from '@/src/types/product';

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params;      
  console.log('Params ID:', id);

  const product: Product = await getProductById(id);
  console.log('PRODUCT:', product);

  return <ProductDetailClient product={product} />;
}
