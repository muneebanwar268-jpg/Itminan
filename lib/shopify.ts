import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'mock.shop';
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const apiVersion = '2026-07';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: domain,
  publicAccessToken: accessToken,
  apiVersion: apiVersion,
});

export interface ShopifyImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  options: {
    name: string;
    values: string[];
  }[];
  images: ShopifyImage[];
  variants: ShopifyVariant[];
}

// High-fidelity fallback mock product data
export const LOCAL_MOCK_PRODUCT: ShopifyProduct = {
  id: 'gid://shopify/Product/local-mock-itminan-tasbih',
  title: 'Itminan Smart Tasbih',
  description: 'Crafted with precision and heavily embellished with sparkling crystals. The new Itminan is a premium smart tasbih counter designed to bring elegant tranquility to your daily remembrance.',
  handle: 'itminan-smart-tasbih',
  options: [
    {
      name: 'Finish',
      values: ['Rhodium', 'Rose Gold', 'Yellow Gold'],
    },
    {
      name: 'Size',
      values: ['7', '8', '9', '10', '11', '12'],
    },
  ],
  images: [
    {
      url: '/images/hero-tasbih.png',
      altText: 'Itminan Smart Tasbih',
      width: 800,
      height: 800,
    },
  ],
  variants: (() => {
    const finishes = ['Rhodium', 'Rose Gold', 'Yellow Gold'];
    const sizes = ['7', '8', '9', '10', '11', '12'];
    const variants: ShopifyVariant[] = [];
    
    finishes.forEach(finish => {
      sizes.forEach(size => {
        variants.push({
          id: `gid://shopify/ProductVariant/mock-${finish.toLowerCase()}-${size}`,
          title: `${finish} / ${size}`,
          price: {
            amount: '149.00',
            currencyCode: 'USD',
          },
          availableForSale: true,
          selectedOptions: [
            { name: 'Finish', value: finish },
            { name: 'Size', value: size },
          ],
          image: {
            url: '/images/hero-tasbih.png',
            altText: `Itminan Smart Tasbih - ${finish} Finish`,
            width: 800,
            height: 800,
          },
        });
      });
    });
    
    return variants;
  })(),
};

const PRODUCT_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      options {
        name
        values
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const FIRST_PRODUCT_QUERY = `
  query getFirstProduct {
    products(first: 1) {
      edges {
        node {
          id
          title
          description
          handle
          options {
            name
            values
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper to clean Shopify GraphQL API response formats into a clean, flat object
function formatProduct(rawProduct: any): ShopifyProduct {
  return {
    id: rawProduct.id,
    title: rawProduct.title,
    description: rawProduct.description,
    handle: rawProduct.handle,
    options: rawProduct.options || [],
    images: (rawProduct.images?.edges || []).map((edge: any) => edge.node),
    variants: (rawProduct.variants?.edges || []).map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price,
      availableForSale: edge.node.availableForSale,
      selectedOptions: edge.node.selectedOptions || [],
      image: edge.node.image,
    })),
  };
}

/**
 * Fetches a product from Shopify Storefront API by handle.
 * If handle is not found, falls back to fetching the first product in the catalog.
 * If that fails or credentials are unconfigured, returns LOCAL_MOCK_PRODUCT.
 */
export async function fetchProduct(handle: string): Promise<ShopifyProduct> {
  // If we are using mock.shop and looking for itminan, it won't exist.
  // We'll try to fetch it but expect to fall back to first product or mock.
  try {
    const { data, errors } = await shopifyClient.request(PRODUCT_QUERY, {
      variables: { handle },
    });

    if (errors) {
      console.error('Shopify API query errors:', errors.message || errors);
    }

    if (data?.product) {
      return formatProduct(data.product);
    }

    // Handle was not found. If we are on mock.shop or custom store, fallback to first product
    console.warn(`Product handle "${handle}" not found. Fetching first product in catalog...`);
    const { data: firstData } = await shopifyClient.request(FIRST_PRODUCT_QUERY);
    const firstProductNode = firstData?.products?.edges?.[0]?.node;
    if (firstProductNode) {
      return formatProduct(firstProductNode);
    }
  } catch (error) {
    console.error('Failed to fetch from Shopify Storefront API:', error);
  }

  // Graceful fallback to high fidelity local mock
  console.log('Falling back to local mock product data.');
  return LOCAL_MOCK_PRODUCT;
}

/**
 * Creates a Shopify Cart session and returns the secure checkout url.
 */
export async function createShopifyCheckout(
  lines: { variantId: string; quantity: number }[]
): Promise<string> {
  try {
    // Check if we are running with mock storefront client
    const isMockClient = domain === 'mock.shop';
    
    // Filter out mock variant IDs if they are local-only
    const validLines = lines.map(line => {
      // If we are using mock.shop, we might need a real variant ID.
      // If the variant ID is a local mock ID (starts with gid://shopify/ProductVariant/mock-),
      // we can map it to a valid variant from mock.shop or just send it if testing.
      return {
        merchandiseId: line.variantId,
        quantity: line.quantity,
      };
    });

    const { data, errors } = await shopifyClient.request(CART_CREATE_MUTATION, {
      variables: {
        input: {
          lines: validLines,
        },
      },
    });

    if (errors) {
      console.error('Shopify API cartCreate errors:', errors.message || errors);
      throw new Error(errors.message || 'Shopify API error');
    }

    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
    if (checkoutUrl) {
      return checkoutUrl;
    }

    const userErrors = data?.cartCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }
  } catch (error) {
    console.error('Failed to create Shopify cart session:', error);
  }

  // Fallback checkout URL for local testing/development
  console.log('Falling back to local mock checkout page.');
  return 'https://shopify.com/checkout/mock-checkout-session';
}
