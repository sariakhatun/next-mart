'use client';

import Image from 'next/image';
import { ShoppingCart, Star, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/src/types/product';
import Link from 'next/link';
import { useCartContext } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const { addToCart } = useCartContext();
  const router = useRouter();

  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : null;

  const handleQuantityChange = (action: 'inc' | 'dec') => {
    if (action === 'inc' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
  if (product.stock === 0) {
    Swal.fire('Out of stock', '', 'error');
    return;
  }

  try {
    const success = await addToCart({ ...product }, quantity); 

    if (!success) return; 

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${quantity} item(s) added successfully`,
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      router.push('/cart');
    }, 1300);

  } catch (error) {
    Swal.fire('Error', 'Failed to add product to cart', 'error');
    console.error(error);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-cyan-600 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       
        <div className="space-y-4">
          
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-lg">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

         
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {[product.image, ...product.images.slice(1)].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all shadow-sm hover:shadow-md ${
                    selectedImage === img
                      ? 'border-cyan-600 ring-2 ring-cyan-600 ring-offset-2'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

      
        <div className="space-y-6">
          <div>
            <p className="text-sm text-cyan-600 font-semibold uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

           
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-600 font-medium">({product.rating})</span>
              </div>
            )}

           
            <div className="mb-6">
              {discountedPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

           
            <p
              className={`text-lg font-medium mb-6 ${
                product.stock > 10
                  ? 'text-green-600'
                  : product.stock > 0
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            >
              {product.stock > 0
                ? product.stock > 10
                  ? 'In Stock'
                  : `Only ${product.stock} left!`
                : 'Out of Stock'}
            </p>

            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

          
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
                  <button
                    onClick={() => handleQuantityChange('dec')}
                    className="p-3 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                    disabled={quantity === 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg min-w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('inc')}
                    className="p-3 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-4 px-8 rounded-lg font-semibold hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart ({quantity})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
