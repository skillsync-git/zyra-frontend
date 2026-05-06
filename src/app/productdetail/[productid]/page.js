'use client'
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, ChevronRight, Package, CreditCard, RotateCcw, Loader2, CheckCircle, X, User } from 'lucide-react';

const API_BASE_URL = 'https://zyra-website.onrender.com';

export default function SareeProductPage() {
  // Get product ID from URL - you'll need to pass this as a prop or use your router
  const [productId, setProductId] = useState(null);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [pincode, setPincode] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [mainImage, setMainImage] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

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

    // Extract product ID from URL
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    setProductId(id);
  }, []);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Fetched product:', data);
        
        setProduct(data);
        
        // Set main image
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        } else {
          setMainImage('/images/placeholder-saree.jpg');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Check if product is in wishlist
  useEffect(() => {
    if (!user || !productId) return;

    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const wishlistItems = await response.json();
          const isInList = wishlistItems.some(item => 
            item.product_id === parseInt(productId)
          );
          setIsInWishlist(isInList);
        }
      } catch (err) {
        console.log('Could not check wishlist status:', err);
      }
    };

    checkWishlist();
  }, [user, productId]);

  // Fetch real reviews from backend
  useEffect(() => {
    if (!productId) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setAvgRating(data.average_rating || 0);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [productId]);

  // Submit a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!user) { setShowAuthModal(true); return; }
    if (reviewForm.comment.trim().length < 5) {
      setReviewError('Comment must be at least 5 characters');
      return;
    }
    setReviewSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewForm.rating, comment: reviewForm.comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      // Refresh reviews
      const refreshRes = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
      const refreshData = await refreshRes.json();
      setReviews(refreshData.reviews || []);
      setAvgRating(refreshData.average_rating || 0);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      showNotification('Review submitted successfully!', 'success');
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const sizes = ['Free Size'];


  // Add to cart function
  const handleAddToCart = async () => {
    if (!user) {
      console.log('❌ User not logged in');
      setShowAuthModal(true);
      return;
    }

    if (!selectedSize) {
      showNotification('Please select a size', 'error');
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

      const productIdNum = parseInt(product.product_id);
      
      if (isNaN(productIdNum)) {
        console.error('❌ Invalid product ID:', product.product_id);
        showNotification('Invalid product ID', 'error');
        return;
      }

      const payload = {
        product_id: productIdNum,
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

      console.log('📥 Cart response status:', response.status);

      const responseText = await response.text();
      console.log('📥 Cart response text:', responseText);

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

  // Add to wishlist function
  const handleAddToWishlist = async () => {
    if (!user) {
      console.log('❌ User not logged in');
      setShowAuthModal(true);
      return;
    }

    // If already in wishlist, show friendly message
    if (isInWishlist) {
      showNotification('This item is already in your wishlist!', 'error');
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
        setIsInWishlist(true);
        showNotification(`${product.name} added to wishlist!`, 'success');
      } else {
        console.error('❌ Wishlist API error:', data);
        
        // Handle duplicate item gracefully
        const errorMessage = data.message || data.error || '';
        if (errorMessage.toLowerCase().includes('already') || 
            errorMessage.toLowerCase().includes('exists') ||
            errorMessage.toLowerCase().includes('duplicate')) {
          setIsInWishlist(true);
          showNotification('This item is already in your wishlist!', 'error');
        } else {
          showNotification(errorMessage || 'Failed to add to wishlist', 'error');
        }
      }
    } catch (err) {
      console.error('❌ Network error adding to wishlist:', err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This product does not exist'}</p>
          <a href="/">
            <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
              Back to Home
            </button>
          </a>
        </div>
      </div>
    );
  }

  // Calculate discount if offer exists
  const originalPrice = product.offer_id ? (product.price * 1.5).toFixed(2) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Package className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-amber-600 cursor-pointer">Home</a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="hover:text-amber-600 cursor-pointer">Sarees</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img 
                src={mainImage} 
                alt={product.name}
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder-saree.jpg';
                }}
              />
            </div>
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`bg-white rounded-lg overflow-hidden cursor-pointer border-2 ${
                      mainImage === `${API_BASE_URL}${img}` ? 'border-amber-600' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-32 object-cover hover:opacity-75 transition"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-saree.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description || 'Premium quality saree'}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded">
                <span className="font-semibold">4.6</span>
                <Star className="w-4 h-4 ml-1 fill-current" />
              </div>
              <span className="text-gray-600">13 Ratings</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{parseFloat(product.price).toFixed(2)}</span>
              {originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{originalPrice}</span>
                  <span className="text-lg text-green-600 font-semibold">({discountPercent}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-sm text-green-600">Inclusive of all taxes</p>

            {/* Stock Status */}
            {product.stock_quantity > 0 ? (
              <p className="text-sm text-green-600 font-semibold">
                In Stock ({product.stock_quantity} available)
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">SELECT SIZE</span>
                <button className="text-amber-600 text-sm font-medium hover:underline">
                  SIZE CHART →
                </button>
              </div>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-full font-medium transition ${
                      selectedSize === size
                        ? 'border-amber-600 text-amber-600 bg-amber-50'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`flex-1 font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition ${
                  product.stock_quantity > 0
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock_quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
              <button 
                onClick={handleAddToWishlist}
                className={`px-6 py-4 border-2 rounded-lg transition ${
                  isInWishlist
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-amber-600 text-amber-600' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-lg p-6 border">
              {/* <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                DELIVERY OPTIONS
              </h3> */}
              {/* <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter a PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
                <button className="px-6 py-2 text-amber-600 font-semibold border border-amber-600 rounded-lg hover:bg-amber-50 transition">
                  CHECK
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Please enter PIN code to check delivery time & Pay on Delivery Availability
              </p> */}
              <div className="mt-4 space-y-2 text-sm text-black">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  100% Original Products
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Pay on order is available
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Trusted Partners
                </p>
              </div>
            </div>

            {/* Best Offers */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-4">BEST OFFERS</h3>
              <div className="space-y-3 text-sm">
                {/* <div>
                  <p className="font-semibold">Best Price: ₹{(product.price * 0.85).toFixed(2)}</p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Coupon Discount: 15% off (Your total saving: ₹{(product.price * 0.15).toFixed(2)})</li>
                    <li>• Applicable on orders above Rs. 999 (only on first purchase)</li>
                    <li>• Coupon code: <span className="font-semibold">FIRSTBUY15</span></li>
                  </ul>
                  <button className="text-amber-600 font-semibold mt-2 hover:underline">
                    View Eligible Products
                  </button>
                </div> */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2 text-black">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">10% Instant Discount on Cards</span>
                  </div>
                  <p className="text-gray-600">Min Spend ₹3,000, Max Discount ₹1,000</p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2 text-black">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">7.5% Cashback on Card</span>
                  </div>
                  <p className="text-gray-600">Maximum cashback: INR 4,000 per quarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <div className="border-b mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 font-semibold transition ${
                  activeTab === 'details'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                PRODUCT DETAILS
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`pb-4 font-semibold transition ${
                  activeTab === 'ratings'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                RATINGS & REVIEWS
              </button>
            </div>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              <p className="text-gray-700">
                {product.description || 'Pure cotton traditional saree with beautiful woven border and pallu. Perfect for everyday wear and special occasions.'}
              </p>
              
              {product.key_features && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                  <p className="text-gray-700">{product.key_features}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Size & Fit</h4>
                <p className="text-gray-700">Saree Length: 5.5 meters, Blouse Length: 0.8 meters</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Material & Care</h4>
                <p className="text-gray-700 mb-2">100% Pure Cotton</p>
                <p className="text-gray-700">
                  Machine wash with similar colors using mild detergent; do not bleach or tumble dry.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="ml-2 text-gray-900">{product.product_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category ID:</span>
                    <span className="ml-2 text-gray-900">{product.category_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fabric:</span>
                    <span className="ml-2 text-gray-900">Cotton</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Occasion:</span>
                    <span className="ml-2 text-gray-900">Casual & Festive</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-8">
              {/* Rating Summary */}
              <div className="flex items-start gap-8 pb-6 border-b">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">4.6</div>
                  <div className="flex items-center justify-center mb-2">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600">13 Verified Buyers</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: rating === 5 ? '77%' : rating === 4 ? '15%' : '8%' }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {rating === 5 ? '10' : rating === 4 ? '2' : '1'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Customer Reviews ({reviews.length})
                    {avgRating > 0 && (
                      <span className="ml-2 text-amber-600 text-base">★ {avgRating}/5</span>
                    )}
                  </h3>
                  <button
                    onClick={() => { if (!user) { setShowAuthModal(true); return; } setShowReviewForm(!showReviewForm); }}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-amber-50 rounded-xl p-5 space-y-4 border border-amber-100">
                    <h4 className="font-semibold text-gray-800">Your Review</h4>
                    {reviewError && (
                      <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{reviewError}</p>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                            className="focus:outline-none"
                          >
                            <Star className={`w-7 h-7 transition ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600 self-center">{reviewForm.rating}/5</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                        rows={4}
                        placeholder="Share your experience with this product..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Star className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.review_id} className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-600 font-semibold text-lg">
                            {review.author_name ? review.author_name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-green-500 text-green-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.rating}/5</span>
                            {review.verified_purchase === 1 && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Verified Purchase</span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium">{review.author_name}</span>
                            <span>|</span>
                            <span>{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Product Code */}
          <div className="mt-8 pt-6 border-t text-sm text-gray-600 space-y-2">
            <p>Product Code: <span className="font-semibold">SAR{product.product_id}</span></p>
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