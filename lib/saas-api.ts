/**
 * API Client for communicating with the SaaS platform
 * All requests include the API key for authentication
 */

import axios from 'axios';
import { laundryConfig, LaundryInfo, Product, CartItem, CustomerInfo } from './config';

// Create axios instance with default config
const api = axios.create({
  baseURL: laundryConfig.saasUrl,
  headers: {
    'x-api-key': laundryConfig.apiKey,
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch laundry information (branding, contact info)
 */
export const fetchLaundryInfo = async (): Promise<LaundryInfo> => {
  const response = await api.get(`/api/public/laundry/${laundryConfig.slug}/info`);
  return response.data;
};

/**
 * Fetch all products and services for this laundry
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get(`/api/public/laundry/${laundryConfig.slug}/products`);
  return response.data;
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
    const response = await api.post('/api/checkout', {
      laundrySlug: laundryConfig.slug,
      cartItems: cartItems.map(item => ({
        productId: item.productId,
        serviceType: item.serviceType,
        quantity: item.quantity,
      })),
      customerInfo,
      specialInstructions,
      pickupScheduledAt,
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to create order');
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
