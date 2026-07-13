import { NextResponse } from 'next/server';
import { createShopifyCheckout } from '@/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items list' },
        { status: 400 }
      );
    }

    // Filter out items without variantId (e.g., legacy items or unselected)
    const lineItems = items
      .filter((item: any) => item.variantId)
      .map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity || 1,
      }));

    if (lineItems.length === 0) {
      // Return a local mock checkout page if no Shopify variant ID was supplied
      return NextResponse.json({
        checkoutUrl: 'https://shopify.com/checkout/mock-checkout-session',
      });
    }

    const checkoutUrl = await createShopifyCheckout(lineItems);
    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
