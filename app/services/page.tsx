'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts, fetchLaundryInfo } from '@/lib/saas-api';
import { useCartStore } from '@/lib/cart-store';
import type { Product, LaundryInfo } from '@/lib/config';

export default function ServicesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [laundryInfo, setLaundryInfo] = useState<LaundryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  
  const { addItem, items } = useCartStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, laundryData] = await Promise.all([
          fetchProducts(),
          fetchLaundryInfo()
        ]);
        setProducts(productsData);
        setLaundryInfo(laundryData);
        
        // Set default service for each product
        const defaults: Record<string, string> = {};
        productsData.forEach(product => {
          if (product.services && product.services.length > 0) {
            defaults[product.id] = product.services[0].id;
          }
        });
        setSelectedServices(defaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getServiceName = (serviceType: string) => {
    const names: Record<string, string> = {
      'NETTOYAGE': 'Washing',
      'REPASSAGE': 'Ironing',
      'NETTOYAGE_A_SEC': 'Dry Cleaning'
    };
    return names[serviceType] || serviceType;
  };

  const handleAddToCart = (product: Product) => {
    const serviceId = selectedServices[product.id];
    const service = product.services?.find(s => s.id === serviceId);
    
    if (!service) {
      alert('Please select a service');
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      serviceId: service.id,
      serviceName: getServiceName(service.service),
      serviceType: service.service,
      price: product.price,
      quantity: 1,
      imageUrl: product.image || undefined
    });

    // Show "Added to Cart" feedback
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
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
              <Link href="/services" className="text-blue-600 font-semibold">
                Services
              </Link>
              <Link href="/cart" className="relative">
                <svg className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Professional laundry and dry cleaning services for all your needs
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {/* Product Image */}
                {product.image ? (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  )}

                  {/* Service Options */}
                  {product.services && product.services.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Service:
                      </label>
                      <select
                        value={selectedServices[product.id] || ''}
                        onChange={(e) => setSelectedServices(prev => ({
                          ...prev,
                          [product.id]: e.target.value
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {product.services.map(service => (
                          <option key={service.id} value={service.id}>
                            {getServiceName(service.service)} - ${product.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedToCart[product.id]}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      addedToCart[product.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {addedToCart[product.id] ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Cart Button */}
        {getTotalItems() > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/cart"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
            </Link>
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
