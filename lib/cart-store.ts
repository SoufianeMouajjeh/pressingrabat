/**
 * Shopping Cart Store using Zustand
 * Persists to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './config';

// Known invalid image domains that should be filtered out
const INVALID_IMAGE_DOMAINS = [
  'laundry-app.com',
  'example.com',
];

/**
 * Sanitize image URL - returns undefined for invalid domains
 */
const sanitizeImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  
  try {
    const urlObj = new URL(url);
    for (const invalidDomain of INVALID_IMAGE_DOMAINS) {
      if (urlObj.hostname.endsWith(invalidDomain)) {
        return undefined;
      }
    }
    return url;
  } catch {
    return url;
  }
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, serviceType: string) => void;
  updateQuantity: (productId: string, serviceType: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        // Sanitize image URLs before storing
        const sanitizedItem = {
          ...newItem,
          image: sanitizeImageUrl(newItem.image),
          imageUrl: sanitizeImageUrl(newItem.imageUrl),
        };
        
        set((state) => {
          // Check if item already exists
          const existingIndex = state.items.findIndex(
            (item) => item.productId === sanitizedItem.productId && item.serviceType === sanitizedItem.serviceType
          );
          
          if (existingIndex >= 0) {
            // Update quantity
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += sanitizedItem.quantity;
            return { items: updatedItems };
          }
          
          // Add new item
          return { items: [...state.items, sanitizedItem] };
        });
      },
      
      removeItem: (productId, serviceType) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.serviceType === serviceType)
          ),
        }));
      },
      
      updateQuantity: (productId, serviceType, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0
            return {
              items: state.items.filter(
                (item) => !(item.productId === productId && item.serviceType === serviceType)
              ),
            };
          }
          
          const updatedItems = state.items.map((item) =>
            item.productId === productId && item.serviceType === serviceType
              ? { ...item, quantity }
              : item
          );
          
          return { items: updatedItems };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'clean-fresh-cart', // localStorage key
      // Migrate existing items to sanitize image URLs
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sanitize image URLs in existing cart items
          const sanitizedItems = state.items.map(item => ({
            ...item,
            image: sanitizeImageUrl(item.image),
            imageUrl: sanitizeImageUrl(item.imageUrl),
          }));
          state.items = sanitizedItems;
        }
      },
    }
  )
);
