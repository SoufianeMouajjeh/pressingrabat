/**
 * API Client for communicating with the SaaS platform
 * All requests include the API key for authentication
 */

import { laundryConfig, LaundryInfo, Product, CartItem, CustomerInfo, ProductService } from './config';

// Known invalid image domains that should be replaced with placeholders
const INVALID_IMAGE_DOMAINS = [
  'laundry-app.com',
  'example.com',
];

/**
 * Sanitize image URL - returns null for invalid domains
 * This handles cases where the API returns URLs for non-existent domains
 */
const sanitizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // Check if the hostname matches any invalid domain
    for (const invalidDomain of INVALID_IMAGE_DOMAINS) {
      if (urlObj.hostname.endsWith(invalidDomain)) {
        console.log(`⚠️ Filtering out invalid image URL: ${url}`);
        return null;
      }
    }
    return url;
  } catch {
    // If URL is relative or malformed, return as-is
    return url;
  }
};

// Helper function to build full URL
const getFullUrl = (path: string): string => {
  console.log('🔍 DEBUG - Building URL:', {
    path,
    saasUrl: laundryConfig.saasUrl,
    hasWindow: typeof window !== 'undefined',
  });

  // If saasUrl is set, use it as base (remove trailing slash if present)
  if (laundryConfig.saasUrl) {
    const baseUrl = laundryConfig.saasUrl.replace(/\/$/, ''); // Remove trailing slash
    const fullUrl = `${baseUrl}${path}`;
    console.log('✅ Using saasUrl:', fullUrl);
    return fullUrl;
  }
  
  // For server-side calls without saasUrl, construct full URL
  // This works in development when the API routes are in the same Next.js app
  if (typeof window === 'undefined') {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || `localhost:${process.env.PORT || 3000}`;
    const fullUrl = `${protocol}://${host}${path}`;
    console.log('🖥️ Server-side URL:', fullUrl);
    return fullUrl;
  }
  
  // For client-side calls, use relative path (works with same-origin API routes)
  console.log('🌐 Client-side relative path:', path);
  return path;
};

/**
 * Fetch laundry information (branding, contact info)
 */
export const fetchLaundryInfo = async (): Promise<LaundryInfo> => {
  const url = getFullUrl(`/api/public/laundry/${laundryConfig.slug}/info`);
  console.log('🏢 Fetching laundry info from:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': laundryConfig.apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error('❌ API Error:', { status: response.status, error: errorText });
      throw new Error(`Failed to fetch laundry info: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched laundry info');
    
    // Sanitize logo URLs to filter out invalid domains
    return {
      ...data,
      logo: sanitizeImageUrl(data.logo),
      logoUrl: sanitizeImageUrl(data.logoUrl),
    };
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
};

/**
 * Map service name from SaaS API to expected service type
 */
const mapServiceNameToType = (serviceName: string): 'NETTOYAGE' | 'REPASSAGE' | 'NETTOYAGE_A_SEC' => {
  const lowerName = serviceName.toLowerCase();
  
  if (lowerName.includes('repassage') || lowerName.includes('iron')) {
    return 'REPASSAGE';
  }
  if (lowerName.includes('sec') || lowerName.includes('dry')) {
    return 'NETTOYAGE_A_SEC';
  }
  // Default to NETTOYAGE for washing, lavage, cleaning, etc.
  return 'NETTOYAGE';
};

/**
 * Fetch all products and services for this laundry
 * Transforms SaaS API response to the expected format
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const url = getFullUrl(`/api/public/laundry/${laundryConfig.slug}/products`);
  console.log('📦 Fetching products from:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': laundryConfig.apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('📡 Products response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error('❌ Products API Error:', { status: response.status, error: errorText });
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📦 Raw API response:', JSON.stringify(data).substring(0, 500));
    
    // Handle both old format (array) and new format (object with products array)
    let rawProducts: any[];
    if (Array.isArray(data)) {
      // Old format: direct array of products
      rawProducts = data;
    } else if (data.products && Array.isArray(data.products)) {
      // New format: { laundry, products, totalProducts, totalServices }
      rawProducts = data.products;
    } else {
      console.error('❌ Unexpected API response format:', data);
      return [];
    }
    
    // Transform products to expected format
    const products: Product[] = rawProducts.map((item: any) => {
      // Transform services to expected format
      const services: ProductService[] = (item.services || []).map((svc: any) => ({
        id: svc.id,
        productId: item.id,
        service: svc.service || mapServiceNameToType(svc.name || ''),
        serviceType: svc.service || mapServiceNameToType(svc.name || ''),
        name: svc.name || svc.service,
        price: svc.price || item.price || 0,
      }));
      
      // Get the first service price as default product price
      const defaultPrice = services.length > 0 ? services[0].price : (item.price || 0);
      
      // Sanitize image URLs to filter out invalid domains
      const sanitizedImage = sanitizeImageUrl(item.image || item.imageUrl);
      
      return {
        id: item.id,
        name: item.name,
        description: item.description || null,
        category: item.category || 'GENERAL',
        image: sanitizedImage,
        imageUrl: sanitizedImage,
        status: item.status || 'ACTIVE',
        price: defaultPrice,
        services,
      };
    });
    
    console.log('✅ Successfully transformed', products.length, 'products');
    return products;
  } catch (error) {
    console.error('❌ Fetch products error:', error);
    throw error;
  }
};

/**
 * Create an order through the checkout API
 * This will create a customer if needed and create the order
 */
export const createOrder = async (
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  specialInstructions?: string,
  pickupScheduledAt?: string
): Promise<{ success: boolean; orderId: string; message: string }> => {
  try {
    const url = getFullUrl('/api/checkout');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': laundryConfig.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        laundrySlug: laundryConfig.slug,
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          serviceType: item.serviceType,
          quantity: item.quantity,
        })),
        customerInfo,
        specialInstructions,
        pickupScheduledAt,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create order');
    }
    
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create order');
  }
};

/**
 * Build checkout redirect URL
 * Redirects user to SaaS for authentication, then creates order
 */
export const getCheckoutUrl = (
  cartItems: CartItem[],
  customerInfo: Partial<CustomerInfo>
): string => {
  const returnUrl = `${laundryConfig.siteUrl}/order-success`;
  
  const params = new URLSearchParams({
    laundrySlug: laundryConfig.slug,
    returnUrl,
    cart: JSON.stringify(cartItems),
    customer: JSON.stringify(customerInfo),
  });
  
  return `${laundryConfig.saasUrl}/checkout?${params.toString()}`;
};
