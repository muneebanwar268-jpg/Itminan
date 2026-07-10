import React from 'react';
import { ProductClient } from './ProductClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acquire Itminan | The Smart Tasbih',
  description: 'Purchase the premium rhinestone Itminan smart tasbih counter.',
};

export default function ProductPage() {
  return (
    <main>
      <ProductClient />
    </main>
  );
}
