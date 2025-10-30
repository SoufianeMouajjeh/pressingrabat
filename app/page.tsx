'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchLaundryInfo } from '@/lib/saas-api';
import { LaundryInfo } from '@/lib/config';
import { useCartStore } from '@/lib/cart-store';

export default function HomePage() {
  const [laundryInfo, setLaundryInfo] = useState<LaundryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    fetchLaundryInfo()
      .then(setLaundryInfo)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {laundryInfo?.logo && (
              <img 
                src={laundryInfo.logo} 
                alt={laundryInfo.name} 
                className="h-12 w-auto"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {laundryInfo?.name || 'Clean & Fresh Laundry'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/services"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Services
            </Link>
            <Link 
              href="/cart"
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Professional Laundry Services
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          High-quality cleaning and pressing services delivered to your door.
          Fast, reliable, and affordable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/services"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            View Services
          </Link>
          <a 
            href={`tel:${laundryInfo?.phoneNumber}`}
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Call Us
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Pickup & Delivery</h3>
            <p className="text-gray-600">
              We pick up and deliver right to your door at no extra cost
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">
              {laundryInfo?.slaHours || 48} Hour Service
            </h3>
            <p className="text-gray-600">
              Fast turnaround time guaranteed on all orders
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Professional cleaning with care for your garments
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-lg mb-4">{laundryInfo?.address}</p>
          <p className="text-lg">
            Call us: <a href={`tel:${laundryInfo?.phoneNumber}`} className="font-bold underline">
              {laundryInfo?.phoneNumber}
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 {laundryInfo?.name || 'Clean & Fresh Laundry'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
