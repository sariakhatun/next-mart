'use client';

import React from "react";
import { FiTruck, FiShield, FiTag, FiHeadphones } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";


const servicesData = [
  {
    icon: <FiTruck className="w-12 h-12" />,
    title: "Fast Delivery",
    description:
      "Quick and reliable shipping nationwide. Get your orders delivered right to your doorstep in no time.",
  },
  {
    icon: <FiShield className="w-12 h-12" />,
    title: "Secure Payments",
    description:
      "Shop with confidence using SSLCommerz gateway. Your transactions are safe and protected.",
  },
  {
    icon: <FiTag className="w-12 h-12" />,
    title: "Best Prices",
    description:
      "Unbeatable deals and premium quality products at affordable prices every day.",
  },
  {
    icon: <FiHeadphones className="w-12 h-12" />,
    title: "24/7 Support",
    description:
      "Our customer support team is always here to help you with any questions or issues.",
  },
];

const OurServices = () => {
  return (
    <section className=" py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl px-5 mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <SectionTitle title="Why Choose Us" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 dark:group-hover:bg-cyan-700 group-hover:text-white transition-colors duration-300"
              >
                {service.icon}
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;