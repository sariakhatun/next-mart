import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative mt-0 py-20 lg:py-32 overflow-hidden rounded-2xl">
      {/* Background Image with stronger blur */}
      <Image
        src="https://i.ibb.co/bjC1KyTB/images-q-tbn-ANd9-Gc-Qhx-Hk-Sa01-Nd-Kh-OLg-PCa-X1-Md-p-Pysrs-In-LQTA-s.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover rounded-2xl opacity-90 scale-110"  
      />

      {/* Stronger dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60"></div> 

      {/* Optional subtle grid pattern (কম opacity) */}
      <div className="absolute inset-0 bg-grid-gray-200/10 opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline - আরো strong shadow */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-2xl">
            Discover Your Next Favorite
            <span className="block text-cyan-300 mt-2 drop-shadow-2xl">Product</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-xl">
            Shop the latest in electronics, fashion, sports, home essentials and more. 
            Quality products at unbeatable prices — delivered right to your door.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors shadow-2xl hover:shadow-cyan-500/50"
            >
              Shop Now
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-cyan-300 bg-white/20 backdrop-blur-md border-2 border-cyan-300 rounded-lg hover:bg-white/30 transition-colors"
            >
              Browse Categories
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow-2xl">10K+</p>
              <p className="text-gray-100 drop-shadow-lg">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow-2xl">500+</p>
              <p className="text-gray-100 drop-shadow-lg">Premium Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow-2xl">24/7</p>
              <p className="text-gray-100 drop-shadow-lg">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}