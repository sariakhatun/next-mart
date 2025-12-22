import Link from 'next/link';
import { Laptop, ShoppingBag, Dumbbell, Home, Watch, Glasses } from 'lucide-react';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    count: 156,
    color: 'bg-cyan-100 text-cyan-600',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: ShoppingBag,
    count: 243,
    color: 'bg-pink-100 text-pink-600',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Dumbbell,
    count: 89,
    color: 'bg-green-100 text-green-600',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: Home,
    count: 134,
    color: 'bg-orange-100 text-orange-600',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Watch,
    count: 198,
    color: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: Glasses,
    count: 76,
    color: 'bg-yellow-100 text-yellow-600',
    image: 'https://images.unsplash.com/photo-1523264939098-33bd0935d29d?w=400'
  }
];

export default function CategoriesSection() {
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our diverse range of categories and find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-500 transition-all duration-300">
                  {/* Icon */}
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-semibold text-gray-900 text-center mb-2 group-hover:text-cyan-500  transition-colors">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <p className="text-sm text-gray-500 text-center">
                    {category.count} items
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}