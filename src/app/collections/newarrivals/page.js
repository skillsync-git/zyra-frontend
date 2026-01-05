'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkle, Star, ShoppingBag, X, SlidersHorizontal, 
  Heart, CheckCircle, User, Package 
} from 'lucide-react';

const API_BASE_URL = 'https://api-xmg2fjjbya-uc.a.run.app';

export default function NewArrivalsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showingAll, setShowingAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Authentication & Notifications
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Filter states
  const [filters, setFilters] = useState({
    timeAdded: [],
    priceRange: [],
    colors: [],
    rating: [],
    inStockOnly: false
  });

  // Notification Helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Check Authentication
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

  // Helper functions
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return `${API_BASE_URL}${product.images[0]}`;
    }
    return '/images/placeholder-saree.jpg';
  };

  const isInStock = (product) => {
    if (typeof product.inStock === 'boolean') return product.inStock;
    if (typeof product.stock_quantity === 'number') return product.stock_quantity > 0;
    if (typeof product.stock === 'number') return product.stock > 0;
    return true;
  };

  const getDaysAgo = (createdat) => {
    if (!createdat) return null;
    const d = new Date(createdat);
    if (isNaN(d)) return null;
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Navigation handler
  const handleProductClick = (product) => {
    router.push(`/productdetail/${product.product_id}`);
  };

  // Add to Cart Function
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

      console.log('📤 Sending to cart:', { product_id: productId, quantity: 1 });

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

  // Add to Wishlist Function - FIXED
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
        console.log('⚠️ Wishlist API returned error:', data);
        
        // Check if product is already in wishlist - HANDLE GRACEFULLY
        const errorMessage = data.message || data.error || '';
        if (errorMessage.toLowerCase().includes('already') || 
            errorMessage.toLowerCase().includes('exist')) {
          // Product already in wishlist - show friendly message as SUCCESS
          showNotification(`${product.name} is already in your wishlist`, 'success');
        } else {
          // Other actual errors
          showNotification(errorMessage || 'Failed to add to wishlist', 'error');
        }
      }
    } catch (err) {
      console.error('❌ Network error adding to wishlist:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Fetch products
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/new`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          fetch(`${API_BASE_URL}/api/products`)
            .then((res2) => res2.json())
            .then((allData) => {
              setProducts(allData);
              setFilteredProducts(allData);
            })
            .catch(() => {
              setProducts([]);
              setFilteredProducts([]);
            });
        }
      })
      .catch(() => {
        setProducts([]);
        setFilteredProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.timeAdded.length > 0) {
      filtered = filtered.filter(product => {
        const days = getDaysAgo(product.createdat);
        if (days === null) return false;
        
        return filters.timeAdded.some(timeFilter => {
          if (timeFilter === '24hours') return days <= 1;
          if (timeFilter === '3days') return days <= 3;
          if (timeFilter === '7days') return days <= 7;
          if (timeFilter === '30days') return days <= 30;
          return false;
        });
      });
    }

    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return filters.priceRange.some(range => {
          if (range === 'under2000') return price < 2000;
          if (range === '2000-4000') return price >= 2000 && price <= 4000;
          if (range === '4000-6000') return price >= 4000 && price <= 6000;
          if (range === 'above6000') return price > 6000;
          return false;
        });
      });
    }

    if (filters.rating.length > 0) {
      filtered = filtered.filter(product => {
        const rating = product.rating || 4.5;
        return filters.rating.some(minRating => rating >= minRating);
      });
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(product => isInStock(product));
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'inStockOnly') {
        newFilters.inStockOnly = !prev.inStockOnly;
      } else {
        const filterArray = newFilters[filterType];
        const index = filterArray.indexOf(value);
        
        if (index > -1) {
          newFilters[filterType] = filterArray.filter(item => item !== value);
        } else {
          newFilters[filterType] = [...filterArray, value];
        }
      }
      
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      timeAdded: [],
      priceRange: [],
      colors: [],
      rating: [],
      inStockOnly: false
    });
  };

  const loadAllProducts = () => {
    setLoadingMore(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setShowingAll(true);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  // Filter sidebar component
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? '' : 'bg-white rounded-2xl border border-amber-200 p-6 sticky top-20 shadow-lg'}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
        <button 
          onClick={clearAllFilters}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-amber-100">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">Price Range</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-amber-600 rounded"
              checked={filters.priceRange.includes('under2000')}
              onChange={() => handleFilterChange('priceRange', 'under2000')}
            />
            <span className="text-sm text-slate-700">Under ₹2,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-amber-600 rounded"
              checked={filters.priceRange.includes('2000-4000')}
              onChange={() => handleFilterChange('priceRange', '2000-4000')}
            />
            <span className="text-sm text-slate-700">₹2,000 - ₹4,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-amber-600 rounded"
              checked={filters.priceRange.includes('4000-6000')}
              onChange={() => handleFilterChange('priceRange', '4000-6000')}
            />
            <span className="text-sm text-slate-700">₹4,000 - ₹6,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-amber-600 rounded"
              checked={filters.priceRange.includes('above6000')}
              onChange={() => handleFilterChange('priceRange', 'above6000')}
            />
            <span className="text-sm text-slate-700">Above ₹6,000</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6 pb-6 border-b border-amber-100">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-amber-600 rounded"
                checked={filters.rating.includes(rating)}
                onChange={() => handleFilterChange('rating', rating)}
              />
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

      {/* Availability Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-4 h-4 text-amber-600 rounded"
            checked={filters.inStockOnly}
            onChange={() => handleFilterChange('inStockOnly')}
          />
          <span className="text-sm text-slate-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
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

      {/* Banner */}
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-6">
          <img src="/images/ne.jpeg" className="w-full h-full object-cover" alt="New Arrivals Banner" />
          <div className="absolute top-8 left-8 bg-gradient-to-r from-[#f9f7f2] via-[#fff] to-[#f9f7f2] text-[#a67c00] px-8 py-4 rounded-xl font-serif font-bold text-3xl shadow-xl backdrop-blur-sm flex items-center gap-4 border border-[#e8d9a8]">
            <Sparkle className="w-10 h-10 text-[#d4af37]" />
            New Arrivals Collection
          </div>
          <div className="absolute bottom-8 right-8 bg-white/90 text-amber-700 px-7 py-3 rounded-xl font-semibold text-xl shadow-lg">
            Fresh • Trending • Just Added
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <a href="/" className="hover:text-amber-700 transition">Home</a>
          <span>/</span>
          <a href="/collections" className="hover:text-amber-700 transition">Collections</a>
          <span>/</span>
          <span className="text-amber-700 font-semibold">New Arrivals</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-4xl font-serif text-slate-900 font-bold mb-2 tracking-tight">
                  Explore New Arrivals
                </h2>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{filteredProducts.length}</span> New Products
                </p>
              </div>
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Mobile Filter Sidebar */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>
                  <FilterSidebar isMobile />
                  <div className="mt-6 pt-6 border-t">
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all shadow-lg"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d4af37] mx-auto"></div>
                <p className="mt-4 text-slate-800">Loading new arrivals...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 text-lg">No products match your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <div 
                    key={product.product_id || product.id || idx} 
                    className="group bg-white rounded-2xl border border-amber-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-[#faf7f0] to-[#e8decf] text-[#b88a44] text-xs font-semibold px-4 py-1 rounded-full shadow absolute top-5 left-5 z-10 flex gap-2 items-center">
                        <Sparkle className="w-4 h-4 text-[#d4af37]" /> New
                      </span>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleAddToWishlist(e, product)}
                      className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white shadow hover:bg-amber-50 transition"
                    >
                      <Heart className="w-5 h-5 text-amber-600" />
                    </button>

                    <div 
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
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
                    
                    <div className="p-6">
                      <div className="text-xs text-[#b88a44] font-medium mb-1">{product.category}</div>
                      <h3 
                        className="font-semibold text-slate-800 text-lg mb-2 line-clamp-2 cursor-pointer hover:text-amber-700 transition min-h-[3.5rem]"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${
                              i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{product.rating || 4.5}</span>
                        <span className="text-xs text-gray-400">({product.reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xl font-bold text-slate-800">₹{parseFloat(product.price).toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">₹{parseFloat(product.originalPrice).toLocaleString()}</span>
                        )}
                      </div>
                      
                      {isInStock(product) ? (
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow bg-amber-600 text-white hover:bg-amber-700"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl font-semibold bg-gray-300 text-gray-600 cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showingAll && !loading && filteredProducts.length > 0 && (
              <div className="text-center mt-14">
                <button
                  onClick={loadAllProducts}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Arrivals'}
                </button>
              </div>
            )}
          </div>
        </div>
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