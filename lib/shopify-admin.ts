/**
 * Shopify Admin GraphQL API Client & Token Manager
 * Reference: https://shopify.dev/docs/api/admin-graphql/latest
 *
 * Supports:
 * 1. Automatic 24-hour access token acquisition & caching using Client ID & Secret
 * 2. Preemptive token refresh before expiration buffer (5 minutes)
 * 3. Automatic 401 retry recovery so users never encounter authentication errors
 * 4. In-app Order creation via Admin GraphQL (Draft Order -> Complete Order for COD / pending payment)
 */

interface TokenCache {
  accessToken: string;
  expiresAt: number; // timestamp in ms
}

let cachedAuth: TokenCache | null = null;
let tokenFetchPromise: Promise<string> | null = null;

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'mock.shop';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const STATIC_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-07';

/**
 * Normalizes store domain to ensure standard format (e.g., example.myshopify.com)
 */
function getNormalizedShopDomain(): string {
  let domain = STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!domain.includes('.') && domain !== 'mock.shop') {
    domain = `${domain}.myshopify.com`;
  }
  return domain;
}

/**
 * Retrieves a valid Shopify Admin API Access Token.
 * - Uses static token if provided in env
 * - Or exchanges client_id + client_secret for 24h access token and caches it
 * - Automatically refreshes when expiring in < 5 minutes
 */
export async function getAdminAccessToken(forceRefresh = false): Promise<string> {
  // If a permanent admin access token is provided directly in env
  if (STATIC_ACCESS_TOKEN) {
    return STATIC_ACCESS_TOKEN;
  }

  const now = Date.now();
  const SAFETY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry

  // Return cached token if still valid and not forcing refresh
  if (!forceRefresh && cachedAuth && cachedAuth.expiresAt - now > SAFETY_BUFFER_MS) {
    return cachedAuth.accessToken;
  }

  // Prevent multiple concurrent token refresh calls
  if (tokenFetchPromise && !forceRefresh) {
    return tokenFetchPromise;
  }

  tokenFetchPromise = (async () => {
    try {
      if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn(
          '[Shopify Admin] SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET not configured. Running in fallback/mock mode.'
        );
        return 'mock-admin-token';
      }

      const shop = getNormalizedShopDomain();
      const tokenUrl = `https://${shop}/admin/oauth/access_token`;

      console.log(`[Shopify Admin] Requesting new access token from ${tokenUrl}...`);

      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Shopify Admin] Failed to fetch access token (${res.status}):`, errorText);
        throw new Error(`Failed to obtain Shopify access token: ${res.statusText}`);
      }

      const data = await res.json();
      const accessToken = data.access_token;
      // expires_in is in seconds (e.g. 86400 = 24 hours), default to 24h if missing
      const expiresInSec = typeof data.expires_in === 'number' ? data.expires_in : 86400;

      cachedAuth = {
        accessToken,
        expiresAt: Date.now() + expiresInSec * 1000,
      };

      console.log(
        `[Shopify Admin] Access token successfully obtained & cached. Valid for ${(expiresInSec / 3600).toFixed(1)} hours.`
      );

      return accessToken;
    } finally {
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
}

/**
 * Executes an Admin GraphQL query/mutation with automatic token injection and 401 retry
 */
export async function shopifyAdminGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {},
  isRetry = false
): Promise<T> {
  const shop = getNormalizedShopDomain();

  // If running without real Shopify credentials, return simulated mock data
  if (shop === 'mock.shop' || (!CLIENT_ID && !STATIC_ACCESS_TOKEN)) {
    console.log('[Shopify Admin] Executing in mock/simulation mode.');
    return simulateMockAdminResponse(query, variables) as T;
  }

  const token = await getAdminAccessToken(isRetry);
  const endpoint = `https://${shop}/admin/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  // If token expired (401 Unauthorized), force token refresh and retry once
  if (response.status === 401 && !isRetry) {
    console.warn('[Shopify Admin] Token returned 401 Unauthorized. Clearing cache & retrying with fresh token...');
    cachedAuth = null;
    return shopifyAdminGraphQL<T>(query, variables, true);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API HTTP Error ${response.status}: ${errorText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    console.error('[Shopify Admin] GraphQL Errors:', result.errors);
    throw new Error(result.errors.map((e: any) => e.message).join(', '));
  }

  return result.data as T;
}

export interface CreateOrderInput {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    zip?: string;
    country?: string;
    phone: string;
  };
  lineItems: {
    title: string;
    quantity: number;
    price: number;
    variantId?: string;
  }[];
  note?: string;
  paymentMethod?: string;
}

export interface CreatedOrderResult {
  orderId: string;
  orderNumber: string;
  totalPrice: string;
  currencyCode: string;
  customerName: string;
  createdAt: string;
}

/**
 * Formats Pakistani / international phone numbers to standard E.164 format (+92...) required by Shopify
 */
export function normalizeShopifyPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+92')) {
    return cleaned;
  }
  if (cleaned.startsWith('0092')) {
    return `+92${cleaned.slice(4)}`;
  }
  if (cleaned.startsWith('92') && cleaned.length >= 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+92${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('3') && cleaned.length === 10) {
    return `+92${cleaned}`;
  }
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  return `+92${cleaned}`;
}

/**
 * Places an official Shopify Order directly via Admin GraphQL API
 * Uses draftOrderCreate + draftOrderComplete to generate an official order with pending payment (COD)
 */
export async function placeShopifyOrder(input: CreateOrderInput): Promise<CreatedOrderResult> {
  const shop = getNormalizedShopDomain();
  const formattedPhone = normalizeShopifyPhone(input.customer.phone || input.shippingAddress.phone);

  // If in mock or development simulation mode
  if (shop === 'mock.shop' || (!CLIENT_ID && !STATIC_ACCESS_TOKEN)) {
    const mockOrderNumber = `#ITM-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = input.lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
      orderId: `gid://shopify/Order/simulated-${Date.now()}`,
      orderNumber: mockOrderNumber,
      totalPrice: totalAmount.toString(),
      currencyCode: 'PKR',
      customerName: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  // 1. Prepare Draft Order Input
  const draftOrderInput: any = {
    note: `${input.note || ''} | Customer Phone: ${formattedPhone} | Payment: ${input.paymentMethod || 'Cash On Delivery'}`,
    tags: ['In-App-Order', input.paymentMethod || 'COD', 'Itminaan-Heritage'],
    shippingAddress: {
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      address1: input.shippingAddress.address1,
      address2: input.shippingAddress.address2 || '',
      city: input.shippingAddress.city,
      province: input.shippingAddress.province || '',
      zip: input.shippingAddress.zip || '00000',
      country: input.shippingAddress.country || 'PK',
      phone: formattedPhone,
    },
    billingAddress: {
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      address1: input.shippingAddress.address1,
      city: input.shippingAddress.city,
      phone: formattedPhone,
    },
    lineItems: input.lineItems.map((item) => {
      if (item.variantId && item.variantId.startsWith('gid://shopify/ProductVariant/')) {
        return {
          variantId: item.variantId,
          quantity: item.quantity,
        };
      }
      return {
        title: item.title,
        originalUnitPrice: item.price.toString(),
        quantity: item.quantity,
        requiresShipping: true,
      };
    }),
  };

  if (input.customer.email) {
    draftOrderInput.email = input.customer.email;
  }
  if (formattedPhone) {
    draftOrderInput.phone = formattedPhone;
  }

  // 2. Draft Order Create Mutation
  const DRAFT_ORDER_CREATE = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          name
          totalPrice
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const createRes = await shopifyAdminGraphQL(DRAFT_ORDER_CREATE, { input: draftOrderInput });
  const draftData = createRes?.draftOrderCreate;

  if (draftData?.userErrors && draftData.userErrors.length > 0) {
    const errorMsg = draftData.userErrors.map((e: any) => `${e.field?.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Shopify Draft Order Error: ${errorMsg}`);
  }

  const draftOrderId = draftData?.draftOrder?.id;
  if (!draftOrderId) {
    throw new Error('Failed to create draft order on Shopify');
  }

  // 3. Complete the Draft Order (Creates official order with Payment Pending for COD)
  const DRAFT_ORDER_COMPLETE = `
    mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
      draftOrderComplete(id: $id, paymentPending: $paymentPending) {
        draftOrder {
          id
          order {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const completeRes = await shopifyAdminGraphQL(DRAFT_ORDER_COMPLETE, {
    id: draftOrderId,
    paymentPending: true,
  });

  const completeData = completeRes?.draftOrderComplete;

  if (completeData?.userErrors && completeData.userErrors.length > 0) {
    console.warn('[Shopify Admin] Complete draft order warnings:', completeData.userErrors);
    // If complete fails (e.g. permission restriction), return the draft order confirmation
    return {
      orderId: draftOrderId,
      orderNumber: draftData.draftOrder.name || `#DRAFT-${Date.now().toString().slice(-4)}`,
      totalPrice: draftData.draftOrder.totalPrice || '0.00',
      currencyCode: 'PKR',
      customerName: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  const finalizedOrder = completeData?.draftOrder?.order;

  return {
    orderId: finalizedOrder?.id || draftOrderId,
    orderNumber: finalizedOrder?.name || draftData.draftOrder.name || `#ITM-${Date.now().toString().slice(-4)}`,
    totalPrice: finalizedOrder?.totalPriceSet?.shopMoney?.amount || draftData.draftOrder.totalPrice || '0.00',
    currencyCode: finalizedOrder?.totalPriceSet?.shopMoney?.currencyCode || 'PKR',
    customerName: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
    createdAt: finalizedOrder?.createdAt || new Date().toISOString(),
  };
}

export interface StoreProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; altText: string }[];
  variants: {
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
    image?: string;
  }[];
}

const LOCAL_FALLBACK_PRODUCT: StoreProduct = {
  id: "gid://shopify/Product/itminaan-handbag-default",
  title: "Handcrafted Handbag",
  description: "A celebration of traditional Pakistani artistry. Crafted with authentic block printing, intricate mirror work, and opulent gold tassel detailing — designed to elevate every occasion.",
  handle: "handcrafted-handbag",
  price: 1299,
  compareAtPrice: 1899,
  images: [
    { url: "/images/bag-front.jpg", altText: "Handcrafted Handbag — Front View" },
    { url: "/images/bag-top.jpg", altText: "Handcrafted Handbag — Top View" },
    { url: "/images/bag-collection.jpg", altText: "Handcrafted Handbag — Collection" },
    { url: "/images/handbag-detail.jpg", altText: "Handcrafted Handbag — Detail" },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/itminaan-handbag-v1",
      title: "Default Title",
      price: 1299,
      availableForSale: true,
      image: "/images/bag-front.jpg",
    },
  ],
};

function formatAdminProduct(node: any): StoreProduct {
  const rawImages = node.images?.edges?.map((e: any) => ({
    url: e.node?.url,
    altText: e.node?.altText || node.title,
  })) || [];

  if (rawImages.length === 0 && node.featuredImage?.url) {
    rawImages.push({
      url: node.featuredImage.url,
      altText: node.featuredImage.altText || node.title,
    });
  }

  const variants = (node.variants?.edges || []).map((e: any) => ({
    id: e.node.id,
    title: e.node.title,
    price: parseFloat(e.node.price) || 1299,
    availableForSale: e.node.availableForSale ?? true,
    image: e.node.image?.url || rawImages[0]?.url,
  }));

  const mainPrice = variants[0]?.price || (node.variants?.edges?.[0]?.node?.price ? parseFloat(node.variants.edges[0].node.price) : 1299);

  return {
    id: node.id,
    title: node.title,
    description: node.description || "",
    handle: node.handle || "handcrafted-handbag",
    price: mainPrice,
    images: rawImages.length > 0 ? rawImages : LOCAL_FALLBACK_PRODUCT.images,
    variants: variants.length > 0 ? variants : LOCAL_FALLBACK_PRODUCT.variants,
  };
}

/**
 * Fetches all products from the Shopify Admin GraphQL API
 */
export async function fetchAdminProducts(first = 10): Promise<StoreProduct[]> {
  const query = `
    query getAdminProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price
                  availableForSale
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyAdminGraphQL(query, { first });
    const edges = data?.products?.edges || [];
    if (edges.length > 0) {
      return edges.map((edge: any) => formatAdminProduct(edge.node));
    }
  } catch (error) {
    console.error("[Shopify Admin] Failed to fetch products:", error);
  }

  return [LOCAL_FALLBACK_PRODUCT];
}

/**
 * Fetches a single product by handle, or returns the first available product in the catalog
 */
export async function fetchAdminProduct(handle?: string): Promise<StoreProduct> {
  if (handle) {
    const query = `
      query getAdminProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          featuredImage {
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price
                availableForSale
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await shopifyAdminGraphQL(query, { handle });
      if (data?.productByHandle) {
        return formatAdminProduct(data.productByHandle);
      }
    } catch (error) {
      console.warn(`[Shopify Admin] Could not find product with handle "${handle}":`, error);
    }
  }

  // Fallback to first product in catalog or fallback product
  const all = await fetchAdminProducts(1);
  return all[0] || LOCAL_FALLBACK_PRODUCT;
}

/**
 * Internal fallback for test/simulation environment
 */
function simulateMockAdminResponse(query: string, variables: Record<string, any>) {
  if (query.includes('getAdminProducts') || query.includes('getAdminProductByHandle')) {
    return {
      products: {
        edges: [
          {
            node: {
              id: LOCAL_FALLBACK_PRODUCT.id,
              title: LOCAL_FALLBACK_PRODUCT.title,
              description: LOCAL_FALLBACK_PRODUCT.description,
              handle: LOCAL_FALLBACK_PRODUCT.handle,
              featuredImage: LOCAL_FALLBACK_PRODUCT.images[0],
              images: {
                edges: LOCAL_FALLBACK_PRODUCT.images.map((img) => ({ node: img })),
              },
              variants: {
                edges: LOCAL_FALLBACK_PRODUCT.variants.map((v) => ({
                  node: {
                    id: v.id,
                    title: v.title,
                    price: v.price.toString(),
                    availableForSale: v.availableForSale,
                    image: { url: v.image, altText: v.title },
                  },
                })),
              },
            },
          },
        ],
      },
    };
  }
  if (query.includes('draftOrderCreate')) {
    return {
      draftOrderCreate: {
        draftOrder: {
          id: `gid://shopify/DraftOrder/simulated-${Date.now()}`,
          name: `#ITM-MOCK-${Math.floor(1000 + Math.random() * 9000)}`,
          totalPrice: '1299.00',
        },
        userErrors: [],
      },
    };
  }
  if (query.includes('draftOrderComplete')) {
    return {
      draftOrderComplete: {
        draftOrder: {
          id: variables.id,
          order: {
            id: `gid://shopify/Order/simulated-${Date.now()}`,
            name: `#ITM-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString(),
            totalPriceSet: {
              shopMoney: {
                amount: '1299.00',
                currencyCode: 'PKR',
              },
            },
          },
        },
        userErrors: [],
      },
    };
  }
  return { data: {} };
}
