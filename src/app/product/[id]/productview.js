'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Share2, Ruler, Package } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

export default function ProductViewPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const { id } = useParams();
   const router = useRouter();
   

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching product with ID:', id);

        // Fetch single product
        const response = await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/sarees/${id}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Product not found (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('Fetched product data:', data);

        // Check if data is valid
        if (!data || !data.id) {
          throw new Error('Invalid product data received');
        }

        // Transform the data
        const transformedProduct = {
          id: data.id,
          name: data.saree_name || 'Unnamed Product',
          price: parseFloat(data.discounted_price) || 0,
          originalPrice: parseFloat(data.original_price) || 0,
          rating: 4.8, // You can add this to database later
          reviews: 127, // You can add this to database later
          inStock: true, // You can add this to database later
          category: data.category || 'Silk Saree',
          color: 'Traditional', // You can extract from description or add field
          fabric: data.fabric || 'Silk',
          length: data.length || '6.3 meters',
          blouse: '0.8 meters', // You can add this field to database
          description: data.description || 'No description available',
          features: data.key_features 
            ? (typeof data.key_features === 'string' 
                ? data.key_features.split('\n').filter(f => f.trim()) 
                : []) 
            : [],
          care: [
            "Dry clean only - Do not wash",
            "Store in a cool, dry place away from direct sunlight",
            "Avoid contact with perfumes and deodorants",
            "Iron on low heat with a cloth barrier",
            "Keep in a muslin cloth bag for better preservation"
          ],
          // specifications: {
          //   "Brand": "Silken Heritage",
          //   "Fabric": data.fabric || 'N/A',
          //   "Category": data.category || 'N/A',
          //   "Pattern": "Traditional Design",
          //   "Occasion": "Wedding, Festival",
          //   "Saree Length": data.length || 'N/A',
          //   "Care": "Dry Clean Only",
          // },
          images: data.images && Array.isArray(data.images) && data.images.length > 0
            ? data.images.map(img => `https://api-xmg2fjjbya-uc.a.run.app${img}`)
            : ['/images/placeholder.jpg']
        };

        console.log('Transformed product:', transformedProduct);
        setProduct(transformedProduct);

        // Fetch related products from same category
        if (data.category) {
          try {
            const relatedResponse = await fetch(
              `https://api-xmg2fjjbya-uc.a.run.app/api/sarees?category=${encodeURIComponent(data.category)}&limit=5`
            );
            
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              console.log('Related products:', relatedData);
              
              // Filter out current product and transform
              const transformedRelated = relatedData
                .filter(item => item.id !== data.id)
                .slice(0, 4)
                .map(item => ({
                  id: item.id,
                  name: item.saree_name || 'Unnamed Product',
                  price: parseFloat(item.discounted_price) || 0,
                  rating: 4.8,
                  img: item.images && item.images.length > 0 
                    ? `https://api-xmg2fjjbya-uc.a.run.app${item.images[0]}`
                    : '/images/placeholder.jpg'
                }));

              setRelatedProducts(transformedRelated);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            // Don't fail the whole page if related products fail
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.name} to cart!`);
  };

  const handleBuyNow = () => {
    const checkoutData = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    img: product.images[selectedImage] // correct: saves the selected image
    };
  sessionStorage.setItem('checkoutProduct', JSON.stringify(checkoutData));
  router.push('/checkout');
  };



  const handleAddToWishlist = () => {
    alert(`${product?.name} added to wishlist!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out this ${product?.name}`,
        url: window.location.href,
      });
    } else {
      alert('Share link copied!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-stone-400" />
          <h2 className="text-2xl font-light mb-2">Product Not Found</h2>
          <p className="text-stone-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/collections">
            <button className="bg-amber-700 text-white px-6 py-3 rounded hover:bg-amber-800 transition">
              Browse Collections
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-stone-600">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-amber-700">Collections</Link>
          <span>/</span>
          <Link href={`/collections/${product.category.toLowerCase()}`} className="hover:text-amber-700">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-900">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
             <Image
  src={
    product?.images?.[0]
      ? product.images[0].startsWith('http')
        ? product.images[0]
        : `https://api-xmg2fjjbya-uc.a.run.app${product.images[0]}`
      : '/default-image.jpg'
  }
  alt={product?.name || 'Product image'}
  width={500}
  height={500}
  className="w-full h-full object-cover"
/>

              
              {/* Stock Badge */}
              {product.inStock ? (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  In Stock
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              )}

              {/* Discount Badge */}
              {product.originalPrice > product.price && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-stone-100 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-stone-100 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-amber-700' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-stone-600">{product.category}</span>
              <span className="text-stone-400">•</span>
              <span className="text-sm text-stone-600">SKU: SLK-{product.id}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-light mb-4">{product.saree_name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} 
                  />
                ))}
                <span className="ml-2 text-lg font-medium">{product.rating}</span>
              </div>
              <span className="text-stone-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b">
              <span className="text-4xl font-light">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Fabric: {product.fabric}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Ruler className="w-5 h-5 text-amber-600" />
                <span>Length: {product.length}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm uppercase tracking-wide mb-3 text-stone-600 font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-stone-300 rounded flex items-center justify-center hover:border-amber-700 hover:text-amber-700 transition font-medium text-lg"
                >
                  -
                </button>
                <span className="text-xl w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-stone-300 rounded flex items-center justify-center hover:border-amber-700 hover:text-amber-700 transition font-medium text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              {/* <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 px-8 rounded transition flex items-center justify-center gap-2 font-medium ${
                  product.inStock 
                    ? 'bg-stone-900 text-white hover:bg-stone-800' 
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button> */}
              
              <button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={`bg-amber-700 text-white py-4 px-64 rounded transition font-medium ${
                  product.inStock ? 'hover:bg-amber-800' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3 mb-8">
              {/* <button 
                onClick={handleAddToWishlist}
                className="flex-1 border-2 border-stone-300 py-3 rounded hover:border-amber-700 hover:text-amber-700 transition flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button> */}
              <button 
                onClick={handleShare}
                className="flex-1 border-2 border-stone-300 py-3 rounded hover:border-amber-700 hover:text-amber-700 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-amber-50 rounded-lg">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-amber-700" />
                <p className="text-xs font-medium">Free Shipping</p>
                <p className="text-xs text-stone-600">On orders above ₹50k</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-amber-700" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-stone-600">7-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-amber-700" />
                <p className="text-xs font-medium">100% Authentic</p>
                <p className="text-xs text-stone-600">Certified genuine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b mb-8">
            <div className="flex gap-8">
              <button 
                onClick={() => setSelectedTab('description')}
                className={`pb-4 px-2 border-b-2 transition ${
                  selectedTab === 'description' 
                    ? 'border-amber-700 text-amber-700 font-medium' 
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Description
              </button>
              {/* <button 
                onClick={() => setSelectedTab('specifications')}
                className={`pb-4 px-2 border-b-2 transition ${
                  selectedTab === 'specifications' 
                    ? 'border-amber-700 text-amber-700 font-medium' 
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Specifications
              </button> */}
              <button 
                onClick={() => setSelectedTab('care')}
                className={`pb-4 px-2 border-b-2 transition ${
                  selectedTab === 'care' 
                    ? 'border-amber-700 text-amber-700 font-medium' 
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Care Instructions
              </button>
              {/* <button 
                onClick={() => setSelectedTab('reviews')}
                className={`pb-4 px-2 border-b-2 transition ${
                  selectedTab === 'reviews' 
                    ? 'border-amber-700 text-amber-700 font-medium' 
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Reviews ({product.reviews})
              </button> */}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            {selectedTab === 'description' && (
              <div>
                <h3 className="text-2xl font-light mb-4">Product Description</h3>
                <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>
                {product.features.length > 0 && (
                  <>
                    <h4 className="text-lg font-medium mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-amber-700 mr-3 mt-1">✓</span>
                          <span className="text-stone-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* {selectedTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-light mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-3">
                      <span className="font-medium text-stone-700 w-1/2">{key}:</span>
                      <span className="text-stone-600 w-1/2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {selectedTab === 'care' && (
              <div>
                <h3 className="text-2xl font-light mb-4">Care Instructions</h3>
                <ul className="space-y-3">
                  {product.care.map((instruction, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-amber-700 mr-3 mt-1">•</span>
                      <span className="text-stone-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* {selectedTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-light mb-4">Customer Reviews</h3>
                <div className="text-center py-12 text-stone-600">
                  <Star className="w-16 h-16 mx-auto mb-4 text-stone-300" />
                  <p>No reviews yet. Be the first to review this product!</p>
                  <button className="mt-4 bg-amber-700 text-white px-6 py-3 rounded hover:bg-amber-800 transition">
                    Write a Review
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-light mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(item => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                    <div className="relative aspect-[3/4] bg-stone-100">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                                   
                    {/* Desktop Hover Card - Only shows on hover */}
                    <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3">
                        {/* Buy Button */}
                        <button onClick={() => handleBuyNow(product)}>
                        Buy Now
                          </button>
                        
                        {/* Divider */}
                        <div className="h-6 w-px bg-stone-200"></div>
                        
                        {/* Quick View Icon */}
                        <div 
  onClick={() => router.push(`/product/${product.id}`)} 
  className="bg-white rounded-lg shadow cursor-pointer"
>
                          <button 
                           
                            className="p-2 hover:bg-stone-100 rounded transition"
                            title="Quick View"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Divider */}
                        <div className="h-6 w-px bg-stone-200"></div>
                        
                        {/* Wishlist Heart Icon */}
                        {/* <button 
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`${product.name} added to wishlist!`);
                          }}
                          className="p-2 hover:bg-stone-100 rounded transition"
                          title="Add to Wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>

                     {/* Mobile Action Buttons - Always visible */}
                                        <div className="md:hidden absolute top-2 right-2 flex flex-col gap-2">
                                          <button 
                                            onClick={(e) => {
                                              e.preventDefault();
                                              alert(`${product.name} added to wishlist!`);
                                            }}
                                            className="bg-white p-2 rounded-full shadow-md hover:bg-stone-100 transition"
                                            title="Add to Wishlist"
                                          >
                                            <Heart className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              alert('Quick view coming soon!');
                                            }}
                                            className="bg-white p-2 rounded-full shadow-md hover:bg-stone-100 transition"
                                            title="Quick View"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                          </button>
                                        </div>
                                     
                    </div>
                    
                    
                    <div className="p-4">
                      <h3 className="font-light text-lg mb-2 group-hover:text-amber-700 transition truncate">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-light">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-amber-600">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {item.rating}
                        </div>
                      </div>
                       {/* Mobile Buy Button */}
                                          <button onClick={() => handleBuyNow(product)}>
                        Buy Now
                          </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}