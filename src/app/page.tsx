import React from 'react';
import CategoriesSection from '../components/CategoriesSection';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutUs';
import OurServices from '../components/OurServices';

const HomePage = () => {
  return (
    <div className=''>
      <HeroSection></HeroSection>
      <OurServices></OurServices>
      <CategoriesSection></CategoriesSection>
    </div>
  );
};

export default HomePage;