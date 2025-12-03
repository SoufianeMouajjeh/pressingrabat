'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchLaundryInfo } from '@/lib/saas-api';
import { useCartStore } from '@/lib/cart-store';
import type { LaundryInfo } from '@/lib/config';

// Known invalid image domains
const INVALID_IMAGE_DOMAINS = ['laundry-app.com', 'example.com'];

const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return !INVALID_IMAGE_DOMAINS.some(domain => urlObj.hostname.endsWith(domain));
  } catch {
    return true; // Relative URLs are fine
  }
};

export default function CartPage() {
  const [laundryInfo, setLaundryInfo] = useState<LaundryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const loadLaundryInfo = async () => {
      try {
        const data = await fetchLaundryInfo();
        setLaundryInfo(data);
      } catch (error) {
        console.error('Failed to load laundry info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLaundryInfo();
  }, []);

  const handleQuantityChange = (productId: string, serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId, serviceId);
    } else {
      updateQuantity(productId, serviceId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Store cart data in sessionStorage
    const cartData = {
      items: items,
      total: getTotalPrice(),
      timestamp: Date.now()
    };
    sessionStorage.setItem('pendingOrderCart', JSON.stringify(cartData));
    
    // Prepare order data for SaaS
    const saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || 'http://localhost:3000';
    const laundrySlug = process.env.NEXT_PUBLIC_LAUNDRY_SLUG || 'clean-fresh-laundry';
    const apiKey = process.env.NEXT_PUBLIC_LAUNDRY_API_KEY || 'wp_2hmoc70526zqpwdqc3keo';
    const returnUrl = `${window.location.origin}/order-success`;
    
    // Encode cart items for URL
    const orderData = {
      cart: items
    };
    const orderDataEncoded = btoa(JSON.stringify(orderData));
    
    // Redirect to SaaS authentication/checkout
    const checkoutUrl = new URL(`${saasUrl}/checkout-flow`);
    checkoutUrl.searchParams.set('laundrySlug', laundrySlug);
    checkoutUrl.searchParams.set('apiKey', apiKey);
    checkoutUrl.searchParams.set('returnUrl', returnUrl);
    checkoutUrl.searchParams.set('orderData', orderDataEncoded);
    
    window.location.href = checkoutUrl.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              {laundryInfo?.logo && (
                <Image
                  src={laundryInfo.logo}
                  alt={laundryInfo.name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              )}
              <span className="text-xl font-bold text-gray-900">
                {laundryInfo?.name || 'Clean & Fresh Laundry'}
              </span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
                Home
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 transition">
                Services
              </Link>
              <Link href="/cart" className="text-blue-600 font-semibold">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Link
              href="/services"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.serviceId}`} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {isValidImageUrl(item.image) || isValidImageUrl(item.imageUrl) ? (
                        <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={(isValidImageUrl(item.image) ? item.image : item.imageUrl) || ''}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.serviceName}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.serviceId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.serviceId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId, item.serviceId)}
                      className="text-red-600 hover:text-red-700 p-2 transition"
                      aria-label="Remove item"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Item Subtotal:</span>
                    <span className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-100 transition"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({getTotalItems()}):</span>
                    <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Checkout
                </button>

                <Link
                  href="/services"
                  className="block w-full text-center text-blue-600 py-3 px-4 mt-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Continue Shopping
                </Link>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Free pickup and delivery within {laundryInfo?.slaHours || 24} hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} {laundryInfo?.name || 'Clean & Fresh Laundry'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
