'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { fetchLaundryInfo } from '@/lib/saas-api';
import type { LaundryInfo } from '@/lib/config';

function OrderSuccessContent() {
  const [laundryInfo, setLaundryInfo] = useState<LaundryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  useEffect(() => {
    const loadLaundryInfo = async () => {
      try {
        const data = await fetchLaundryInfo();
        setLaundryInfo(data);
        
        // Clear cart after successful order
        if (status === 'success' && typeof window !== 'undefined') {
          localStorage.removeItem('clean-fresh-cart');
        }
      } catch (error) {
        console.error('Failed to load laundry info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLaundryInfo();
  }, [status]);

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
      <header className="bg-white shadow-sm">
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
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for choosing {laundryInfo?.name || 'Clean & Fresh Laundry'}
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
              <p className="text-xl font-mono font-bold text-blue-600">{orderId}</p>
              <p className="text-xs text-gray-500 mt-2">Save this ID for tracking your order</p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email shortly with all the details.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pickup Scheduled</p>
                  <p className="text-sm text-gray-600">
                    We'll pick up your items within {laundryInfo?.slaHours || 24} hours at your specified address.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Professional Care</p>
                  <p className="text-sm text-gray-600">Your items will be cleaned with the highest quality standards.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-sm text-gray-600">We'll deliver your freshly cleaned items back to you!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need help with your order?</h3>
            <p className="text-gray-600 mb-4">Contact us anytime:</p>
            <div className="space-y-2">
              {laundryInfo?.phoneNumber && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${laundryInfo.phoneNumber}`} className="font-medium hover:underline">
                    {laundryInfo.phoneNumber}
                  </a>
                </div>
              )}
              {laundryInfo?.address && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{laundryInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Place Another Order
            </Link>
            <Link
              href="/"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Return to Home
            </Link>
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

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
