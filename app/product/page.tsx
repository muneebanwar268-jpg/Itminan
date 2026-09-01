import React from 'react';
import { ProductClient } from './ProductClient';
import { WhyUs } from '@/components/sections/WhyUs';
import { Footer } from '@/components/sections/Footer';
import { fetchAdminProduct } from '@/lib/shopify-admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ITMINAAN | Handcrafted Handbag — Order Now',
  description: 'Order your beautiful handcrafted Pakistani handbag. Traditional block printing, mirror work & tassel detailing. COD available across Pakistan.',
};

export default async function ProductPage() {
  const product = await fetchAdminProduct();

  return (
    <main>
      <ProductClient product={product} />
      <WhyUs />
      <Footer />
    </main>
  );
}
