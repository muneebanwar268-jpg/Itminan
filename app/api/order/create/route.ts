import { NextResponse } from 'next/server';
import { placeShopifyOrder, CreateOrderInput } from '@/lib/shopify-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, shippingAddress, items, note, paymentMethod } = body;

    // 1. Validation
    if (!customer || !customer.firstName || !customer.phone) {
      return NextResponse.json(
        { error: 'Please provide full customer name and phone number.' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city) {
      return NextResponse.json(
        { error: 'Please provide a valid street address and city.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Please add items before checking out.' },
        { status: 400 }
      );
    }

    // 2. Prepare order input
    const orderInput: CreateOrderInput = {
      customer: {
        firstName: customer.firstName.trim(),
        lastName: (customer.lastName || '').trim() || customer.firstName.trim(),
        email: customer.email?.trim() || undefined,
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        address1: shippingAddress.address1.trim(),
        address2: shippingAddress.address2?.trim() || '',
        city: shippingAddress.city.trim(),
        province: shippingAddress.province?.trim() || '',
        zip: shippingAddress.zip?.trim() || '00000',
        country: shippingAddress.country?.trim() || 'PK',
        phone: customer.phone.trim(),
      },
      lineItems: items.map((item: any) => ({
        title: item.name || item.title || 'Itminaan Handcrafted Item',
        quantity: item.quantity || 1,
        price: Number(item.price) || 1299,
        variantId: item.variantId || item.id,
      })),
      note: note || 'Order placed via In-App Custom Checkout (Cash on Delivery)',
      paymentMethod: paymentMethod || 'Cash On Delivery (COD)',
    };

    // 3. Execute Shopify Admin GraphQL Order Creation
    const orderResult = await placeShopifyOrder(orderInput);

    return NextResponse.json({
      success: true,
      order: orderResult,
    });
  } catch (error: any) {
    console.error('[API Order Create] Error creating Shopify order:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to place order. Please try again or contact support.',
      },
      { status: 500 }
    );
  }
}
