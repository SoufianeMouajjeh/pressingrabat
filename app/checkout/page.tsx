'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchLaundryInfo, createOrder } from '@/lib/saas-api';
import { useCartStore } from '@/lib/cart-store';
import type { LaundryInfo } from '@/lib/config';

export default function CheckoutPage() {
  const [laundryInfo, setLaundryInfo] = useState<LaundryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    addressType: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/services');
      return;
    }

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
  }, [items.length, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare order data
      const addressDetails = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        type: formData.addressType,
      };

      // Get laundry config from environment
      const saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || 'http://localhost:3000';
      const laundrySlug = process.env.NEXT_PUBLIC_LAUNDRY_SLUG || '';
      const apiKey = process.env.NEXT_PUBLIC_LAUNDRY_API_KEY || '';
      const returnUrl = `${window.location.origin}/order-success`;

      // Encode cart and address data as base64 to pass through URL
      // This works because the data needs to cross domain boundaries
      const orderData = {
        cart: items,
        address: addressDetails,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };
      
      const orderDataEncoded = btoa(JSON.stringify(orderData));

      // Redirect to SaaS complete-order page with all data in URL
      const authUrl = new URL(`${saasUrl}/complete-order`);
      authUrl.searchParams.set('laundrySlug', laundrySlug);
      authUrl.searchParams.set('apiKey', apiKey);
      authUrl.searchParams.set('returnUrl', returnUrl);
      authUrl.searchParams.set('orderData', orderDataEncoded);
      authUrl.searchParams.set('email', formData.email); // Pre-fill email
      
      window.location.href = authUrl.toString();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to proceed to checkout');
      setSubmitting(false);
    }
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
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Rabat"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Type
                    </label>
                    <select
                      id="addressType"
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="HOME">Home</option>
                      <option value="WORK">Work</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition shadow-lg ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.serviceId}`} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-gray-600 text-xs">{item.serviceName}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Free pickup within {laundryInfo?.slaHours || 24} hours</p>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Professional quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
