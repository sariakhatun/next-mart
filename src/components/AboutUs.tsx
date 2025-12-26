'use client';

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";


export default function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Section Title - no image needed */}
        <SectionTitle title="About Us" />

        {/* Main Content - Text only, centered on mobile, left-aligned on large screens */}
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            We are a passionate team dedicated to bringing you the best online shopping experience. 
            From electronics to fashion, home essentials to sports gear — we curate premium products 
            at unbeatable prices, delivered straight to your door.
          </p>

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
            Our mission is simple: Quality products, exceptional service, and complete customer satisfaction. 
            With thousands of happy customers and 24/7 support, we are here to make your shopping effortless and enjoyable.
          </p>

          {/* Stats / Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-cyan-400">10K+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-cyan-400">500+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Premium Products</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-cyan-400">24/7</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Customer Support</p>
            </div>
          </div>

          {/* Optional: Mission Cards (text-only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Quality First</h3>
              <p className="text-gray-600 dark:text-gray-400">We only offer products we trust and would use ourselves.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Quick and reliable shipping to your doorstep.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Customer Focus</h3>
              <p className="text-gray-600 dark:text-gray-400">Your satisfaction is our top priority, always.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}