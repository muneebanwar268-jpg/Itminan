"use client";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase';

export interface MetaClientUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
}

export interface MetaClientCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: 'product' | 'product_group';
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
    title?: string;
  }>;
  num_items?: number;
  order_id?: string;
  [key: string]: any;
}

/**
 * Generate a unique event ID for deduplication between Pixel (client) and CAPI (server)
 */
export function generateEventId(prefix: string = 'ev'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Helper to read cookie by name in browser
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Dispatches event to both Meta Pixel (browser) and Meta Conversions API (server)
 * with an identical eventId to achieve 100% deduplication and maximum EMQ.
 */
export function trackMetaEvent(
  eventName: MetaStandardEvent,
  customData: MetaClientCustomData = {},
  userData: MetaClientUserData = {},
  explicitEventId?: string
): string {
  const eventId = explicitEventId || generateEventId(eventName.toLowerCase());

  // 1. Browser Pixel dispatch
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', eventName, customData, { eventID: eventId });
    }
  } catch (err) {
    console.warn('[Meta Pixel] Browser dispatch error:', err);
  }

  // 2. Server CAPI dispatch (asynchronous, non-blocking)
  if (typeof window !== 'undefined') {
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const eventSourceUrl = window.location.href;

    fetch('/api/events/capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl,
        customData,
        userData: {
          ...userData,
          fbp,
          fbc,
        },
      }),
    }).catch((err) => {
      // Non-blocking catch to ensure UI and commerce flow never degrade
      console.warn('[Meta CAPI] Client-to-server dispatch failed:', err);
    });
  }

  return eventId;
}
