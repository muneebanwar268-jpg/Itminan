import crypto from 'crypto';

export interface MetaUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

export interface MetaCustomData {
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

export interface MetaEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
}

/**
 * Normalize and SHA-256 hash personal data as required by Meta Conversions API
 */
export function hashSha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function normalizeEmail(email: string): string | null {
  const cleaned = email.trim().toLowerCase();
  return cleaned ? hashSha256(cleaned) : null;
}

export function normalizePhone(phone: string): string | null {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return null;

  // Handle Pakistani numbers
  // If starts with 03..., change 0 to 92 -> 923...
  if (cleaned.startsWith('03') && cleaned.length === 11) {
    cleaned = `92${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = `92${cleaned}`;
  } else if (cleaned.startsWith('0092')) {
    cleaned = cleaned.slice(2);
  }

  return hashSha256(cleaned);
}

export function normalizeName(name: string): string | null {
  const cleaned = name.trim().toLowerCase().replace(/[^a-z]/g, '');
  return cleaned ? hashSha256(cleaned) : null;
}

export function normalizeCity(city: string): string | null {
  const cleaned = city.trim().toLowerCase().replace(/[\s\d.,-]/g, '');
  return cleaned ? hashSha256(cleaned) : null;
}

export function normalizeState(province: string): string | null {
  const cleaned = province.trim().toLowerCase().replace(/[\s\d.,-]/g, '');
  return cleaned ? hashSha256(cleaned) : null;
}

export function normalizeZip(zip: string): string | null {
  const cleaned = zip.trim().toLowerCase().replace(/[\s-]/g, '');
  return cleaned ? hashSha256(cleaned) : null;
}

export function normalizeCountry(country: string): string | null {
  const cleaned = country.trim().toLowerCase();
  if (cleaned === 'pakistan' || cleaned === 'pk') return hashSha256('pk');
  return cleaned ? hashSha256(cleaned) : null;
}

/**
 * Prepares hashed user data object for Meta CAPI
 */
export function prepareHashedUserData(userData: MetaUserData) {
  const user_data: Record<string, any> = {};

  if (userData.email) {
    const em = normalizeEmail(userData.email);
    if (em) user_data.em = [em];
  }

  if (userData.phone) {
    const ph = normalizePhone(userData.phone);
    if (ph) user_data.ph = [ph];
  }

  if (userData.firstName) {
    const fn = normalizeName(userData.firstName);
    if (fn) user_data.fn = [fn];
  }

  if (userData.lastName) {
    const ln = normalizeName(userData.lastName);
    if (ln) user_data.ln = [ln];
  }

  if (userData.city) {
    const ct = normalizeCity(userData.city);
    if (ct) user_data.ct = [ct];
  }

  if (userData.province) {
    const st = normalizeState(userData.province);
    if (st) user_data.st = [st];
  }

  if (userData.zip) {
    const zp = normalizeZip(userData.zip);
    if (zp) user_data.zp = [zp];
  }

  if (userData.country) {
    const country = normalizeCountry(userData.country);
    if (country) user_data.country = [country];
  }

  if (userData.clientIpAddress) {
    user_data.client_ip_address = userData.clientIpAddress;
  }

  if (userData.clientUserAgent) {
    user_data.client_user_agent = userData.clientUserAgent;
  }

  if (userData.fbp) {
    user_data.fbp = userData.fbp;
  }

  if (userData.fbc) {
    user_data.fbc = userData.fbc;
  }

  return user_data;
}

/**
 * Send an event to Meta Conversions API (Graph API v21.0)
 */
export async function sendMetaCapiEvent(payload: MetaEventPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    console.warn('[Meta CAPI] Skipping CAPI event: NEXT_PUBLIC_META_PIXEL_ID or META_CONVERSIONS_API_ACCESS_TOKEN not configured in environment.');
    return { success: false, error: 'Meta Pixel ID or Access Token not configured' };
  }

  const user_data = prepareHashedUserData(payload.userData);

  const eventItem: Record<string, any> = {
    event_name: payload.eventName,
    event_time: payload.eventTime || Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: 'website',
    event_source_url: payload.eventSourceUrl || 'https://itminaan.pk',
    user_data,
  };

  if (payload.customData) {
    eventItem.custom_data = {
      currency: payload.customData.currency || 'PKR',
      ...payload.customData,
    };
  }

  const requestBody: Record<string, any> = {
    data: [eventItem],
  };

  if (testEventCode) {
    requestBody.test_event_code = testEventCode;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error response from Meta Graph API:', result);
      return { success: false, error: result?.error?.message || 'Meta CAPI request failed' };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('[Meta CAPI] Network or dispatch error:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}
