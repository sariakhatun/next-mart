import React from 'react';
import Navbar from '../components/Navbar';
import CategoriesSection from '../components/CategoriesSection';
import HeroSection from '../components/HeroSection';

const HomePage = () => {
  return (
    <div className=' px-4 sm:px-6 lg:px-8'>
      <HeroSection></HeroSection>
      <CategoriesSection></CategoriesSection>
    </div>
  );
};

export default HomePage;