'use client';

import React, { useState, useEffect } from 'react';
import { Sparkle, Star, ShoppingBag, X } from 'lucide-react';

const API_BASE_URL = 'https://api-xmg2fjjbya-uc.a.run.app';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showingAll, setShowingAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const colorOptions = [
    { name: 'Red', value: '#DC2626' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Purple', value: '#9333EA' }
  ];

  // const categories = ['All', 'Pure Cotton', 'Block Print', 'Khadi Cotton', 'Chanderi', 'Banarasi'];

  // Helper function to get first image or placeholder
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return `${API_BASE_URL}${product.images[0]}`;
    }
    return '/images/placeholder-saree.jpg'; // Add a placeholder image
  };

  const isInStock = (product) => {
    if (typeof product.inStock === 'boolean') return product.inStock;
    if (typeof product.stock_quantity === 'number') return product.stock_quantity > 0;
    if (typeof product.stock === 'number') return product.stock > 0;
    return true;
  };

  // const getDaysAgo = (createdat) => {
  //   if (!createdat) return '-';
  //   const d = new Date(createdat);
  //   if (isNaN(d)) return '-';
  //   const now = new Date();
  //   const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  //   return diff === 0 ? 'Today' : `${diff} days ago`;
  // };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/new`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          fetch(`${API_BASE_URL}/api/products`)
            .then((res2) => res2.json())
            .then(setProducts)
            .catch(() => setProducts([]));
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const loadAllProducts = () => {
    setLoadingMore(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setShowingAll(true);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-6">
          <img src="/images/ne.jpeg" className="w-full h-full object-cover" alt="New Arrivals Banner" />
          <div className="absolute top-8 left-8 bg-gradient-to-r from-[#f9f7f2] via-[#fff] to-[#f9f7f2] text-[#a67c00] px-8 py-4 rounded-xl font-serif font-bold text-3xl shadow-xl backdrop-blur-sm flex items-center gap-4 border border-[#e8d9a8]">
            <Sparkle className="w-10 h-10 text-[#d4af37]" />
             Special Collection
          </div>
          <div className="absolute bottom-8 right-8 bg-white/90 text-amber-700 px-7 py-3 rounded-xl font-semibold text-xl shadow-lg">
            Fresh • Trending • Just Added
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <a href="/" className="hover:text-amber-700 transition">Home</a>
          <span>/</span>
          <a href="/collections" className="hover:text-amber-700 transition">Collections</a>
          <span>/</span>
          <span className="text-amber-700 font-semibold">Our Collections</span>
        </div>
      </div>
      {/* <div className="bg-white border-y border-amber-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 text-sm font-medium text-slate-700 hover:text-amber-700 transition-all whitespace-nowrap"
              >{category}</button>
            ))}
          </div>
        </div>
      </div> */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-amber-200 p-6 sticky top-20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">Clear All</button>
              </div>
              <div className="mb-6 pb-6 border-b border-amber-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Added</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500" /><span className="text-sm text-slate-700">Last 24 Hours</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last 3 Days</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last Week</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last Month</span></label>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-amber-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Price Range</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Under ₹2,000</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">₹2,000 - ₹4,000</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">₹4,000 - ₹6,000</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Above ₹6,000</span></label>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-amber-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Color</h4>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color, idx) => (
                    <button
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-slate-200 hover:border-amber-500 transition"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-amber-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Rating</h4>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-amber-600 rounded" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                        <span className="text-sm text-slate-700 ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Availability</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-amber-600 rounded" />
                  <span className="text-sm text-slate-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-4xl font-serif text-slate-900 font-bold mb-2 tracking-tight">
                  Explore Our Collections
                </h2>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{products.length}</span> New Products
                </p>
              </div>
            </div>
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-amber-100">
                      <h4 className="text-sm font-semibold text-slate-800 mb-4">Added</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last 24 Hours</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last 3 Days</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Last Week</span></label>
                      </div>
                    </div>
                    <div className="pb-6 border-b border-amber-100">
                      <h4 className="text-sm font-semibold text-slate-800 mb-4">Price Range</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">Under ₹2,000</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">₹2,000 - ₹4,000</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-amber-600 rounded" /><span className="text-sm text-slate-700">₹4,000 - ₹6,000</span></label>
                      </div>
                    </div>
                    <div className="pb-6 border-b border-amber-100">
                      <h4 className="text-sm font-semibold text-slate-800 mb-4">Color</h4>
                      <div className="grid grid-cols-6 gap-2">
                        {colorOptions.map((color, idx) => (
                          <button
                            key={idx}
                            className="w-8 h-8 rounded-full border-2 border-slate-200 hover:border-amber-500 transition"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all shadow-lg">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d4af37] mx-auto"></div>
                <p className="mt-4 text-slate-800">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product, idx) => (
                  <div key={product.product_id || product.id || idx} className="group bg-white rounded-2xl border border-[#e8d9a8] shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-[#faf7f0] to-[#e8decf] text-[#b88a44] text-xs font-semibold px-4 py-1 rounded-full shadow absolute top-5 left-5 z-10 flex gap-2 items-center">
                        <Sparkle className="w-4 h-4 text-[#d4af37]" /> New
                      </span>
                    )}
                    {/* <span className="bg-slate-800 text-[#d4af37] text-xs font-semibold px-3 py-1 rounded-full absolute top-5 right-5 z-10">
                      {getDaysAgo(product.createdat)}
                    </span> */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isInStock(product) ? 'opacity-60 blur-[2px]' : ''}`}
                        onError={e => {e.target.src = '/images/placeholder-saree.jpg'}}
                      />
                      {product.originalPrice && (
                        <div className="absolute bottom-3 right-3 flex flex-col items-end">
                          <span className="bg-[#d4af37] text-white text-xs font-bold px-4 py-1 rounded-xl mb-1 shadow">
                            Save ₹{product.originalPrice - product.price}
                          </span>
                          <span className="bg-[#b88a44] text-white px-2 py-1 rounded text-xs">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-7">
                      <div className="text-xs text-[#b88a44] font-medium mb-1">{product.category}</div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                        <span className="text-sm font-medium text-gray-700">{product.rating || 4.5}</span>
                        <span className="text-xs text-gray-400">({product.reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xl font-bold text-slate-800">₹{parseFloat(product.price).toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{`₹${parseFloat(product.originalPrice).toLocaleString()}`}</span>
                        )}
                      </div>
                      <button
                        disabled={!isInStock(product)}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow ${
                          isInStock(product)
                            ? 'bg-gradient-to-r from-[#faf7f0] to-[#e8decf] hover:from-[#f2e9db] hover:to-[#e0d4c0] text-[#b88a44]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5 text-[#b88a44]" />
                        {isInStock(product) ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!showingAll && !loading && (
              <div className="text-center mt-14">
                <button
                  onClick={loadAllProducts}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-[#faf7f0] to-[#e8decf] hover:from-[#f2e9db] hover:to-[#e0d4c0] text-[#b88a44] px-12 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  {loadingMore ? 'Loading...' : 'Load More Arrivals'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
