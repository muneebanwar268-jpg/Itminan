import React from 'react';
import { ProductClient } from './ProductClient';
import { WhyUs } from '@/components/sections/WhyUs';
import { Footer } from '@/components/sections/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ITMINAAN | Handcrafted Handbag — Order Now',
  description: 'Order your beautiful handcrafted Pakistani handbag. Traditional block printing, mirror work & tassel detailing. Rs. 1,299. COD available across Pakistan.',
};

export default function ProductPage() {
  return (
    <main>
      <ProductClient />
      <WhyUs />
      <Footer />
    </main>
  );
}
