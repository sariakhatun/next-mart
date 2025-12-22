'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : null;

  const getStockStatus = (stock: number): string => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Only ${stock} left!`;
    return 'In Stock';
  };

  const getStockColor = (stock: number): string => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-cyan-300">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {product.featured && (
            <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              Featured
            </span>
          )}
          
          {product.discount && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs text-cyan-600 font-semibold uppercase tracking-wide mb-2">
            {product.category}
          </p>
          
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-3 group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : i === Math.floor(product.rating!) && product.rating! % 1 >= 0.5
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 font-medium ml-1">
                {product.rating}
              </span>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {discountedPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-5">
            <p className={`text-sm font-semibold ${getStockColor(product.stock)}`}>
              {getStockStatus(product.stock)}
            </p>
          </div>

          <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}