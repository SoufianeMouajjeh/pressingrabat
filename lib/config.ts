/**
 * Configuration for Clean & Fresh Laundry Website
 * Connected to the main SaaS platform
 */

export const laundryConfig = {
  // Laundry identification
  slug: process.env.NEXT_PUBLIC_LAUNDRY_SLUG || 'clean-fresh-laundry',
  apiKey: process.env.NEXT_PUBLIC_LAUNDRY_API_KEY || '',
  
  // SaaS platform URLs
  // Use empty string to make API calls relative to the current Next.js app
  saasUrl: process.env.NEXT_PUBLIC_SAAS_URL || '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  
  // Branding (will be fetched from API)
  name: 'Clean & Fresh Laundry',
  logo: null as string | null,
  primaryColor: '#3B82F6',
}

export type LaundryInfo = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  slaHours: number;
  websiteUrl: string | null;
  logo: string | null;
  logoUrl?: string | null;
  primaryColor: string | null;
}

export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image: string | null;
  imageUrl?: string | null;
  status: string;
  price: number;
  services: ProductService[];
}

export type ProductService = {
  id: string;
  productId: string;
  service: 'NETTOYAGE' | 'REPASSAGE' | 'NETTOYAGE_A_SEC';
  serviceType?: 'NETTOYAGE' | 'REPASSAGE' | 'NETTOYAGE_A_SEC'; // For backward compatibility
  name?: string; // Display name
  price?: number; // For display, actual pricing from Product
}

export type CartItem = {
  productId: string;
  productName: string;
  serviceId: string;
  serviceName: string;
  serviceType: 'NETTOYAGE' | 'REPASSAGE' | 'NETTOYAGE_A_SEC';
  price: number;
  quantity: number;
  image?: string | null;
  imageUrl?: string;
}

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  addressDetails: {
    street: string;
    city: string;
    postalCode: string;
    type: 'HOME' | 'WORK' | 'OTHER';
  };
}
