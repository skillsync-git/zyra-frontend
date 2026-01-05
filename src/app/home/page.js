// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Search, Star, Tag, Clock, Zap, ArrowRight } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';


// export default function HomePage() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [offers, setOffers] = useState([]);
//   const [featured, setFeatured] = useState([]);
//   const [loading, setLoading]=useState(true);

//   const heroSlides = [
//     {
//       title: "Timeless Elegance",
//       subtitle: "Handwoven Silk Sarees",
//       desc: "Discover the finest collection of traditional silk sarees",
//       img: "/images/newban1.jpg"
//     },
//     {
//       title: "Heritage Weaves",
//       subtitle: "Banarasi Collection",
//       desc: "Luxurious silk drapes crafted by master artisans",
//       img: "/images/bannh2.jpeg"
//     },
//     {
//       title: "Modern Classics",
//       subtitle: "Contemporary Silk",
//       desc: "Where tradition meets contemporary design",
//       img: "/images/ban1.jpeg"
//     }
//   ];

//   const collections = [
//     { 
//       name: "Kanjivaram", 
//       path: '/kanjivaram',  // This MUST match the URL
//       items: "120+ Designs", 
//       img: "/images/bb5.jpeg" 
//     },
//     { 
//       name: "Banarasi", 
//       path: '/banarasi',   // This MUST match the URL
//       items: "95+ Designs", 
//       img: "/images/bb3.jpeg" 
//     },
//     { 
//       name: "Tussar Silk", 
//       path: '/tussar',       // This MUST match the URL
//       items: "80+ Designs", 
//       img: "/images/bb6.jpeg" 
//     },
//     { 
//       name: "Patola", 
//       path: '/patola',       // This MUST match the URL
//       items: "65+ Designs", 
//       img: "/images/bb4.jpeg" 
//     }
//   ];

//   // const offers = [
//   //   {
//   //     id: 1,
//   //     badge: "Limited Time",
//   //     title: "Festive Sale",
//   //     discount: "Up to 40% OFF",
//   //     description: "On select Kanjivaram & Banarasi sarees",
//   //     bgImage: "/images/baner-2.jpg",
//   //     icon: <Tag className="w-5 h-5" />,
//   //     cta: "Shop Now",
//   //     style: "elegant", // Elegant curved design
//   //     accentColor: "from-rose-400 to-pink-500",
//   //     colorOverlay: "from-rose-600/40 via-pink-600/30 to-purple-700/50" // Rose/Pink color overlay
//   //   },
//   //   {
//   //     id: 2,
//   //     badge: "Exclusive",
//   //     title: "First Order",
//   //     discount: "Extra 15% OFF",
//   //     description: "Use code: FIRST15 at checkout",
//   //     bgImage: "/images/bb.jpg",
//   //     icon: <Zap className="w-5 h-5" />,
//   //     cta: "Claim Offer",
//   //     style: "modern", // Bold modern design
//   //     accentColor: "from-amber-400 to-orange-500",
//   //     colorOverlay: "from-amber-600/40 via-orange-600/40 to-red-700/50" // Amber/Orange color overlay
//   //   },
//   //   {
//   //     id: 3,
//   //     badge: "Ending Soon",
//   //     title: "Flash Deal",
//   //     discount: "Flat ₹5000 OFF",
//   //     description: "On orders above ₹25,000",
//   //     bgImage: "/images/baner-3.jpg",
//   //     icon: <Clock className="w-5 h-5" />,
//   //     cta: "Grab Deal",
//   //     style: "premium", // Premium minimal design
//   //     accentColor: "from-purple-400 to-indigo-500",
//   //     colorOverlay: "from-purple-700/40 via-indigo-700/40 to-blue-800/50" // Purple/Indigo color overlay
//   //   }
//   // ];

//   // const featured = [
//   //   { id: 1, name: "Royal Maroon Kanjivaram", price: "₹18,999", rating: 4.8, img: "/images/fs1.jpeg" },
//   //   { id: 2, name: "Golden Zari Banarasi", price: "₹22,499", rating: 4.9, img: "/images/fs2.jpeg" },
//   //   { id: 3, name: "Emerald Tussar Silk", price: "₹15,999", rating: 4.7, img: "/images/fs4.jpeg" },
//   //   { id: 4, name: "Ruby Red Patola", price: "₹24,999", rating: 4.9, img: "/images/fs3.jpeg" }
//   // ];

// // Fetch latest 4 products for featured section
//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/sarees');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
        
//         // Handle different response formats
//         let dataArray;
//         if (Array.isArray(data)) {
//           dataArray = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           dataArray = data.data;
//         } else {
//           console.error('Unexpected data format:', data);
//           dataArray = [];
//         }

//         // Transform and sort by date (newest first)
//         const transformedData = dataArray.map(item => ({
//           id: item.id,
//           name: item.saree_name,
//           price: `₹${parseFloat(item.discounted_price || item.original_price).toLocaleString()}`,
//           rating: 4.8,
//           img: item.images && item.images.length > 0 
//             ? `https://api-xmg2fjjbya-uc.a.run.app${item.images[0]}` 
//             : '/images/placeholder.jpg',
//           addedDate: item.created_at || new Date().toISOString()
//         }));

//         // Sort by date and get latest 4
//         transformedData.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
//         const latest4 = transformedData.slice(0, 4);
        
//         setFeatured(latest4);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching featured products:', error);
//         setFeatured([]);
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   useEffect(() => {
//     fetch("https://api-xmg2fjjbya-uc.a.run.app/api/offers")
//       .then(res => res.json())
//       .then(data => setOffers(data));
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [heroSlides.length]);

//   const handleAddToCart = (productName) => {
//     alert(`${productName} added to cart!`);
//   };

//   const handleQuickView = (productId) => {
//     window.location.href = `/product/${productId}`;
//   };

//   const handleAddToWishlist = (productName) => {
//     alert(`${productName} added to wishlist!`);
//   };

//   return (
//     <div className="min-h-screen bg-stone-50 text-stone-900">
      
//       {/* Hero Slider - Responsive Heights */}
//       <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
//         {heroSlides.map((slide, idx) => (
//           <div
//             key={idx}
//             className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
//           >
//             <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 opacity-40 bg-black" />
//             <div className="absolute inset-0 flex items-center justify-center text-white">
//               <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8">
//                 <p className="text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-4 opacity-90">
//                   {slide.subtitle}
//                 </p>
//                 <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-6 tracking-tight leading-tight">
//                   {slide.title}
//                 </h1>
//                 <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
//                   {slide.desc}
//                 </p>
//                 <Link href="/collections">
//                   <button className="bg-white text-stone-900 px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider hover:bg-stone-100 transition rounded">
//                     Explore Collection
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}

//         <button 
//           onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)} 
//           className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2  bg-opacity-20 hover:bg-opacity-30 p-2 sm:p-3 rounded-full transition"
//           aria-label="Previous slide"
//         >
//           <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//         </button>
//         <button 
//           onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)} 
//           className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2  bg-opacity-20 hover:bg-opacity-30 p-2 sm:p-3 rounded-full transition"
//           aria-label="Next slide"
//         >
//           <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//         </button>

//         <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
//           {heroSlides.map((_, idx) => (
//             <button 
//               key={idx} 
//               onClick={() => setCurrentSlide(idx)} 
//               className={`h-1.5 sm:h-2 rounded-full transition-all ${
//                 idx === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white bg-opacity-50 w-1.5 sm:w-2'
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>

     

//     {/* Collections Grid - Responsive */}
//      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <div className="text-center mb-8 sm:mb-12 lg:mb-16">
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3 sm:mb-4">Signature Collections</h2>
//           <p className="text-sm sm:text-base text-stone-600">Curated elegance from India&apos;s finest weavers</p>
//         </div>
        
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//           {collections.map((collection) => (
//             <Link key={collection.name} href={collection.path} className="group">
//               <div className="group relative overflow-hidden cursor-pointer rounded-lg shadow-sm hover:shadow-lg transition-shadow">
//                 <img 
//                   src={collection.img} 
//                   alt={collection.name} 
//                   className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-500" 
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
//                 <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 text-white">
//                   <h3 className="text-base sm:text-xl lg:text-2xl font-light mb-1">{collection.name}</h3>
//                   <p className="text-xs sm:text-sm opacity-90">{collection.items}</p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>


//        {/* Offers Section - NEW */}
//        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-stone-100">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12 sm:mb-16">
//           <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 tracking-tight">
//             Special Offers
//           </h2>
//           <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
//             Dont miss out on these exclusive deals
//           </p>
//         </div>
        
//         {/* Offers Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {offers.map((offer, index) => (
//             <div
//               key={offer.id || index}
//               className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
//                 offer.style === 'elegant' 
//                   ? 'rounded-[2rem] shadow-xl hover:shadow-2xl' 
//                   : offer.style === 'modern'
//                   ? 'rounded-[2rem] shadow-xl hover:shadow-2xl'
//                   : 'rounded-[2rem] shadow-xl hover:shadow-3xl'
//               }`}
//               style={{ 
//                 animationDelay: `${index * 100}ms`,
//               }}
//             >
//               {/* Background Image with Parallax Effect */}
//               <div className="absolute inset-0 z-0 overflow-hidden">
//                 <div 
//                   className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                 > <img 
//                   src={`https://api-xmg2fjjbya-uc.a.run.app${offer.image_url}`} 
//                   alt="offer"
//                   className="absolute w-full h-full object-cover top-0 left-0"
//                   style={{ minHeight: "100%", minWidth: "100%" }}
//                 /></div>
//                 {/* Color Overlay */}
//                 <div className={`absolute inset-0 bg-gradient-to-br from-rose-600/40 via-pink-600/30 to-purple-700/50 mix-blend-multiply`} />
//                 {/* Dark Gradient Overlay - Different for each style */}
//                 <div className={`absolute inset-0 ${
//                   offer.style === 'elegant'
//                     ? 'bg-gradient-to-br from-black/50 via-black/30 to-transparent'
//                     : offer.style === 'modern'
//                     ? 'bg-gradient-to-tr from-black/60 via-black/30 to-black/50'
//                     : 'bg-gradient-to-b from-transparent via-black/20 to-black/60'
//                 }`} />
//               </div>

//               {/* Content Container */}
//               <div className={`relative z-10 ${
//                 offer.style === 'elegant' 
//                   ? 'p-8 sm:p-10 h-[480px] flex flex-col justify-between'
//                   : offer.style === 'modern'
//                   ? 'p-8 sm:p-10 h-[480px] flex flex-col'
//                   : 'p-8 sm:p-10 h-[480px] flex flex-col justify-end'
//               }`}>
                
//                 {/* Badge - Different positions for each style */}
//                 <div className={offer.style === 'premium' ? 'mb-auto' : ''}>
//                   <div className={`inline-flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-white mb-6 ${
//                     offer.style === 'elegant'
//                       ? 'bg-white/20 border border-white/30'
//                       : offer.style === 'modern'
//                       ? `bg-gradient-to-r from-rose-400 to-pink-500 shadow-lg`
//                       : 'bg-black/40 border border-white/20'
//                   }`}>
//                     <Tag className="w-5 h-5" />
//                     <span className="tracking-wide">{offer.tag}</span>
//                   </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className={offer.style === 'premium' ? 'mt-auto' : 'flex-1 flex flex-col justify-center'}>
//                   {/* Title */}
//                   <h3 className={`font-light mb-3 text-white ${
//                     offer.style === 'elegant'
//                       ? 'text-2xl sm:text-3xl italic'
//                       : offer.style === 'modern'
//                       ? 'text-xl sm:text-2xl uppercase tracking-wider font-semibold'
//                       : 'text-2xl sm:text-3xl'
//                   }`}>
//                     {offer.sub_title}
//                   </h3>

//                   {/* Discount - Different styling for each */}
//                   <div className={`mb-4 ${
//                     offer.style === 'elegant'
//                       ? 'text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white to-stone-200 bg-clip-text text-transparent'
//                       : offer.style === 'modern'
//                       ? `text-4xl sm:text-5xl font-black bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg`
//                       : 'text-4xl sm:text-5xl font-bold text-white'
//                   }`}>
//                     {offer.title}
//                   </div>

//                   {/* Description */}
//                   <p className={`mb-6 ${
//                     offer.style === 'elegant'
//                       ? 'text-base text-stone-200 max-w-xs'
//                       : offer.style === 'modern'
//                       ? 'text-sm text-white/90 font-medium uppercase tracking-wide'
//                       : 'text-base text-stone-100'
//                   }`}>
//                     {offer.description}
//                   </p>

//                   {/* CTA Button - Different styles */}
//                   <button className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-medium transition-all duration-300 group-hover:gap-4 ${
//                     offer.style === 'elegant'
//                       ? 'bg-white text-stone-900 hover:bg-stone-100 shadow-lg hover:shadow-xl'
//                       : offer.style === 'modern'
//                       ? `bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:shadow-2xl hover:shadow-amber-500/50 font-bold uppercase text-sm tracking-wider`
//                       : 'bg-white/90 backdrop-blur-sm text-stone-900 hover:bg-white border-2 border-white/50'
//                   }`}>
//                     <span>Shop Now</span>
//                     <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                   </button>
//                 </div>
//               </div>

//               {/* Decorative Elements - Different for each style */}
//               {offer.style === 'elegant' && (
//                 <>
//                   <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
//                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-500/20 to-transparent rounded-full blur-2xl" />
//                 </>
//               )}
              
//               {offer.style === 'modern' && (
//                 <>
//                   <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-lg rotate-45 blur-xl" />
//                   <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-2xl" />
//                 </>
//               )}
              
//               {offer.style === 'premium' && (
//                 <>
//                   <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
//                 </>
//               )}

//               {/* Hover shine effect */}
//               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bottom decorative text */}
//         <div className="text-center mt-12 sm:mt-16">
//           <p className="text-sm text-stone-500 italic">
//             Limited time offers • While stocks last • Terms & conditions apply
//           </p>
//         </div>
//       </div>
//     </section>
    
//       {/* Featured Products - Dynamic from Backend */}
//       <section className="py-12 sm:py-16 lg:py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 sm:mb-12 lg:mb-16">
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3 sm:mb-4">New Arrivals</h2>
//             <p className="text-sm sm:text-base text-stone-600">Handpicked exclusives for the season</p>
//           </div>
          
//           {loading ? (
//             <div className="text-center py-20">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone-900 mx-auto"></div>
//               <p className="mt-4 text-stone-600">Loading latest products...</p>
//             </div>
//           ) : featured.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-xl text-stone-600">No products available yet</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//               {featured.map((product, idx) => (
//                 <div key={idx} className="group cursor-pointer">
//                   <div className="relative overflow-hidden mb-3 sm:mb-4 bg-stone-100 rounded-lg shadow-sm">
//                     <img 
//                       src={product.img} 
//                       alt={product.name} 
//                       className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500" 
//                     />
                    
//                     <div className="absolute inset-x-0 bottom-3 sm:bottom-4 mx-3 sm:mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                       <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-3">
//                         <button 
//                           onClick={() => handleAddToCart(product.name)}
//                           className="flex items-center gap-1 sm:gap-2 text-stone-900 font-medium hover:text-amber-700 transition text-xs sm:text-sm"
//                         >
//                           <span className="hidden sm:inline text-xs">Add To Cart</span>
//                           <span className="sm:hidden">Add</span>
//                           <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-5 sm:h-6 w-px bg-stone-200"></div>
                        
//                         <button 
//                           onClick={() => handleQuickView(product.id)}
//                           className="p-1.5 sm:p-2 hover:bg-stone-100 rounded transition"
//                           title="Quick View"
//                         >
//                           <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-5 sm:h-6 w-px bg-stone-200"></div>
                        
//                         <button 
//                           onClick={() => handleAddToWishlist(product.name)}
//                           className="p-1.5 sm:p-2 hover:bg-stone-100 rounded transition"
//                           title="Add to Wishlist"
//                         >
//                           <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="md:hidden absolute top-2 right-2 flex flex-col gap-2">
//                       <button 
//                         onClick={(e) => {
//                           e.preventDefault();
//                           alert(`${product.name} added to wishlist!`);
//                         }}
//                         className="bg-white p-2 rounded-full shadow-md hover:bg-stone-100 transition"
//                         title="Add to Wishlist"
//                       >
//                         <Heart className="w-4 h-4" />
//                       </button>
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           alert('Quick view coming soon!');
//                         }}
//                         className="bg-white p-2 rounded-full shadow-md hover:bg-stone-100 transition"
//                         title="Quick View"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
                
//                   <h3 className="font-light text-sm sm:text-base lg:text-lg mb-2">{product.name}</h3>
//                   <div className="flex items-center justify-between">
//                     <p className="text-lg sm:text-xl font-light">{product.price}</p>
//                     <div className="flex items-center text-xs sm:text-sm text-amber-600">
//                       <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current mr-1" />
//                       {product.rating}
//                     </div>
//                   </div>

//                   <button 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       alert(`${product.name} added to cart!`);
//                     }}
//                     className="md:hidden w-full mt-3 bg-stone-900 text-white py-2 rounded-lg hover:bg-stone-800 transition text-sm font-medium flex items-center justify-center gap-2"
//                   >
//                     <ShoppingBag className="w-4 h-4" />
//                     Add to Cart
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="text-center mt-8 sm:mt-12">
//             <Link href="/newarrivals">
//               <button className="border-2 border-stone-900 text-stone-900 px-6 sm:px-8 py-3 sm:py-4 rounded hover:bg-stone-900 hover:text-white transition text-xs sm:text-sm uppercase tracking-wider">
//                 View All Products
//               </button>
//             </Link>
//           </div>
//         </div>
//       </section>


//       {/* CTA Banner - Responsive */}
//       <section className="relative py-20 sm:py-24 lg:py-32 bg-amber-50 overflow-hidden">
//         <div className="absolute inset-0">
//           <img src="/images/bridal.jpeg" alt="Bridal Background" className="w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-black opacity-40" />
//         </div>
//         <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6">Bridal Collection</h2>
//           <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
//             Make your special day unforgettable with our exquisite bridal silk sarees
//           </p>
//           <a href="/bridal">
//             <button className="bg-white text-stone-900 px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider hover:bg-stone-100 transition rounded">
//               View Bridal Collection
//             </button>
//           </a>
//         </div>
//       </section>

//       {/* Trust Badges - Responsive */}
//       <section className="py-12 sm:py-16 bg-stone-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             <div className="text-center">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Authentic Products</h3>
//               <p className="text-xs sm:text-sm text-stone-600">100% Genuine Silk</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Fast Delivery</h3>
//               <p className="text-xs sm:text-sm text-stone-600">3-5 Business Days</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                 </svg>
//               </div>
//               <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Easy Returns</h3>
//               <p className="text-xs sm:text-sm text-stone-600">7-Day Return Policy</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//               <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Secure Payment</h3>
//               <p className="text-xs sm:text-sm text-stone-600">Safe & Protected</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }