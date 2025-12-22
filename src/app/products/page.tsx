import ProductCard from '@/src/components/ProductCard';
import { getProducts } from '@/src/lib/getProducts';
import { Product } from '@/src/types/product';

export default async function ProductPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        All Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
