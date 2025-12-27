'use client';

import Link from 'next/link';
import Image from 'next/image';
import banner from '../assets/banner.jpeg';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      
      <div className="relative w-full h-[500px]">
        
      
        <Image
          src={banner}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center opacity-100" // 
        />

        
        <div className="absolute inset-0 bg-black/60"></div>

       
        <div className="absolute inset-0 bg-grid-gray-200/10 opacity-20"></div>

       
        <div className="relative container  px-4 h-full flex flex-col justify-center max-w-7xl mx-auto">
          
         
          <div className="text-center lg:text-left max-w-3xl ">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-2xl">
              Discover Your Next Favorite Product
            </h1>

            <p className="mt-6  text-gray-100 drop-shadow-xl">
              Shop the latest in electronics, fashion, sports, home essentials and more. 
              Quality products at unbeatable prices — delivered right to your door.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 py-2 text-base font-semibold text-cyan-300 bg-white/20 backdrop-blur-md border-2 border-cyan-300 rounded-lg hover:bg-white/30 transition-colors"
              >
                Browse Categories
              </Link>
            </div>

           
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3  text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-2xl">10K+</p>
                <p className="text-gray-100 drop-shadow-lg">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-2xl">500+</p>
                <p className="text-gray-100 drop-shadow-lg">Premium Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-2xl">24/7</p>
                <p className="text-gray-100 drop-shadow-lg">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}