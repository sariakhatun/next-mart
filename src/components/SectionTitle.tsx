'use client';

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="relative text-center]">
      {/* Background faded big title */}
      <motion.h2
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-[48px] sm:text-6xl md:text-[80px] lg:text-[100px] font-bold uppercase text-black/10 dark:text-white/10 pointer-events-none select-none"
      >
        {title.toUpperCase()}
      </motion.h2>

      {/* Foreground main title */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight"
      >
        {title}
      </motion.p>
    </div>
  );
};

export default SectionTitle;