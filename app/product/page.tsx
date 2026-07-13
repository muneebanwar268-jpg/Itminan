import React from 'react';
import { ProductClient } from './ProductClient';
import { fetchProduct } from '@/lib/shopify';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acquire Itminan | The Smart Tasbih',
  description: 'Purchase the premium rhinestone Itminan smart tasbih counter.',
};

export default async function ProductPage() {
  const handle = process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE || 'itminan-smart-tasbih';
  const product = await fetchProduct(handle);

  return (
    <main>
      <ProductClient product={product} />
    </main>
  );
}
