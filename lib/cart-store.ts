/**
 * Shopping Cart Store using Zustand
 * Persists to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './config';

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
        set((state) => {
          // Check if item already exists
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.serviceType === newItem.serviceType
          );
          
          if (existingIndex >= 0) {
            // Update quantity
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          
          // Add new item
          return { items: [...state.items, newItem] };
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
    }
  )
);
