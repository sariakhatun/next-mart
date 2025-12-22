import ProductCard from '@/src/components/ProductCard';
import { Product } from '@/src/types/product';

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:5000/products', {
    cache: 'no-store',
    next: { revalidate: 0 },  
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

export default async function ProductPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          All Products
        </h1>
        <p className="text-gray-600">
          Discover our premium collection of {products.length} products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">No products found.</p>
          <p className="text-gray-400">Check back later for new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}