'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye } from 'lucide-react';
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
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {product.featured && (
            <span className="absolute top-2 left-2 bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}

          {product.discount && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4"> 
        <p className="text-xs text-cyan-600 font-semibold uppercase tracking-wide mb-1">
          {product.category}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating!)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i === Math.floor(product.rating!) && product.rating! % 1 >= 0.5
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          {discountedPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ৳{discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs font-medium mb-4 ${getStockColor(product.stock)}`}>
          {getStockStatus(product.stock)}
        </p>

        {/* Buttons: Add to Cart + View Details */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-2.5 px-3 rounded-lg font-medium text-sm hover:from-cyan-700 hover:to-cyan-800 transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg">
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>

          <Link
            href={`/products/${product.id}`}
            className="border border-cyan-600 text-cyan-600 py-2.5 px-3 rounded-lg font-medium text-sm hover:bg-cyan-50 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}