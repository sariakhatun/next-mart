import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
       
        {
          protocol: 'https',
        hostname: 'images.pexels.com',
        },
        {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
        {
        protocol: 'https',
        hostname: 'developers.google.com',
      },
      {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com', 
  },
      {
    protocol: 'https',
    hostname: 'res.cloudinary.com', 
  },
      
    ],
  },
};

export default nextConfig;
