import { NextResponse } from 'next/server';
import { fetchAdminProducts, fetchAdminProduct } from '@/lib/shopify-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (handle) {
      const product = await fetchAdminProduct(handle);
      return NextResponse.json({ product });
    }

    const products = await fetchAdminProducts(10);
    return NextResponse.json({ products, product: products[0] });
  } catch (error: any) {
    console.error('[API Products] Failed to retrieve products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products from Shopify store' },
      { status: 500 }
    );
  }
}
