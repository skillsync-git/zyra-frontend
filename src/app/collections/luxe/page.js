'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingBag, Sparkle, Package, CheckCircle, X, User } from 'lucide-react';

const API_BASE_URL = 'https://zyra-website.onrender.com';

export default function LuxePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        console.log('✅ User logged in:', JSON.parse(userData));
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  useEffect(() => {
    fetchLuxeProducts();
  }, []);

  const fetchLuxeProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Fetched products:', data);
      
      // Filter and sort products by price (highest first) for Luxe collection
      const luxeProducts = data
        .filter(p => parseFloat(p.price) >= 5000 && p.stock_quantity > 0)
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        .slice(0, 12);
      
      console.log('✨ Luxe products:', luxeProducts);
      setProducts(luxeProducts);
    } catch (err) {
      console.error('❌ Error fetching luxe products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/images/placeholder-saree.jpg';
  };

  const calculateDiscount = (price) => {
    const originalPrice = parseFloat(price) * 1.3;
    const discount = originalPrice - parseFloat(price);
    const discountPercent = Math.round((discount / originalPrice) * 100);
    return { originalPrice, discount, discountPercent };
  };

  // Add to cart function with authentication check
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🛒 Add to cart clicked for product:', product);
    
    if (!user) {
      console.log('❌ User not logged in');
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No auth token found');
        showNotification('Please login again', 'error');
        setShowAuthModal(true);
        return;
      }

      const productId = parseInt(product.product_id);
      
      if (isNaN(productId)) {
        console.error('❌ Invalid product ID:', product.product_id);
        showNotification('Invalid product ID', 'error');
        return;
      }

      const payload = {
        product_id: productId,
        quantity: 1
      };
      
      console.log('📤 Sending to cart:', payload);

      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('📥 Cart response:', responseText);

      let data;
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          console.error('❌ Empty response from server');
          showNotification('Server returned empty response', 'error');
          return;
        }
      } catch (parseError) {
        console.error('❌ Failed to parse cart response:', parseError);
        showNotification('Server error: Invalid response format', 'error');
        return;
      }

      if (response.ok) {
        console.log('✅ Added to cart successfully:', data);
        showNotification(`${product.name} added to cart!`, 'success');
      } else {
        console.error('❌ Cart API error:', data);
        const errorMessage = data?.message || data?.error || data?.msg || 
                           `Server error (${response.status}): ${response.statusText}`;
        showNotification(errorMessage, 'error');
      }
    } catch (err) {
      console.error('❌ Network error adding to cart:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Add to wishlist function with authentication check
  const handleAddToWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('💖 Add to wishlist clicked for:', product);
    
    if (!user) {
      console.log('❌ User not logged in');
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No auth token found');
        showNotification('Please login again', 'error');
        setShowAuthModal(true);
        return;
      }

      console.log('📤 Sending to wishlist:', {
        product_id: product.product_id
      });

      const response = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.product_id
        })
      });

      const responseText = await response.text();
      console.log('📥 Wishlist response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse wishlist response:', parseError);
        showNotification('Server error. Please try again.', 'error');
        return;
      }

      if (response.ok) {
        console.log('✅ Added to wishlist successfully:', data);
        showNotification(`${product.name} added to wishlist!`, 'success');
      } else {
        console.error('❌ Wishlist API error:', data);
        showNotification(data.message || data.error || 'Failed to add to wishlist', 'error');
      }
    } catch (err) {
      console.error('❌ Network error adding to wishlist:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23264E] via-white to-[#23264E]">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Luxe Banner */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-4 sm:mb-6">
          <img
            src="/images/baner-1.jpg"
            className="w-full h-full object-cover"
            alt="Luxe Collection Banner"
          />
          <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 bg-gradient-to-r from-[#d4af37] to-[#23264E] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-serif font-bold text-lg sm:text-2xl md:text-3xl shadow-xl backdrop-blur-sm flex items-center gap-2 sm:gap-3 md:gap-4">
            <Sparkle className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#fff]" />
            <span className="hidden sm:inline">Luxe Saree Collection</span>
            <span className="sm:hidden">Luxe Collection</span>
          </div>
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 bg-[#23264E]/80 text-[#d4af37] px-3 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base md:text-xl shadow-lg">
            <span className="hidden md:inline">Exclusivity • Craftsmanship • Heritage</span>
            <span className="hidden sm:inline md:hidden">Exclusive • Premium</span>
            <span className="sm:hidden">Premium Quality</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mb-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <a href="/" className="hover:text-[#d4af37] transition">Home</a>
          <span>/</span>
          <a href="/collections" className="hover:text-[#d4af37] transition">Collections</a>
          <span>/</span>
          <span className="text-[#d4af37] font-semibold">Luxe</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#23264E] font-bold mb-4 sm:mb-6 md:mb-7 tracking-tight">
          Explore Exclusive Sarees
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#d4af37] mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base text-[#23264E]">Curating luxury garments for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading products</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={fetchLuxeProducts} 
              className="bg-[#d4af37] text-white px-6 py-2 rounded-full hover:bg-[#b68a10] transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 text-white">No luxury products available at the moment.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {products.map((product) => {
              const { originalPrice, discount, discountPercent } = calculateDiscount(product.price);
              
              return (
                <div key={product.product_id} className="group bg-white rounded-xl sm:rounded-2xl border border-[#d4af37]/20 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
                  {/* Exclusive Badge */}
                  <span className="bg-gradient-to-r from-[#d4af37] to-[#b68a10] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-0.5 sm:py-1 rounded-full shadow absolute top-3 sm:top-5 left-3 sm:left-5 z-10 flex gap-1 sm:gap-2 items-center">
                    <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" /> Exclusive
                  </span>

                  {/* Wishlist Button */}
                  <button 
                    className="absolute top-3 sm:top-5 right-3 sm:right-5 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition"
                    onClick={(e) => handleAddToWishlist(e, product)}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]" />
                  </button>

                  {/* Product Image */}
                  <a href={`/productdetail/${product.product_id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-saree.jpg';
                        }}
                      />
                      {/* Savings Badge */}
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex flex-col items-end gap-1">
                        <span className="bg-[#d4af37] text-[#23264E] text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow">
                          Save ₹{discount.toFixed(0)}
                        </span>
                        <span className="bg-[#23264E]/80 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Product Info */}
                  <div className="p-4 sm:p-5 md:p-7">
                    <h3 className="font-semibold text-[#23264E] text-sm sm:text-base md:text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#d4af37] fill-[#d4af37]" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">4.8</span>
                      <span className="text-[10px] sm:text-xs text-gray-400">(50+ reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-5">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#d4af37]">
                        ₹{parseFloat(product.price).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    {product.stock_quantity > 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 shadow bg-gradient-to-r from-[#d4af37] to-[#b68a10] hover:from-[#23264E] hover:to-[#d4af37] text-white"
                      >
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold bg-gray-300 text-gray-600 cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && products.length > 0 && (
          <div className="text-center mt-8 sm:mt-10 md:mt-14">
            <button className="bg-gradient-to-r from-[#23264E] to-[#d4af37] hover:from-[#d4af37] hover:to-[#23264E] text-white px-6 sm:px-10 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all">
              View More Luxe Sarees
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login or register to add items to your cart and wishlist</p>
              <div className="space-y-3">
                <a href="/login" className="block w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
                  Login
                </a>
                <a href="/register" className="block w-full bg-white text-amber-600 border-2 border-amber-600 py-3 rounded-lg font-semibold hover:bg-amber-50 transition">
                  Register
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
