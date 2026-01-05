// import ProductViewPage from "@/app/product/[id]/productview";

// export async function generateMetadata({ params }) {
//   // In production, fetch product data here
//   return {
//     title: `Product ${params.id} - Silken`,
//     description: 'Premium silk saree details',
//   };
// }

// export default function ProductPage({ params }) {
//   return <ProductViewPage params={params} />;
// }








'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Star, ShoppingCart, Truck, Shield, ArrowLeft, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/sarees/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        
        // Transform data
        const transformedProduct = {
          id: data.id,
          name: data.saree_name,
          category: data.category,
          price: parseFloat(data.discounted_price),
          originalPrice: parseFloat(data.original_price),
          images: data.images.map(img => `https://api-xmg2fjjbya-uc.a.run.app${img}`),
          fabric: data.fabric,
          length: data.length,
          description: data.description,
          keyFeatures: data.key_features ? data.key_features.split(',') : [],
          rating: 4.8,
          reviews: 124,
          inStock: true
        };

        setProduct(transformedProduct);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${product.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Product Not Found</h2>
            <p className="text-red-700 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  {discount}% OFF
                </div>
              )}
              
              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-800" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === idx 
                        ? 'border-slate-700 shadow-md' 
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-slate-700 font-semibold">{product.rating}</span>
                </div>
                <span className="text-slate-600">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-slate-100 rounded-xl p-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-slate-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-green-600 font-semibold text-lg">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="font-semibold">Fabric:</span>
                <span>{product.fabric}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="font-semibold">Length:</span>
                <span>{product.length}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="font-semibold">Availability:</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <Check className="w-5 h-5" />
                  In Stock
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-slate-200 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-slate-200 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-slate-800 text-white py-4 rounded-xl hover:bg-slate-700 transition font-semibold text-lg shadow-lg"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className={`w-full border-2 border-slate-800 py-4 rounded-xl transition font-semibold text-lg flex items-center justify-center gap-2 ${
                  addedToCart 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <div className="flex gap-3">
                <button className="flex-1 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="flex-1 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Free Delivery</p>
                  <p className="text-sm text-slate-600">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Secure Payment</p>
                  <p className="text-sm text-slate-600">100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Description</h2>
            <p className="text-slate-700 leading-relaxed">
              {product.description || 'This beautiful saree combines traditional craftsmanship with modern elegance. Perfect for any occasion, it features premium quality fabric and intricate detailing that makes it stand out.'}
            </p>
          </div>

          {/* Key Features */}
          {product.keyFeatures.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                {product.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}