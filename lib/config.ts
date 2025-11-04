/**
 * Configuration for Clean & Fresh Laundry Website
 * Connected to the main SaaS platform
 */

// Debug: Log environment variables
console.log('🔧 Environment Variables Check:', {
  NEXT_PUBLIC_SAAS_URL: process.env.NEXT_PUBLIC_SAAS_URL,
  NEXT_PUBLIC_LAUNDRY_SLUG: process.env.NEXT_PUBLIC_LAUNDRY_SLUG,
  NEXT_PUBLIC_LAUNDRY_API_KEY: process.env.NEXT_PUBLIC_LAUNDRY_API_KEY?.substring(0, 10) + '...',
});

export const laundryConfig = {
  // Laundry identification
  slug: 'clean-fresh-laundry',
  apiKey: 'wp_2hmoc70526zqpwdqc3keo',
  
  // SaaS platform URLs - HARDCODED for development
  saasUrl: 'http://localhost:3000',
  siteUrl: 'http://localhost:3001',
  
  // Branding (will be fetched from API)
  name: 'Clean & Fresh Laundry',
  logo: null as string | null,
  primaryColor: '#3B82F6',
}

// Debug: Log final config
console.log('⚙️ Laundry Config Loaded:', {
  slug: laundryConfig.slug,
  apiKey: laundryConfig.apiKey.substring(0, 10) + '...',
  saasUrl: laundryConfig.saasUrl,
  siteUrl: laundryConfig.siteUrl,
});

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
