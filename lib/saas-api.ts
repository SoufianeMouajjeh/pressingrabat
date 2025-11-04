/**
 * API C// Helper function to build full URL
const getFullUrl = (path: string): string => {
  // If saasUrl is set, use it as base
  if (laundryConfig.saasUrl) {
    return `${laundryConfig.saasUrl}${path}`;
  }
  
  // For server-side calls without saasUrl, construct full URL
  // This works in development when the API routes are in the same Next.js app
  if (typeof window === 'undefined') {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || `localhost:${process.env.PORT || 3000}`;
    return `${protocol}://${host}${path}`;
  }
  
  // For client-side calls, use relative path (works with same-origin API routes)
  return path;
};or communicating with the SaaS platform
 * All requests include the API key for authentication
 * 
 * VERSION: 2.0.0 - Updated with fallback URLs and extensive debugging
 */

// Force console log to verify this file is loaded
console.log('📦 saas-api.ts loaded - VERSION 2.0.0');

import { laundryConfig, LaundryInfo, Product, CartItem, CustomerInfo } from './config';

// Helper function to build full URL - SIMPLIFIED
const getFullUrl = (path: string): string => {
  // Always use the SaaS URL from config (hardcoded to localhost:3000)
  const fullUrl = `${laundryConfig.saasUrl}${path}`;
  console.log('🔗 API URL:', fullUrl);
  return fullUrl;
};

/**
 * Fetch laundry information (branding, contact info)
 */
export const fetchLaundryInfo = async (): Promise<LaundryInfo> => {
  const url = getFullUrl(`/api/public/laundry/${laundryConfig.slug}/info`);
  
  const response = await fetch(url, {
    headers: {
      'x-api-key': laundryConfig.apiKey,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch laundry info: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetch all products and services for this laundry
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const url = getFullUrl(`/api/public/laundry/${laundryConfig.slug}/products`);
  const response = await fetch(url, {
    headers: {
      'x-api-key': laundryConfig.apiKey,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
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
