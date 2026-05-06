'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  Leaf,
  X,
  SlidersHorizontal,
  CheckCircle
} from 'lucide-react';

const API_BASE_URL = 'https://zyra-website.onrender.com';

const colorOptions = [
  { name: 'Red', value: '#DC2626' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Purple', value: '#9333EA' }
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const selectedCategory = params?.category;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]); // array of product_id
  const [cart, setCart] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // auth + notification
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  // Filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

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

  // Add to cart with backend
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showNotification('Please login again', 'error');
        setShowAuthModal(true);
        return;
      }

      const productId = parseInt(product.product_id);
      if (isNaN(productId)) {
        showNotification('Invalid product ID', 'error');
        return;
      }

      const payload = { product_id: productId, quantity: 1 };

      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let data = {};
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          showNotification('Server error: Invalid response format', 'error');
          return;
        }
      }

      if (response.ok) {
        setCart((prev) => [...prev, product]);
        showNotification(`${product.name} added to cart!`, 'success');
      } else {
        const errorMessage =
          data?.message ||
          data?.error ||
          data?.msg ||
          `Server error (${response.status}): ${response.statusText}`;
        showNotification(errorMessage, 'error');
      }
    } catch (err) {
      console.error('❌ Network error adding to cart:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Add to wishlist with backend
  const handleAddToWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Prevent duplicate calls if already in wishlist state
    if (wishlist.includes(product.product_id)) {
      showNotification('Already in wishlist', 'success');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showNotification('Please login again', 'error');
        setShowAuthModal(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.product_id })
      });

      const responseText = await response.text();
      let data = {};
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          showNotification('Server error. Please try again.', 'error');
          return;
        }
      }

      if (response.ok) {
        // update local wishlist product_id list
        setWishlist((prev) => [...prev, product.product_id]);
        showNotification(`${product.name} added to wishlist!`, 'success');
      } else {
        showNotification(
          data.message || data.error || 'Failed to add to wishlist',
          'error'
        );
      }
    } catch (err) {
      console.error('❌ Network error adding to wishlist:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Fetch products for this category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(`${API_BASE_URL}/api/categories`);
        const categories = await catRes.json();

        const matchedCategory = categories.find(
          (cat) =>
            cat.category_name.toLowerCase().replace(/\s+/g, '-') ===
            selectedCategory.toLowerCase()
        );

        if (matchedCategory) {
          setCategoryName(matchedCategory.category_name);

          const prodRes = await fetch(`${API_BASE_URL}/api/products`);
          const allProducts = await prodRes.json();

          const filteredProducts = allProducts.filter(
            (p) => p.category_id === matchedCategory.category_id
          );
          setProducts(filteredProducts);
          setFilteredProducts(filteredProducts);
        } else {
          setCategoryName(selectedCategory);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock_quantity > 0);
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((p) => {
        const productRating = p.rating || 0;
        return selectedRatings.some((rating) => productRating >= rating);
      });
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedColors, selectedRatings, inStockOnly, sortBy]);

  const handleProductClick = (productId) => {
    router.push(`/productdetail/${productId}`);
  };

  const handleColorToggle = (colorValue) => {
    setSelectedColors((prev) =>
      prev.includes(colorValue)
        ? prev.filter((c) => c !== colorValue)
        : [...prev, colorValue]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedRatings([]);
    setInStockOnly(false);
  };

  const activeFilterCount =
    selectedColors.length + selectedRatings.length + (inStockOnly ? 1 : 0);

  // Filter Panel Component
  const FilterPanel = ({ isMobile = false }) => (
    <div
      className={
        isMobile ? '' : 'bg-white rounded-xl p-4 lg:p-6 sticky top-24 shadow-md'
      }
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-slate-800">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            className="text-xs lg:text-sm text-orange-700 hover:text-orange-800 font-medium"
            onClick={clearAllFilters}
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 border-b">
        <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-3 lg:mb-4">
          Color
        </h4>
        <div className="flex gap-2 flex-wrap">
          {colorOptions.map((color, idx) => (
            <button
              key={idx}
              className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 transition ${
                selectedColors.includes(color.value)
                  ? 'border-orange-600 ring-2 ring-orange-200 scale-110'
                  : 'border-slate-200 hover:border-orange-600'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              onClick={() => handleColorToggle(color.value)}
            />
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 border-b">
        <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-3 lg:mb-4">
          Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-300"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingToggle(rating)}
              />
              <div className="flex items-center gap-1 group-hover:scale-105 transition-transform">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs lg:text-sm text-slate-700 ml-1">
                  & Up
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-3 lg:mb-4">
          Availability
        </h4>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-300"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span className="text-xs lg:text-sm text-slate-700 group-hover:text-slate-900">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-base lg:text-lg text-gray-600">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-30 lg:static">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 lg:py-4">
          <div className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <a href="/" className="hover:text-orange-600 transition">
              Home
            </a>
            <span className="text-slate-400">/</span>
            <a href="/collections" className="hover:text-orange-600 transition">
              Collections
            </a>
            <span className="text-slate-400">/</span>
            <span className="text-orange-700 font-medium truncate max-w-[150px] lg:max-w-none">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 lg:gap-2 bg-amber-100 border border-amber-200 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-amber-800 text-xs lg:text-sm font-medium mb-3 lg:mb-6">
              <Leaf className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Premium Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-serif text-slate-900 mb-2 lg:mb-6 px-4 leading-tight">
              {categoryName} Collection
            </h1>
            <p className="text-sm lg:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
              Explore our beautiful collection of {categoryName.toLowerCase()}{' '}
              sarees, handpicked for quality and elegance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-12">
        {/* Mobile Filter & Sort Bar */}
        <div className="flex items-center gap-2 mb-4 lg:hidden sticky top-[52px] bg-gray-50 py-2 z-20">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-orange-300 transition relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-300"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>
        </div>

        <div className="flex gap-4 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <FilterPanel />
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden animate-fade-in">
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto animate-slide-in-right">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10 shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activeFilterCount} active
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel isMobile />
                </div>
                <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition active:scale-95"
                  >
                    Show {filteredProducts.length} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Desktop Header with Sort */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-slate-600">
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {filteredProducts.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold">{products.length}</span>{' '}
                products
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600 font-medium">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-600">
                  Active filters:
                </span>
                {selectedRatings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingToggle(rating)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition"
                  >
                    {rating}+ Stars
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {inStockOnly && (
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition"
                  >
                    In Stock
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 lg:py-20 bg-white rounded-xl shadow-sm">
                <div className="mb-4">
                  <ShoppingBag className="w-16 h-16 lg:w-20 lg:h-20 mx-auto text-slate-300" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">
                  No products found
                </h3>
                <p className="text-sm lg:text-base text-gray-600 px-4 mb-4">
                  {products.length === 0
                    ? 'No products available for this category.'
                    : 'Try adjusting your filters to see more results.'}
                </p>
                {products.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm lg:text-base underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 xl:gap-6">
                {filteredProducts.map((p) => {
                  const inStock = p.stock_quantity > 0;
                  const mainImage =
                    p.images && p.images.length > 0
                      ? p.images[0]
                      : '/images/placeholder.jpg';

                  const isWishlisted = wishlist.includes(p.product_id);

                  return (
                    <div
                      key={p.product_id}
                      className="group bg-white rounded-lg lg:rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
                      onClick={() => handleProductClick(p.product_id)}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                        <img
                          src={mainImage}
                          alt={p.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                            !inStock ? 'opacity-50' : ''
                          }`}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />

                        {/* Out of Stock Overlay */}
                        {!inStock && (
                          <div className="absolute inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center">
                            <span className="bg-slate-800 text-white text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="w-8 h-8 lg:w-9 lg:h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-50 transition active:scale-90"
                            onClick={(e) => handleAddToWishlist(e, p)}
                          >
                            <Heart
                              className={`w-4 h-4 lg:w-5 lg:h-5 ${
                                isWishlisted
                                  ? 'fill-orange-500 text-orange-500'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-2.5 lg:p-4">
                        <h3 className="font-medium text-slate-800 text-xs lg:text-base mb-1 lg:mb-2 line-clamp-2 min-h-[2.5rem] lg:min-h-[3rem] group-hover:text-orange-600 transition">
                          {p.name}
                        </h3>

                        {/* Description - Hidden on mobile */}
                        {p.description && (
                          <p className="hidden lg:block text-sm text-slate-500 mb-2 line-clamp-2">
                            {p.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 lg:gap-2 mb-2 lg:mb-4">
                          <span className="text-base lg:text-xl xl:text-2xl font-bold text-orange-600">
                            ₹{parseFloat(p.price).toLocaleString()}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        {p.stock_quantity > 0 ? (
                          <button
                            onClick={(e) => handleAddToCart(e, p)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-full transition hover:bg-amber-700"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-300 text-gray-600 text-xs sm:text-sm font-semibold rounded-full cursor-not-allowed"
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
                <ShoppingBag className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please login or register to add items to your cart and wishlist
              </p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="block w-full bg-white text-amber-600 border-2 border-amber-600 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
