'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Zap, Loader2, Clock, Tag, TrendingDown, Filter, X, Heart, CheckCircle, User } from 'lucide-react';

const API_BASE_URL = 'https://zyra-website.onrender.com';

// Countdown Timer Component
function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function updateCountdown() {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      if (diff === 0) {
        setExpired(true);
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (expired) {
    return <span className="text-red-600 font-bold">EXPIRED</span>;
  }

  return (
    <div className="flex gap-2 items-center font-mono">
      {timeLeft.days > 0 && (
        <div className="bg-red-600 text-white px-2 py-1 rounded text-sm">
          {timeLeft.days}d
        </div>
      )}
      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <span className="text-red-600">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <span className="text-red-600">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded text-sm">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, sale, onAddToCart, onAddToWishlist, onClick }) {
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 relative cursor-pointer"
      onClick={onClick}
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-bold flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          {Math.round(product.discount_percent)}% OFF
        </span>
      </div>

      {/* Savings Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
          Save ₹{product.savings}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
        <img
          src={product.images && product.images[0] ? product.images[0] : '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-16 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            className="p-2 rounded-full bg-white shadow hover:bg-amber-50 transition"
          >
            <Heart className="w-4 h-4 text-amber-600" />
          </button>
        </div>
        
        {/* Sale Badge Overlay */}
        {sale.promotional_text && (
          <div className="absolute bottom-3 left-3 right-3">
            <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md block text-center">
              {sale.promotional_text}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-orange-600">
              ₹{product.sale_price.toLocaleString()}
            </span>
            <span className="text-lg text-slate-400 line-through">
              ₹{product.original_price.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-green-600 font-semibold">
            You save ₹{product.savings} ({product.discount_percent}% off)
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${
              i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
            }`} />
          ))}
          <span className="text-xs text-slate-600 ml-1">(4.5)</span>
        </div>

        {/* Stock Status */}
        {product.stock_quantity > 0 ? (
          <p className="text-xs text-slate-500 mb-3">
            {product.stock_quantity < 10 
              ? `Only ${product.stock_quantity} left!` 
              : 'In Stock'}
          </p>
        ) : (
          <p className="text-xs text-red-600 mb-3 font-semibold">Out of Stock</p>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={product.stock_quantity === 0}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-300 ${
            product.stock_quantity > 0
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default function SalePage() {
  const [activeSales, setActiveSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleProducts, setSaleProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

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
    fetchActiveSales();
  }, []);

  useEffect(() => {
    if (activeSales.length > 0 && !selectedSale) {
      loadSaleProducts(activeSales[0].sale_id);
    }
  }, [activeSales]);

  // Apply filters whenever filter states or products change
  useEffect(() => {
    let filtered = [...saleProducts];

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }

    // Filter by price range
    filtered = filtered.filter(p => 
      p.sale_price >= priceRange.min && p.sale_price <= priceRange.max
    );

    // Filter by discount percentage
    if (selectedDiscounts.length > 0) {
      filtered = filtered.filter(p => {
        return selectedDiscounts.some(discount => {
          return (
            p.discount_percent >= discount &&
            p.discount_percent < discount + 10
          );
        });
      });
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.sale_price - b.sale_price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.sale_price - a.sale_price);
    } else if (sortBy === 'discount-high') {
      filtered.sort((a, b) => b.discount_percent - a.discount_percent);
    } else if (sortBy === 'savings-high') {
      filtered.sort((a, b) => b.savings - a.savings);
    }

    setFilteredProducts(filtered);
  }, [saleProducts, priceRange, selectedDiscounts, inStockOnly, sortBy]);

  const fetchActiveSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sales/active`);
      if (res.ok) {
        const data = await res.json();
        setActiveSales(data);
      } else {
        setActiveSales([]);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      setActiveSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSaleProducts = async (saleId) => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sales/${saleId}/products`);
      if (res.ok) {
        const data = await res.json();
        setSelectedSale(data.sale);
        setSaleProducts(data.products);
        
        // Set initial price range based on products
        if (data.products.length > 0) {
          const prices = data.products.map(p => p.sale_price);
          setPriceRange({
            min: 0,
            max: Math.max(...prices)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setSaleProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Add to cart function with authentication check
  const handleAddToCart = async (product) => {
    console.log('🛒 Add to cart clicked for product:', product);
    console.log('🛒 Product ID type:', typeof product.product_id);
    console.log('🛒 Product ID value:', product.product_id);
    
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

      console.log('👤 Current user:', user);
      
      // Ensure product_id is a number
      const productId = parseInt(product.product_id);
      
      if (isNaN(productId)) {
        console.error('❌ Invalid product ID:', product.product_id);
        showNotification('Invalid product ID', 'error');
        return;
      }

      // Log the exact payload being sent
      const payload = {
        product_id: productId,
        quantity: 1
      };
      
      console.log('📤 Sending to cart:', payload);
      console.log('📤 Request URL:', `${API_BASE_URL}/api/cart/add`);
      console.log('📤 Token (first 20 chars):', token.substring(0, 20) + '...');

      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: 1
        })
      });

      console.log('📥 Cart response status:', response.status);
      console.log('📥 Cart response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first for debugging
      const responseText = await response.text();
      console.log('📥 Cart response text:', responseText);
      console.log('📥 Response text length:', responseText.length);

      let data;
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log('📥 Parsed cart response:', data);
        } else {
          console.error('❌ Empty response from server');
          showNotification('Server returned empty response', 'error');
          return;
        }
      } catch (parseError) {
        console.error('❌ Failed to parse cart response:', parseError);
        console.error('❌ Response text was:', responseText);
        showNotification('Server error: Invalid response format', 'error');
        return;
      }

      if (response.ok) {
        console.log('✅ Added to cart successfully:', data);
        showNotification(`${product.name} added to cart!`, 'success');
      } else {
        console.error('❌ Cart API error:', data);
        console.error('❌ Full error details:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        // Better error message handling
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
  const handleAddToWishlist = async (product) => {
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

      console.log('📥 Wishlist response status:', response.status);

      const responseText = await response.text();
      console.log('📥 Wishlist response text:', responseText);

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

  const handleProductClick = (productId) => {
    window.location.href = `/productdetail/${productId}`;
  };

  const handleDiscountToggle = (discount) => {
    setSelectedDiscounts(prev =>
      prev.includes(discount)
        ? prev.filter(d => d !== discount)
        : [...prev, discount]
    );
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 100000 });
    setSelectedDiscounts([]);
    setInStockOnly(false);
    setSortBy('default');
  };

  const getEarliestEndTime = () => {
    if (activeSales.length === 0) return null;
    return activeSales.reduce((earliest, sale) => 
      new Date(sale.end_datetime) < new Date(earliest) 
        ? sale.end_datetime 
        : earliest
    , activeSales[0].end_datetime);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-white">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-16 h-16 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  const earliestEndTime = getEarliestEndTime();
  const maxPrice = saleProducts.length > 0 ? Math.max(...saleProducts.map(p => p.sale_price)) : 100000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-white">
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

      {/* Urgency Banner */}
      {earliestEndTime && (
        <div className="top-0 z-50 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 animate-pulse" />
                <span className="font-bold text-lg">
                  LIMITED TIME SALE - Don't Miss Out!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-semibold">Sale ends in:</span>
                <Countdown endTime={earliestEndTime} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <a href="/" className="hover:text-orange-700 transition">Home</a>
            <span>/</span>
            <span className="text-orange-700 font-semibold">Limited Time Sale</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSales.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="mb-4">
              <Tag className="w-16 h-16 mx-auto text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Sales</h2>
            <p className="text-slate-600">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <>
            {/* Sale Tabs */}
            {activeSales.length > 1 && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {activeSales.map((sale) => (
                    <button
                      key={sale.sale_id}
                      onClick={() => loadSaleProducts(sale.sale_id)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        selectedSale?.sale_id === sale.sale_id
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-bold">{sale.category_name}</div>
                        <div className="text-xs opacity-90">
                          {sale.promotional_text} - {sale.discount_percent}% OFF
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Sale Header */}
            {selectedSale && (
              <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                      {selectedSale.category_name} Sale
                    </h1>
                    <p className="text-xl text-orange-600 font-semibold mb-1">
                      {selectedSale.promotional_text}
                    </p>
                    <p className="text-slate-600">
                      Get up to <span className="font-bold text-red-600">{selectedSale.discount_percent}%</span> off on all products!
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Sale ends in:
                    </div>
                    <Countdown endTime={selectedSale.end_datetime} />
                  </div>
                </div>
              </div>
            )}

            {/* Filters and Products */}
            {productsLoading ? (
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : saleProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-xl text-slate-600">No products available in this sale yet.</p>
              </div>
            ) : (
              <div className="flex gap-6">
                {/* Filters Sidebar - Desktop */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <div className="bg-white rounded-xl p-6 sticky top-24 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                      <button 
                        className="text-sm text-orange-700 hover:text-orange-800 font-medium"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Sort By */}
                    <div className="mb-6 pb-6 border-b">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Sort By</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="default">Default</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="discount-high">Discount: High to Low</option>
                        <option value="savings-high">Savings: High to Low</option>
                      </select>
                    </div>

                    {/* Discount Filter */}
                    <div className="mb-6 pb-6 border-b">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Discount</h4>
                      <div className="space-y-2">
                        {[50, 40, 30, 20, 10].map((discount) => (
                          <label key={discount} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-orange-600 rounded"
                              checked={selectedDiscounts.includes(discount)}
                              onChange={() => handleDiscountToggle(discount)}
                            />
                            <span className="text-sm text-slate-700">{discount}% and above</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6 pb-6 border-b">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Price Range</h4>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>₹0</span>
                          <span>₹{priceRange.max.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Availability</h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-orange-600 rounded"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <span className="text-sm text-slate-700">In Stock Only</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Modal */}
                {showFilters && (
                  <div className="fixed inset-0 z-50 lg:hidden">
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50"
                      onClick={() => setShowFilters(false)}
                    />
                    
                    <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                          <div className="flex items-center gap-3">
                            <button 
                              className="text-sm text-orange-700 hover:text-orange-800 font-medium"
                              onClick={clearAllFilters}
                            >
                              Clear All
                            </button>
                            <button 
                              onClick={() => setShowFilters(false)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b">
                          <h4 className="text-sm font-semibold text-slate-800 mb-3">Sort By</h4>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="discount-high">Discount: High to Low</option>
                            <option value="savings-high">Savings: High to Low</option>
                          </select>
                        </div>

                        <div className="mb-6 pb-6 border-b">
                          <h4 className="text-sm font-semibold text-slate-800 mb-3">Discount</h4>
                          <div className="space-y-2">
                            {[50, 40, 30, 20, 10].map((discount) => (
                              <label key={discount} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 rounded"
                                  checked={selectedDiscounts.includes(discount)}
                                  onChange={() => handleDiscountToggle(discount)}
                                />
                                <span className="text-sm text-slate-700">{discount}% and above</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b">
                          <h4 className="text-sm font-semibold text-slate-800 mb-3">Price Range</h4>
                          <div className="space-y-3">
                            <input
                              type="range"
                              min="0"
                              max={maxPrice}
                              value={priceRange.max}
                              onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span>₹0</span>
                              <span>₹{priceRange.max.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-slate-800 mb-3">Availability</h4>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-orange-600 rounded"
                              checked={inStockOnly}
                              onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            <span className="text-sm text-slate-700">In Stock Only</span>
                          </label>
                        </div>

                        <button
                          onClick={() => setShowFilters(false)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="flex-1">
                  <div className="lg:hidden mb-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="font-medium">Filters</span>
                    </button>
                  </div>

                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                      {filteredProducts.length} Products on Sale
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                        sale={selectedSale}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onClick={() => handleProductClick(product.product_id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA Banner */}
      {activeSales.length > 0 && earliestEndTime && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-3">Don't Miss These Amazing Deals!</h3>
            <div className="text-lg mb-4 opacity-90 flex items-center justify-center gap-2">
              <span>Sale ends in: </span>
              <Countdown endTime={earliestEndTime} />
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      )}

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
