import { NextResponse } from 'next/server';
import { placeShopifyOrder, CreateOrderInput } from '@/lib/shopify-admin';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, shippingAddress, items, note, paymentMethod, eventId, fbp, fbc, eventSourceUrl, shippingFee } = body;

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

    const deliveryPrice = typeof shippingFee === 'number' ? shippingFee : 199;

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
        title: item.variantTitle ? `${item.name || 'Handcrafted Handbag'} (${item.variantTitle})` : (item.name || item.title || 'Handcrafted Handbag'),
        quantity: item.quantity || 1,
        price: Number(item.price) || 1299,
        variantId: item.variantId || item.id,
      })),
      shippingLine: {
        title: 'Standard Delivery',
        price: deliveryPrice,
      },
      note: note || 'Order placed via In-App Custom Checkout (Cash on Delivery)',
      paymentMethod: paymentMethod || 'Cash On Delivery (COD)',
    };

    // 3. Execute Shopify Admin GraphQL Order Creation
    const orderResult = await placeShopifyOrder(orderInput);

    // 4. Dispatch Persistent Server-Side Meta Conversions API (CAPI) Purchase Event
    try {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const clientIpAddress = forwardedFor
        ? forwardedFor.split(',')[0].trim()
        : request.headers.get('x-real-ip') || undefined;
      const clientUserAgent = request.headers.get('user-agent') || undefined;

      const cookieHeader = request.headers.get('cookie') || '';
      const fbpCookie = fbp || cookieHeader.match(/(^|;\s*)_fbp=([^;]*)/)?.[2];
      const fbcCookie = fbc || cookieHeader.match(/(^|;\s*)_fbc=([^;]*)/)?.[2];

      const purchaseEventId = eventId || `order_${orderResult.orderId || orderResult.orderNumber}`;
      const totalAmount = Number(orderResult.totalPrice) || (orderInput.lineItems.reduce((acc, it) => acc + it.price * it.quantity, 0) + deliveryPrice);

      await sendMetaCapiEvent({
        eventName: 'Purchase',
        eventId: purchaseEventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: eventSourceUrl || 'https://itminaan.pk/checkout',
        userData: {
          email: orderInput.customer.email,
          phone: orderInput.customer.phone,
          firstName: orderInput.customer.firstName,
          lastName: orderInput.customer.lastName,
          city: orderInput.shippingAddress.city,
          province: orderInput.shippingAddress.province,
          zip: orderInput.shippingAddress.zip,
          country: 'pk',
          clientIpAddress,
          clientUserAgent,
          fbp: fbpCookie,
          fbc: fbcCookie,
        },
        customData: {
          value: totalAmount,
          currency: 'PKR',
          content_type: 'product',
          content_ids: orderInput.lineItems.map((it) => String(it.variantId)),
          contents: orderInput.lineItems.map((it) => ({
            id: String(it.variantId),
            quantity: it.quantity,
            item_price: it.price,
            title: it.title,
          })),
          num_items: orderInput.lineItems.reduce((acc, it) => acc + it.quantity, 0),
          order_id: orderResult.orderNumber || orderResult.orderId,
        },
      });
    } catch (capiErr) {
      console.warn('[API Order Create] Meta CAPI Purchase dispatch non-fatal error:', capiErr);
    }

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
