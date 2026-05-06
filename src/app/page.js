'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, ArrowRight, Star, Heart, Leaf, TrendingUp, Package, Truck, Shield, Award, Search, ShoppingCart, User, Menu, X, CheckCircle, Gift, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import '../firebase'

const API_BASE_URL = 'https://zyra-website.onrender.com';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const heroSlides = [
    {
      title: 'Festive Mist Tant',
      subtitle: 'Pure Cotton Elegance',
      desc: 'Cool comfort. Timeless fashion.',
      img: '/images/b2.png',
      cta: 'Shop Now'
    },
    {
      title: 'Devine Block Prints',
      subtitle: 'Handcrafted Heritage',
      desc: 'Culture and craft, woven together.',
      img: '/images/b1.png',
      cta: 'Explore'
    },
    {
      title: 'Royal Heritage Weaves',
      subtitle: 'Timeless Kanjeevaram Splendor',
      desc: 'Sarees and gifts, ready to gift.',
      img: '/images/b3.png',
      cta: 'Explore'
    }
  ];

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

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Fetched products:', data);
        
        // Take only first 8 products for homepage display
        setProducts(data.slice(0, 8));
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch offers from database
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/offers`)
      .then(res => res.json())
      .then(data => {
        console.log('🎁 Fetched offers:', data);
        setOffers(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("❌ Error fetching offers:", err));
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

//Helper function to get first image or placeholder
const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return '/images/placeholder-saree.jpg';
};

  // Helper function to calculate discount percentage
  const getDiscountPercent = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Helper function to determine badge based on product properties
  const getProductBadge = (product) => {
    if (product.is_new) return 'New';
    if (product.is_trending) return 'Trending';
    if (product.is_exclusive) return 'Exclusive';
    const discountPercent = getDiscountPercent(product.price, product.price * 1.5);
    if (discountPercent > 30) return 'Sale';
    return 'Featured';
  };

  // Add to cart function with authentication check
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        
        // Optionally refresh cart count if you have a cart context
        // refreshCartCount();
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

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
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

      {/* Announcement Banner */}
      <div className="bg-amber-50 text-center py-2 sm:py-2.5 text-xs sm:text-sm border-b px-2">
        <span className="font-medium text-amber-900">Free Shipping on all orders | 15% Off: WELCOME15</span>
      </div>

      {/* Hero Carousel */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[520px] w-full mb-8 sm:mb-10 md:mb-14">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/20 to-amber-100/40" />
            <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 top-1/4 sm:top-1/3 max-w-[90%] sm:max-w-md md:max-w-xl px-2 sm:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-amber-900 mb-2 sm:mb-3 md:mb-4 leading-tight">{slide.title}</h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-4 sm:mb-5 md:mb-7">{slide.desc}</p>
              <a href='/collections/newarrivals'>
                <button className="bg-amber-600 text-white px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base font-semibold rounded-full hover:bg-amber-700 transition flex items-center gap-2">
                  {slide.cta} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </a>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-amber-600 w-6 sm:w-8' : 'bg-amber-300 w-1.5 sm:w-2'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-14 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-amber-900 font-bold">Trending Now</h2>
          <a href="/collections/newarrivals" className="text-sm sm:text-base text-amber-700 font-semibold hover:underline whitespace-nowrap">View All</a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 sm:py-16 md:py-20 text-center">
            <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-b-4 border-amber-600 rounded-full mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 sm:py-16 md:py-20 text-center">
            <div className="text-red-600 mb-4">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-base sm:text-lg font-semibold">Error loading products</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-amber-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-amber-700 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => (
              <div key={product.product_id} className="border rounded-lg sm:rounded-xl group hover:shadow-lg transition bg-white relative p-2 sm:p-3 md:p-4">
                <a href={`/productdetail/${product.product_id}`} className="block">
                  <div className="relative">
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className="w-full aspect-square object-cover mb-2 sm:mb-3 rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-saree.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-amber-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                      {getProductBadge(product)}
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className="p-1.5 sm:p-2 rounded-full bg-white shadow hover:bg-amber-50 transition"
                      >
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                      </button>
                    </div>
                  </div>
                </a>

                <h3 className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">{product.name}</h3>
                
                <div className="flex items-end gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-amber-700">₹{parseFloat(product.price).toFixed(2)}</span>
                  {product.offer_id && (
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                      ₹{(parseFloat(product.price) * 1.3).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                    }`} />
                  ))}
                  <span className="text-[10px] sm:text-xs text-slate-600 ml-0.5">(4.5)</span>
                </div>

                {product.stock_quantity > 0 ? (
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
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
            ))}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="py-12 sm:py-16 md:py-20 text-center">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-sm sm:text-base text-slate-600">No products available at the moment.</p>
          </div>
        )}
      </section>

      {/* Wide Offer Banner Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-14 w-full">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          {offers.slice(0, 2).map((offer, idx) => {
            const backgroundImage = offer.offer_image 
  ? offer.offer_image 
  : (idx === 0 ? "/images/ba1.jpeg" : "/images/banner1.jpg");
            
            return (
              <div 
                key={offer.offer_id} 
                className="relative flex-1 h-[160px] sm:min-h-[220px] md:min-h-[260px] rounded-xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src={backgroundImage} 
                  alt={offer.offer_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = idx === 0 ? "/images/ba1.jpeg" : "/images/banner1.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10 text-white">
                  <div
                    className={`inline-flex items-center gap-1.5 sm:gap-2 ${
                      offer.is_flash_sale ? "bg-red-600" : "bg-amber-600"
                    } px-2.5 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm md:text-base font-semibold w-fit mb-2 sm:mb-3`}
                  >
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    {offer.is_flash_sale ? "Flash Sale" : "Special Offer"}
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1">
                    {offer.discount_percent > 0
                      ? `Flat ${offer.discount_percent}% Off`
                      : offer.flat_discount > 0
                        ? `₹${offer.flat_discount} Off`
                        : "Special Offer"}
                  </h3>

                  <p className="text-base sm:text-lg md:text-xl font-bold mb-1">{offer.offer_name}</p>

                  <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 line-clamp-2">
                    {offer.promotional_text || offer.offer_name}
                  </p>
                  <a href='collections/sale'>
                    <button className="bg-white text-amber-900 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold w-fit hover:bg-slate-100 transition flex items-center gap-2 text-xs sm:text-sm md:text-base">
                      Shop Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SareeHaven Difference Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-14 w-full">
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 bg-amber-50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 lg:p-10">
          <img src="/images/baner0.jpg" alt="Cotton Artisans" className="rounded-lg sm:rounded-xl w-full md:w-1/3 object-cover h-[180px] sm:h-[220px] md:h-auto" />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-900 mb-2 sm:mb-3">SareeHaven Difference</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-700 mb-3 sm:mb-4">
              Celebrating India's artisan heritage, SareeHaven connects you directly with master weavers. 
              Every saree carries a story, woven with tradition and passion.
            </p>
            <ul className="list-disc text-amber-800 ml-4 sm:ml-5 text-xs sm:text-sm md:text-base space-y-1">
              <li>100% handloom guaranteed</li>
              <li>Direct proceeds to artisans</li>
              <li>Eco-friendly packaging</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-14 w-full">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-amber-900 font-bold mb-2">What Our Customers Say</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600">Hear from real saree lovers across India</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <img src="/images/ab1.jpg" alt="Priya Sharma" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-600"/>
              <div>
                <p className="font-semibold text-sm sm:text-base text-amber-900">Priya Sharma</p>
                <span className="text-xs sm:text-sm text-slate-500">Mumbai</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 italic">"The quality of cotton sarees is exceptional! I have ordered 5 times and each piece is crafted with care."</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <img src="/images/ab3.jpeg" alt="Lakshmi Iyer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-600"/>
              <div>
                <p className="font-semibold text-sm sm:text-base text-amber-900">Lakshmi Iyer</p>
                <span className="text-xs sm:text-sm text-slate-500">Chennai</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 italic">"Beautiful sarees at reasonable prices. The fabric is premium and the colors are vibrant."</p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-14 w-full">
        <div className="bg-white border-t border-slate-200 py-4 sm:py-5 md:py-6 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[
              { text: 'Secure Payments', icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { text: 'Authentic Products', icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { text: '7-Day Returns', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { text: 'Free Shipping', icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { text: 'Quality Assured', icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-center sm:text-left">
                <span className="bg-amber-100 text-amber-700 p-1.5 sm:p-2 rounded-full flex-shrink-0">{badge.icon}</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-amber-900 leading-tight">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
