// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles, Sun, Flower2, ArrowUp, Wind, Leaf } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [showScroll, setShowScroll] = useState(false);

//   const sarees = [
//     {
//       id: 1,
//       name: "Cotton Breeze Saree",
//       fabric: "Cotton",
//       price: "₹6,500",
//       img: "https://images.unsplash.com/photo-1623330188318-8f3f0b6d6e8c?w=600&h=800&fit=crop",
//     },
//     {
//       id: 2,
//       name: "Pastel Glow Saree",
//       fabric: "Linen",
//       price: "₹8,200",
//       img: "https://images.unsplash.com/photo-1593032457869-9279e74df8ff?w=600&h=800&fit=crop",
//     },
//     {
//       id: 3,
//       name: "Chiffon Whisper Saree",
//       fabric: "Chiffon",
//       price: "₹9,000",
//       img: "https://images.unsplash.com/photo-1583391733981-50a9c33c2f1e?w=600&h=800&fit=crop",
//     },
//     {
//       id: 4,
//       name: "Linen Luxe Saree",
//       fabric: "Linen",
//       price: "₹7,800",
//       img: "https://images.unsplash.com/photo-1623330188131-0dd1e773b95d?w=600&h=800&fit=crop",
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: "₹5,900",
//       img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?w=600&h=800&fit=crop",
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: "₹8,700",
//       img: "https://images.unsplash.com/photo-1563245372-8a0aa00fc46e?w=600&h=800&fit=crop",
//     },
//   ];

//   // Scroll button visibility
//   useEffect(() => {
//     const handleScroll = () => setShowScroll(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredSarees =
//     activeFilter === "All"
//       ? sarees
//       : sarees.filter((s) => s.fabric === activeFilter);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-white text-slate-800 relative">
//       {/* HERO */}
//       <section className="relative flex flex-col items-center justify-center h-[65vh] overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=900&fit=crop"
//           alt="Summer collection"
//           className="absolute inset-0 w-full h-full object-cover opacity-80"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20"></div>
//         <div className="relative text-center text-white px-4">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <Sparkles className="w-5 h-5 text-amber-300" />
//             <span className="uppercase text-sm tracking-widest">
//               Summer Collection 2025
//             </span>
//           </div>
//           <h1 className="text-5xl md:text-6xl font-light mb-4">
//             Breezy Styles for Bright Days
//           </h1>
//           <p className="text-lg text-gray-100 max-w-xl mx-auto">
//             Lightweight, breathable, and elegant — made for your summer story.
//           </p>
//         </div>
//       </section>

//       {/* FILTERS */}
//       <div className="text-center py-8">
//         <h2 className="text-3xl font-light mb-4 text-amber-700">
//           Explore by Fabric
//         </h2>
//         <div className="flex justify-center flex-wrap gap-4">
//           {["All", "Cotton", "Linen", "Chiffon"].map((fabric) => (
//             <button
//               key={fabric}
//               onClick={() => setActiveFilter(fabric)}
//               className={`px-6 py-2 rounded-full border transition-all ${
//                 activeFilter === fabric
//                   ? "bg-amber-500 text-white border-amber-500 shadow-md"
//                   : "bg-white border-amber-200 text-slate-700 hover:bg-amber-50"
//               }`}
//             >
//               {fabric}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* PRODUCT GRID */}
//       <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {filteredSarees.map((s) => (
//           <div
//             key={s.id}
//             className="group bg-white rounded-xl shadow hover:shadow-lg transition-all duration-500 overflow-hidden"
//           >
//             <div className="relative overflow-hidden aspect-[3/4]">
//               <img
//                 src={s.img}
//                 alt={s.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//               <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs text-amber-600">
//                 {s.fabric}
//               </div>
//             </div>
//             <div className="p-5">
//               <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                 {s.name}
//               </h3>
//               <p className="text-amber-700 text-xl mb-3 font-medium">
//                 {s.price}
//               </p>
//               <button className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* CTA */}
//       <section className="text-center py-16 bg-white border-t border-amber-100">
//         <h2 className="text-3xl font-light text-amber-700 mb-4">
//           Feel the Breeze. Wear the Sunshine.
//         </h2>
//         <p className="text-slate-600 mb-6">
//           Step into the season with elegant drapes that define comfort and grace.
//         </p>
//         <button className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition">
//           View More Collections
//         </button>
//       </section>

//       {/* SCROLL TO TOP */}
//       {showScroll && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-8 right-8 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}

//       {/* FOOTER */}
//       <footer className="text-center py-6 text-slate-600 border-t border-amber-100">
//         <p className="flex items-center justify-center gap-2">
//           <Leaf className="text-amber-500" /> Handwoven freshness by
//           <span className="font-semibold"> Cotton Casa</span>
//         </p>
//       </footer>
//     </div>
//   );
// }





























// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles, Sun, Flower2, ArrowUp, Wind, Leaf, Heart, Star, TrendingUp, SlidersHorizontal } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeCategory, setActiveCategory] = useState("All Summer Sarees");
//   const [activePriceRange, setActivePriceRange] = useState("All Prices");
//   const [showTrendingOnly, setShowTrendingOnly] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);
//   const [sortBy, setSortBy] = useState("Newest First");

//   const sarees = [
//     {
//       id: 1,
//       name: "Cotton Breeze Saree",
//       fabric: "Cotton",
//       price: 6500,
//       originalPrice: 8500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1623330188318-8f3f0b6d6e8c?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 25 Oct 2025"
//     },
//     {
//       id: 2,
//       name: "Pastel Glow Saree",
//       fabric: "Linen",
//       price: 8200,
//       originalPrice: 10500,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1593032457869-9279e74df8ff?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 24 Oct 2025"
//     },
//     {
//       id: 3,
//       name: "Chiffon Whisper Saree",
//       fabric: "Chiffon",
//       price: 9000,
//       originalPrice: 11200,
//       rating: 4.7,
//       img: "https://images.unsplash.com/photo-1583391733981-50a9c33c2f1e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 23 Oct 2025"
//     },
//     {
//       id: 4,
//       name: "Linen Luxe Saree",
//       fabric: "Linen",
//       price: 7800,
//       originalPrice: 9800,
//       rating: 4.6,
//       img: "https://images.unsplash.com/photo-1623330188131-0dd1e773b95d?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 22 Oct 2025"
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: 5900,
//       originalPrice: 7500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 21 Oct 2025"
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: 8700,
//       originalPrice: 10900,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1563245372-8a0aa00fc46e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 20 Oct 2025"
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => setShowScroll(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredSarees = sarees.filter((s) => {
//     // Category filter
//     if (activeCategory === "Handloom Cotton" && s.fabric !== "Cotton") return false;
//     if (activeCategory === "Block Print" && s.fabric !== "Linen") return false;
//     if (activeCategory === "Khadi Cotton" && s.fabric !== "Chiffon") return false;
//     if (activeCategory === "Mangalgiri" && false) return false;
//     if (activeCategory === "Chanderi Cotton" && false) return false;
//     if (activeCategory === "Organic Cotton" && false) return false;
    
//     // Price filter
//     if (activePriceRange === "Under ₹2,000" && s.price >= 2000) return false;
//     if (activePriceRange === "₹2,000 - ₹4,000" && (s.price < 2000 || s.price > 4000)) return false;
//     if (activePriceRange === "Above ₹4,000" && s.price <= 4000) return false;
    
//     // Trending filter
//     if (showTrendingOnly && !s.trending) return false;
    
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      
//       {/* Main Content with Sidebar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* SIDEBAR FILTERS */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
//                 <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
//               </div>

//               {/* CATEGORY */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">CATEGORY</h4>
//                 <div className="space-y-3">
//                   {["All Summer Sarees", "Handloom Cotton", "Block Print", "Khadi Cotton", "Mangalgiri", "Chanderi Cotton", "Organic Cotton"].map((category) => (
//                     <label key={category} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={activeCategory === category}
//                         onChange={() => setActiveCategory(category)}
//                         className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-emerald-600 transition">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* PRICE RANGE */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">PRICE RANGE</h4>
//                 <div className="space-y-3">
//                   {["All Prices", "Under ₹2,000", "₹2,000 - ₹4,000", "Above ₹4,000"].map((range) => (
//                     <label key={range} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="price"
//                         checked={activePriceRange === range}
//                         onChange={() => setActivePriceRange(range)}
//                         className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-emerald-600 transition">{range}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* TRENDING CHECKBOX */}
//               <div className="pt-6 border-t border-slate-200">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={showTrendingOnly}
//                     onChange={(e) => setShowTrendingOnly(e.target.checked)}
//                     className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
//                   />
//                   <TrendingUp className="w-4 h-4 text-emerald-600" />
//                   <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition">Show Trending Only</span>
//                 </label>
//               </div>

//               {/* Clear Filters Button */}
//               <button 
//                 onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }}
//                 className="w-full mt-6 px-4 py-2 border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </aside>

//           {/* PRODUCTS SECTION */}
//           <div className="lg:col-span-3">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//               <div>
//                 <h2 className="text-3xl font-serif text-emerald-900 mb-1">
//                   {filteredSarees.length} Summer Cotton Sarees
//                 </h2>
//                 <p className="text-emerald-600 font-medium">Recently added products</p>
//               </div>
              
//               <select 
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-slate-700"
//               >
//                 <option>Sort by: Newest First</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Rating: High to Low</option>
//               </select>
//             </div>

//             {/* PRODUCT GRID */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredSarees.map((s) => (
//                 <div
//                   key={s.id}
//                   className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"
//                 >
//                   <div className="relative overflow-hidden aspect-[3/4]">
//                     <img
//                       src={s.img}
//                       alt={s.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />
                    
//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                         {s.badge}
//                       </div>
//                       {s.trending && (
//                         <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
//                           <TrendingUp className="w-3 h-3" />
//                           TRENDING
//                         </div>
//                       )}
//                     </div>

//                     {/* Desktop Hover Actions */}
//                     <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                       <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-3 border-2 border-emerald-100">
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             alert(`${s.name} added to cart!`);
//                           }}
//                           className="flex items-center gap-2 text-emerald-900 font-semibold hover:text-emerald-700 transition text-sm"
//                         >
//                           Add To Cart
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-6 w-px bg-emerald-200"></div>
                        
//                         <button 
//                           onClick={(e) => e.stopPropagation()}
//                           className="p-2 hover:bg-emerald-50 rounded-lg transition"
//                           title="Quick View"
//                         >
//                           <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-6 w-px bg-emerald-200"></div>
                        
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             alert(`${s.name} added to wishlist!`);
//                           }}
//                           className="p-2 hover:bg-emerald-50 rounded-lg transition"
//                           title="Add to Wishlist"
//                         >
//                           <Heart className="w-5 h-5 text-emerald-700" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Mobile Action Buttons */}
//                     <div className="md:hidden absolute top-3 right-3 flex flex-col gap-2">
//                       <button 
//                         onClick={(e) => {
//                           e.preventDefault();
//                           alert(`${s.name} added to wishlist!`);
//                         }}
//                         className="bg-white p-2 rounded-full shadow-lg hover:bg-emerald-50 transition"
//                       >
//                         <Heart className="w-4 h-4 text-emerald-600" />
//                       </button>
//                       <button 
//                         onClick={(e) => e.stopPropagation()}
//                         className="bg-white p-2 rounded-full shadow-lg hover:bg-emerald-50 transition"
//                       >
//                         <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
//                       {s.name}
//                     </h3>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-2xl font-bold text-emerald-700">₹{s.price.toLocaleString()}</span>
//                         <span className="text-sm text-slate-400 line-through">₹{s.originalPrice.toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
//                         <Star className="w-4 h-4 fill-green-600 text-green-600" />
//                         <span className="text-sm font-semibold text-green-700">{s.rating}</span>
//                       </div>
//                     </div>

//                     <p className="text-xs text-emerald-600 mb-3">{s.addedDate}</p>

//                     <button 
//                       onClick={() => alert(`${s.name} added to cart!`)}
//                       className="md:hidden w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredSarees.length === 0 && (
//               <div className="text-center py-20">
//                 <p className="text-xl text-slate-600">No products found matching your filters.</p>
//                 <button 
//                   onClick={() => {
//                     setActiveCategory("All Summer Sarees");
//                     setActivePriceRange("All Prices");
//                     setShowTrendingOnly(false);
//                   }}
//                   className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* SCROLL TO TOP */}
//       {showScroll && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}

//       {/* FOOTER */}
//       <footer className="text-center py-8 bg-white border-t border-green-100 mt-20">
//         <p className="flex items-center justify-center gap-2 text-slate-600">
//           <Leaf className="text-emerald-600" /> 
//           <span>Handwoven freshness by</span>
//           <span className="font-semibold text-emerald-700">Cotton Casa</span>
//         </p>
//       </footer>
//     </div>
//   );
// }



























// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles, Sun, Flower2, ArrowUp, Wind, Leaf, Heart, Star, TrendingUp, SlidersHorizontal } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeCategory, setActiveCategory] = useState("All Summer Sarees");
//   const [activePriceRange, setActivePriceRange] = useState("All Prices");
//   const [showTrendingOnly, setShowTrendingOnly] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);
//   const [sortBy, setSortBy] = useState("Newest First");

//   const sarees = [
//     {
//       id: 1,
//       name: "Cotton Breeze Saree",
//       fabric: "Cotton",
//       price: 6500,
//       originalPrice: 8500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1623330188318-8f3f0b6d6e8c?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 25 Oct 2025"
//     },
//     {
//       id: 2,
//       name: "Pastel Glow Saree",
//       fabric: "Linen",
//       price: 8200,
//       originalPrice: 10500,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1593032457869-9279e74df8ff?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 24 Oct 2025"
//     },
//     {
//       id: 3,
//       name: "Chiffon Whisper Saree",
//       fabric: "Chiffon",
//       price: 9000,
//       originalPrice: 11200,
//       rating: 4.7,
//       img: "https://images.unsplash.com/photo-1583391733981-50a9c33c2f1e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 23 Oct 2025"
//     },
//     {
//       id: 4,
//       name: "Linen Luxe Saree",
//       fabric: "Linen",
//       price: 7800,
//       originalPrice: 9800,
//       rating: 4.6,
//       img: "https://images.unsplash.com/photo-1623330188131-0dd1e773b95d?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 22 Oct 2025"
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: 5900,
//       originalPrice: 7500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 21 Oct 2025"
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: 8700,
//       originalPrice: 10900,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1563245372-8a0aa00fc46e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 20 Oct 2025"
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => setShowScroll(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredSarees = sarees.filter((s) => {
//     // Category filter
//     if (activeCategory === "Handloom Cotton" && s.fabric !== "Cotton") return false;
//     if (activeCategory === "Block Print" && s.fabric !== "Linen") return false;
//     if (activeCategory === "Khadi Cotton" && s.fabric !== "Chiffon") return false;
//     if (activeCategory === "Mangalgiri" && false) return false;
//     if (activeCategory === "Chanderi Cotton" && false) return false;
//     if (activeCategory === "Organic Cotton" && false) return false;
    
//     // Price filter
//     if (activePriceRange === "Under ₹2,000" && s.price >= 2000) return false;
//     if (activePriceRange === "₹2,000 - ₹4,000" && (s.price < 2000 || s.price > 4000)) return false;
//     if (activePriceRange === "Above ₹4,000" && s.price <= 4000) return false;
    
//     // Trending filter
//     if (showTrendingOnly && !s.trending) return false;
    
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      
//       {/* Hero Banner */}
//       <section className="relative h-[400px] md:h-[500px] overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=600&fit=crop"
//           alt="Summer Collection Banner"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-green-900/60 to-emerald-800/70"></div>
//         <div className="absolute inset-0 flex items-center">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//             <div className="max-w-2xl text-white">
//               <div className="inline-flex items-center gap-2 bg-emerald-600/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
//                 <Sparkles className="w-5 h-5 text-emerald-300" />
//                 <span className="text-sm font-semibold tracking-wide">SUMMER COLLECTION 2025</span>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
//                 Breezy Styles for Bright Days
//               </h1>
//               <p className="text-lg md:text-xl mb-6 opacity-95">
//                 Lightweight, breathable, and elegant — made for your summer story.
//               </p>
//               <div className="flex gap-4">
//                 <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
//                   Shop Now
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content with Sidebar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* SIDEBAR FILTERS */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
//                 <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
//               </div>

//               {/* CATEGORY */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">CATEGORY</h4>
//                 <div className="space-y-3">
//                   {["All Summer Sarees", "Handloom Cotton", "Block Print", "Khadi Cotton", "Mangalgiri", "Chanderi Cotton", "Organic Cotton"].map((category) => (
//                     <label key={category} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={activeCategory === category}
//                         onChange={() => setActiveCategory(category)}
//                         className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-emerald-600 transition">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* PRICE RANGE */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">PRICE RANGE</h4>
//                 <div className="space-y-3">
//                   {["All Prices", "Under ₹2,000", "₹2,000 - ₹4,000", "Above ₹4,000"].map((range) => (
//                     <label key={range} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="price"
//                         checked={activePriceRange === range}
//                         onChange={() => setActivePriceRange(range)}
//                         className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-emerald-600 transition">{range}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* TRENDING CHECKBOX */}
//               <div className="pt-6 border-t border-slate-200">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={showTrendingOnly}
//                     onChange={(e) => setShowTrendingOnly(e.target.checked)}
//                     className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
//                   />
//                   <TrendingUp className="w-4 h-4 text-emerald-600" />
//                   <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition">Show Trending Only</span>
//                 </label>
//               </div>

//               {/* Clear Filters Button */}
//               <button 
//                 onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }}
//                 className="w-full mt-6 px-4 py-2 border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </aside>

//           {/* PRODUCTS SECTION */}
//           <div className="lg:col-span-3">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//               <div>
//                 <h2 className="text-3xl font-serif text-emerald-900 mb-1">
//                   {filteredSarees.length} Summer Cotton Sarees
//                 </h2>
//                 <p className="text-emerald-600 font-medium">Recently added products</p>
//               </div>
              
//               <select 
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-slate-700"
//               >
//                 <option>Sort by: Newest First</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Rating: High to Low</option>
//               </select>
//             </div>

//             {/* PRODUCT GRID */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredSarees.map((s) => (
//                 <div
//                   key={s.id}
//                   className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"
//                 >
//                   <div className="relative overflow-hidden aspect-[3/4]">
//                     <img
//                       src={s.img}
//                       alt={s.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />
                    
//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                         {s.badge}
//                       </div>
//                       {s.trending && (
//                         <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
//                           <TrendingUp className="w-3 h-3" />
//                           TRENDING
//                         </div>
//                       )}
//                     </div>

//                     {/* Desktop Hover Actions */}
//                     <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                       <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-3 border-2 border-emerald-100">
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             alert(`${s.name} added to cart!`);
//                           }}
//                           className="flex items-center gap-2 text-emerald-900 font-semibold hover:text-emerald-700 transition text-sm"
//                         >
//                           Add To Cart
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-6 w-px bg-emerald-200"></div>
                        
//                         <button 
//                           onClick={(e) => e.stopPropagation()}
//                           className="p-2 hover:bg-emerald-50 rounded-lg transition"
//                           title="Quick View"
//                         >
//                           <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
                        
//                         <div className="h-6 w-px bg-emerald-200"></div>
                        
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             alert(`${s.name} added to wishlist!`);
//                           }}
//                           className="p-2 hover:bg-emerald-50 rounded-lg transition"
//                           title="Add to Wishlist"
//                         >
//                           <Heart className="w-5 h-5 text-emerald-700" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Mobile Action Buttons */}
//                     <div className="md:hidden absolute top-3 right-3 flex flex-col gap-2">
//                       <button 
//                         onClick={(e) => {
//                           e.preventDefault();
//                           alert(`${s.name} added to wishlist!`);
//                         }}
//                         className="bg-white p-2 rounded-full shadow-lg hover:bg-emerald-50 transition"
//                       >
//                         <Heart className="w-4 h-4 text-emerald-600" />
//                       </button>
//                       <button 
//                         onClick={(e) => e.stopPropagation()}
//                         className="bg-white p-2 rounded-full shadow-lg hover:bg-emerald-50 transition"
//                       >
//                         <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
//                       {s.name}
//                     </h3>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-2xl font-bold text-emerald-700">₹{s.price.toLocaleString()}</span>
//                         <span className="text-sm text-slate-400 line-through">₹{s.originalPrice.toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
//                         <Star className="w-4 h-4 fill-green-600 text-green-600" />
//                         <span className="text-sm font-semibold text-green-700">{s.rating}</span>
//                       </div>
//                     </div>

//                     <p className="text-xs text-emerald-600 mb-3">{s.addedDate}</p>

//                     <button 
//                       onClick={() => alert(`${s.name} added to cart!`)}
//                       className="md:hidden w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredSarees.length === 0 && (
//               <div className="text-center py-20">
//                 <p className="text-xl text-slate-600">No products found matching your filters.</p>
//                 <button 
//                   onClick={() => {
//                     setActiveCategory("All Summer Sarees");
//                     setActivePriceRange("All Prices");
//                     setShowTrendingOnly(false);
//                   }}
//                   className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* SCROLL TO TOP */}
//       {showScroll && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}

//       {/* FOOTER */}
//       <footer className="text-center py-8 bg-white border-t border-green-100 mt-20">
//         <p className="flex items-center justify-center gap-2 text-slate-600">
//           <Leaf className="text-emerald-600" /> 
//           <span>Handwoven freshness by</span>
//           <span className="font-semibold text-emerald-700">Cotton Casa</span>
//         </p>
//       </footer>
//     </div>
//   );
// }















// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles, ArrowUp, Heart, Star, TrendingUp, SlidersHorizontal, Leaf } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeCategory, setActiveCategory] = useState("All Summer Sarees");
//   const [activePriceRange, setActivePriceRange] = useState("All Prices");
//   const [showTrendingOnly, setShowTrendingOnly] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);
//   const [sortBy, setSortBy] = useState("Newest First");

//   const sarees = [
//     {
//       id: 1,
//       name: "Cotton Breeze Saree",
//       fabric: "Cotton",
//       price: 6500,
//       originalPrice: 8500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1623330188318-8f3f0b6d6e8c?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 25 Oct 2025"
//     },
//     {
//       id: 2,
//       name: "Pastel Glow Saree",
//       fabric: "Linen",
//       price: 8200,
//       originalPrice: 10500,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1593032457869-9279e74df8ff?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 24 Oct 2025"
//     },
//     {
//       id: 3,
//       name: "Chiffon Whisper Saree",
//       fabric: "Chiffon",
//       price: 9000,
//       originalPrice: 11200,
//       rating: 4.7,
//       img: "https://images.unsplash.com/photo-1583391733981-50a9c33c2f1e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 23 Oct 2025"
//     },
//     {
//       id: 4,
//       name: "Linen Luxe Saree",
//       fabric: "Linen",
//       price: 7800,
//       originalPrice: 9800,
//       rating: 4.6,
//       img: "https://images.unsplash.com/photo-1623330188131-0dd1e773b95d?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 22 Oct 2025"
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: 5900,
//       originalPrice: 7500,
//       rating: 4.8,
//       img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 21 Oct 2025"
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: 8700,
//       originalPrice: 10900,
//       rating: 4.9,
//       img: "https://images.unsplash.com/photo-1563245372-8a0aa00fc46e?w=600&h=800&fit=crop",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 20 Oct 2025"
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => setShowScroll(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredSarees = sarees.filter((s) => {
//     if (activeCategory === "Handloom Cotton" && s.fabric !== "Cotton") return false;
//     if (activeCategory === "Block Print" && s.fabric !== "Linen") return false;
//     if (activeCategory === "Khadi Cotton" && s.fabric !== "Chiffon") return false;

//     if (activePriceRange === "Under ₹2,000" && s.price >= 2000) return false;
//     if (activePriceRange === "₹2,000 - ₹4,000" && (s.price < 2000 || s.price > 4000)) return false;
//     if (activePriceRange === "Above ₹4,000" && s.price <= 4000) return false;

//     if (showTrendingOnly && !s.trending) return false;
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white">
      
//       {/* Hero Banner */}
//       <section className="relative h-[400px] md:h-[500px] overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=600&fit=crop"
//           alt="Summer Collection Banner"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-sky-900/60 to-blue-800/70"></div>
//         <div className="absolute inset-0 flex items-center">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//             <div className="max-w-2xl text-white">
//               <div className="inline-flex items-center gap-2 bg-blue-600/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
//                 <Sparkles className="w-5 h-5 text-blue-300" />
//                 <span className="text-sm font-semibold tracking-wide">SUMMER COLLECTION 2025</span>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
//                 Breezy Styles for Bright Days
//               </h1>
//               <p className="text-lg md:text-xl mb-6 opacity-95">
//                 Lightweight, breathable, and elegant — made for your summer story.
//               </p>
//               <button className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
//                 Shop Now
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content with Sidebar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* SIDEBAR FILTERS */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <SlidersHorizontal className="w-5 h-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
//               </div>

//               {/* CATEGORY */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">CATEGORY</h4>
//                 <div className="space-y-3">
//                   {["All Summer Sarees", "Handloom Cotton", "Block Print", "Khadi Cotton", "Mangalgiri", "Chanderi Cotton", "Organic Cotton"].map((category) => (
//                     <label key={category} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={activeCategory === category}
//                         onChange={() => setActiveCategory(category)}
//                         className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-blue-600 transition">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* PRICE RANGE */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">PRICE RANGE</h4>
//                 <div className="space-y-3">
//                   {["All Prices", "Under ₹2,000", "₹2,000 - ₹4,000", "Above ₹4,000"].map((range) => (
//                     <label key={range} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="price"
//                         checked={activePriceRange === range}
//                         onChange={() => setActivePriceRange(range)}
//                         className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-blue-600 transition">{range}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* TRENDING CHECKBOX */}
//               <div className="pt-6 border-t border-slate-200">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={showTrendingOnly}
//                     onChange={(e) => setShowTrendingOnly(e.target.checked)}
//                     className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
//                   />
//                   <TrendingUp className="w-4 h-4 text-blue-600" />
//                   <span className="text-slate-700 font-medium group-hover:text-blue-600 transition">Show Trending Only</span>
//                 </label>
//               </div>

//               <button 
//                 onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }}
//                 className="w-full mt-6 px-4 py-2 border-2 border-blue-200 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </aside>

//           {/* PRODUCTS SECTION */}
//           <div className="lg:col-span-3">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//               <div>
//                 <h2 className="text-3xl font-serif text-blue-900 mb-1">
//                   {filteredSarees.length} Summer Cotton Sarees
//                 </h2>
//                 <p className="text-blue-600 font-medium">Recently added products</p>
//               </div>
              
//               <select 
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700"
//               >
//                 <option>Sort by: Newest First</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Rating: High to Low</option>
//               </select>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredSarees.map((s) => (
//                 <div key={s.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden">
//                   <div className="relative overflow-hidden aspect-[3/4]">
//                     <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">{s.badge}</div>
//                       {s.trending && (
//                         <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
//                           <TrendingUp className="w-3 h-3" />
//                           TRENDING
//                         </div>
//                       )}
//                     </div>

//                     <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                       <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-3 border-2 border-blue-100">
//                         <button onClick={() => alert(`${s.name} added to cart!`)} className="flex items-center gap-2 text-blue-900 font-semibold hover:text-blue-700 transition text-sm">
//                           Add To Cart
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </button>
//                         <div className="h-6 w-px bg-blue-200"></div>
//                         <button className="p-2 hover:bg-blue-50 rounded-lg transition" title="Quick View">
//                           <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
//                         <div className="h-6 w-px bg-blue-200"></div>
//                         <button onClick={() => alert(`${s.name} added to wishlist!`)} className="p-2 hover:bg-blue-50 rounded-lg transition" title="Add to Wishlist">
//                           <Heart className="w-5 h-5 text-blue-700" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">{s.name}</h3>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-2xl font-bold text-blue-700">₹{s.price.toLocaleString()}</span>
//                         <span className="text-sm text-slate-400 line-through">₹{s.originalPrice.toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
//                         <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
//                         <span className="text-sm font-semibold text-blue-700">{s.rating}</span>
//                       </div>
//                     </div>
//                     <p className="text-xs text-blue-600 mb-3">{s.addedDate}</p>
//                     <button onClick={() => alert(`${s.name} added to cart!`)} className="md:hidden w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredSarees.length === 0 && (
//               <div className="text-center py-20">
//                 <p className="text-xl text-slate-600">No products found matching your filters.</p>
//                 <button onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
//                   Clear All Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* SCROLL TO TOP */}
//       {showScroll && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}

//       {/* FOOTER */}
//       <footer className="text-center py-8 bg-white border-t border-blue-100 mt-20">
//         <p className="flex items-center justify-center gap-2 text-slate-600">
//           <Leaf className="text-blue-600" /> 
//                        <span>
//             Crafted with care — Cotton Casa © {new Date().getFullYear()}
//           </span>
//         </p>
//         <p className="text-sm text-slate-400 mt-2">
//           Designed to bring timeless elegance & sustainable craftsmanship together.
//         </p>
//       </footer>
//     </div>
//   );
// }




























































































// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles, ArrowUp, Heart, Star, TrendingUp, SlidersHorizontal, Leaf } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeCategory, setActiveCategory] = useState("All Summer Sarees");
//   const [activePriceRange, setActivePriceRange] = useState("All Prices");
//   const [showTrendingOnly, setShowTrendingOnly] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);
//   const [sortBy, setSortBy] = useState("Newest First");

//   const sarees = [
//     {
//       id: 1,
//       name: "Cotton Breeze Saree",
//       fabric: "Cotton",
//       price: 6500,
//       originalPrice: 8500,
//       rating: 4.8,
//       img: "/images/c1.jpeg",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 25 Oct 2025"
//     },
//     {
//       id: 2,
//       name: "Pastel Glow Saree",
//       fabric: "Linen",
//       price: 8200,
//       originalPrice: 10500,
//       rating: 4.9,
//       img: "/images/c2.jpeg",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 24 Oct 2025"
//     },
//     {
//       id: 3,
//       name: "Chiffon Whisper Saree",
//       fabric: "Chiffon",
//       price: 9000,
//       originalPrice: 11200,
//       rating: 4.7,
//       img: "/images/c3.jpeg",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 23 Oct 2025"
//     },
//     {
//       id: 4,
//       name: "Linen Luxe Saree",
//       fabric: "Linen",
//       price: 7800,
//       originalPrice: 9800,
//       rating: 4.6,
//       img: "/images/c4.jpeg",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 22 Oct 2025"
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: 5900,
//       originalPrice: 7500,
//       rating: 4.8,
//       img: "/images/c5.jpeg",
//       badge: "NEW",
//       trending: true,
//       addedDate: "Added on 21 Oct 2025"
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: 8700,
//       originalPrice: 10900,
//       rating: 4.9,
//       img: "/images/c6.jpeg",
//       badge: "NEW",
//       trending: false,
//       addedDate: "Added on 20 Oct 2025"
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => setShowScroll(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredSarees = sarees.filter((s) => {
//     if (activeCategory === "Handloom Cotton" && s.fabric !== "Cotton") return false;
//     if (activeCategory === "Block Print" && s.fabric !== "Linen") return false;
//     if (activeCategory === "Khadi Cotton" && s.fabric !== "Chiffon") return false;

//     if (activePriceRange === "Under ₹2,000" && s.price >= 2000) return false;
//     if (activePriceRange === "₹2,000 - ₹4,000" && (s.price < 2000 || s.price > 4000)) return false;
//     if (activePriceRange === "Above ₹4,000" && s.price <= 4000) return false;

//     if (showTrendingOnly && !s.trending) return false;
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      
//       {/* Hero Banner */}
//       {/* <section className="relative h-[400px] md:h-[500px] overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=600&fit=crop"
//           alt="Summer Collection Banner"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-indigo-800/60 to-indigo-700/70"></div>
//         <div className="absolute inset-0 flex items-center">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//             <div className="max-w-2xl text-white">
//               <div className="inline-flex items-center gap-2 bg-indigo-600/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
//                 <Sparkles className="w-5 h-5 text-indigo-300" />
//                 <span className="text-sm font-semibold tracking-wide">SUMMER COLLECTION 2025</span>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
//                 Breezy Styles for Bright Days
//               </h1>
//               <p className="text-lg md:text-xl mb-6 opacity-95">
//                 Lightweight, breathable, and elegant — made for your summer story.
//               </p>
//               <button className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
//                 Shop Now
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section> */}


//       <section
//   className="relative h-[400px] md:h-[700px] overflow-hidden bg-cover bg-center"
//   style={{ backgroundImage: "url('/images/summer.png')" }}
// >
//   {/* Gradient Overlay */}
//   <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-indigo-800/60 to-indigo-700/70"></div>

//   {/* Content */}
//   <div className="absolute inset-0 flex items-center">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//       <div className="max-w-2xl text-white">
//         <div className="inline-flex items-center gap-2 bg-indigo-600/40 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
//           <Sparkles className="w-5 h-5 text-indigo-300" />
//           <span className="text-sm font-semibold tracking-wide">
//             SUMMER COLLECTION 2025
//           </span>
//         </div>
//         <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
//           Breezy Styles for Bright Days
//         </h1>
//         <p className="text-lg md:text-xl mb-6 opacity-95">
//           Lightweight, breathable, and elegant — made for your summer story.
//         </p>
//         <button className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
//           Shop Now
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M14 5l7 7m0 0l-7 7m7-7H3"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   </div>
// </section>


//       {/* Main Content with Sidebar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* SIDEBAR FILTERS */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
//                 <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
//               </div>

//               {/* CATEGORY */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">CATEGORY</h4>
//                 <div className="space-y-3">
//                   {["All Summer Sarees", "Handloom Cotton", "Block Print", "Khadi Cotton", "Mangalgiri", "Chanderi Cotton", "Organic Cotton"].map((category) => (
//                     <label key={category} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={activeCategory === category}
//                         onChange={() => setActiveCategory(category)}
//                         className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-indigo-600 transition">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* PRICE RANGE */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-slate-900 mb-4">PRICE RANGE</h4>
//                 <div className="space-y-3">
//                   {["All Prices", "Under ₹2,000", "₹2,000 - ₹4,000", "Above ₹4,000"].map((range) => (
//                     <label key={range} className="flex items-center gap-3 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="price"
//                         checked={activePriceRange === range}
//                         onChange={() => setActivePriceRange(range)}
//                         className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
//                       />
//                       <span className="text-slate-700 group-hover:text-indigo-600 transition">{range}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* TRENDING CHECKBOX */}
//               <div className="pt-6 border-t border-slate-200">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                   <input
//                     type="checkbox"
//                     checked={showTrendingOnly}
//                     onChange={(e) => setShowTrendingOnly(e.target.checked)}
//                     className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
//                   />
//                   <TrendingUp className="w-4 h-4 text-indigo-600" />
//                   <span className="text-slate-700 font-medium group-hover:text-indigo-600 transition">Show Trending Only</span>
//                 </label>
//               </div>

//               <button 
//                 onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }}
//                 className="w-full mt-6 px-4 py-2 border-2 border-indigo-200 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </aside>

//           {/* PRODUCTS SECTION */}
//           <div className="lg:col-span-3">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//               <div>
//                 <h2 className="text-3xl font-serif text-indigo-900 mb-1">
//                   {filteredSarees.length} Summer Cotton Sarees
//                 </h2>
//                 <p className="text-indigo-600 font-medium">Recently added products</p>
//               </div>
              
//               <select 
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
//               >
//                 <option>Sort by: Newest First</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Rating: High to Low</option>
//               </select>
//             </div>

//             {/* Product Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredSarees.map((s) => (
//                 <div key={s.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden">
//                   <div className="relative overflow-hidden aspect-[3/4]">
//                     <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">{s.badge}</div>
//                       {s.trending && (
//                         <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
//                           <TrendingUp className="w-3 h-3" />
//                           TRENDING
//                         </div>
//                       )}
//                     </div>

//                     <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                       <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-3 border-2 border-indigo-100">
//                         <button onClick={() => alert(`${s.name} added to cart!`)} className="flex items-center gap-2 text-indigo-900 font-semibold hover:text-indigo-700 transition text-sm">
//                           Add To Cart
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </button>
//                         <div className="h-6 w-px bg-indigo-200"></div>
//                         <button className="p-2 hover:bg-indigo-50 rounded-lg transition" title="Quick View">
//                           <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
//                         <div className="h-6 w-px bg-indigo-200"></div>
//                         <button onClick={() => alert(`${s.name} added to wishlist!`)} className="p-2 hover:bg-indigo-50 rounded-lg transition" title="Add to Wishlist">
//                           <Heart className="w-5 h-5 text-indigo-700" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">{s.name}</h3>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-2xl font-bold text-indigo-700">₹{s.price.toLocaleString()}</span>
//                         <span className="text-sm text-slate-400 line-through">₹{s.originalPrice.toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
//                         <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
//                         <span className="text-sm font-semibold text-indigo-700">{s.rating}</span>
//                       </div>
//                     </div>
//                     <p className="text-xs text-indigo-600 mb-3">{s.addedDate}</p>
//                     <button onClick={() => alert(`${s.name} added to cart!`)} className="md:hidden w-full bg-gradient-to-r from-indigo-700 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredSarees.length === 0 && (
//               <div className="text-center py-20">
//                 <p className="text-xl text-slate-600">No products found matching your filters.</p>
//                 <button onClick={() => {
//                   setActiveCategory("All Summer Sarees");
//                   setActivePriceRange("All Prices");
//                   setShowTrendingOnly(false);
//                 }} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
//                   Clear All Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* SCROLL TO TOP */}
// //       {showScroll && (
//          <button
//            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50"
//          >
//            <ArrowUp className="w-5 h-5" />
//          </button>
//        )}

//        {/* FOOTER
//        <footer className="text-center py-8 bg-white border-t border-blue-100 mt-20">
//          <p className="flex items-center justify-center gap-2 text-slate-600">
//            <Leaf className="text-blue-600" /> 
//                         <span>
//              Crafted with care — Cotton Casa © {new Date().getFullYear()}
//          </span>
//       </p>
//       <p className="text-sm text-slate-400 mt-2">
//           Designed to bring timeless elegance & sustainable craftsmanship together.
//         </p>
//        </footer> */}
//      </div>
//    );
//    }

































































   "use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Sun, Flower2, ArrowUp, Wind, Leaf } from "lucide-react";

export default function SummerCollectionPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showScroll, setShowScroll] = useState(false);
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data from MySQL database
  useEffect(() => {
    const fetchSummerSarees = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from your backend API - you can filter by category if needed
        const response = await fetch('https://zyra-website.onrender.com/api/sarees');
        
        if (!response.ok) {
          throw new Error('Failed to fetch sarees');
        }

        const data = await response.json();
        
        // Transform data to match component structure
        const transformedData = data.map(item => ({
          id: item.id,
          name: item.saree_name,
          fabric: item.fabric || 'Cotton',
          price: `₹${parseFloat(item.discounted_price).toLocaleString()}`,
          img: item.images && item.images.length > 0 
            ? `https://zyra-website.onrender.com${item.images[0]}` 
            : '/s.png'
        }));

        setSarees(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sarees:', error);
        setError(error.message);
        setSarees([]);
        setLoading(false);
      }
    };

    fetchSummerSarees();
  }, []);

  // Scroll button visibility
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredSarees =
    activeFilter === "All"
      ? sarees
      : sarees.filter((s) => s.fabric === activeFilter);

  // Get unique fabrics for filter buttons
  const uniqueFabrics = ["All", ...new Set(sarees.map(s => s.fabric))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white text-slate-800 relative">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center h-[65vh] overflow-hidden">
        <img
          src="/images/summer.png"
          alt="Summer collection"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 to-yellow-900/20"></div>
        <div className="relative text-center text-white px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="uppercase text-sm tracking-widest">
              Summer Collection 2025
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-4">
            Breezy Styles for Bright Days
          </h1>
          <p className="text-lg text-amber-100 max-w-xl mx-auto">
            Lightweight, breathable, and elegant — made for your summer story.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-light mb-4 text-amber-700">
          Explore by Fabric
        </h2>
        <div className="flex justify-center flex-wrap gap-4">
          {uniqueFabrics.map((fabric) => (
            <button
              key={fabric}
              onClick={() => setActiveFilter(fabric)}
              className={`px-6 py-2 rounded-full border transition-all ${
                activeFilter === fabric
                  ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-600 shadow-md"
                  : "bg-white border-amber-200 text-slate-700 hover:bg-amber-50"
              }`}
            >
              {fabric}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700 font-medium">Loading summer collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
            <p className="text-xl text-red-900 mb-2 font-semibold">Failed to load products</p>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredSarees.length === 0 ? (
          <div className="text-center py-20 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-xl text-amber-900 mb-2 font-semibold">No products found</p>
            <p className="text-amber-700">Try selecting a different fabric</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSarees.map((s) => (
              <div
                key={s.id}
                className="group bg-white rounded-xl shadow hover:shadow-lg transition-all duration-500 overflow-hidden border border-amber-100"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs text-amber-600 border border-amber-200">
                    {s.fabric}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {s.name}
                  </h3>
                  <p className="text-amber-700 text-xl mb-3 font-medium">
                    {s.price}
                  </p>
                  <button 
                    onClick={() => alert(`${s.name} added to cart!`)}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-2 rounded-lg hover:shadow-lg transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-white border-t border-amber-100">
        <h2 className="text-3xl font-light text-amber-700 mb-4">
          Feel the Breeze. Wear the Sunshine.
        </h2>
        <p className="text-slate-600 mb-6">
          Step into the season with elegant drapes that define comfort and grace.
        </p>
        <button className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition">
          View More Collections
        </button>
      </section>

      {/* SCROLL TO TOP */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* FOOTER */}
      <footer className="text-center py-6 text-slate-600 border-t border-amber-100">
        <p className="flex items-center justify-center gap-2">
          <Leaf className="text-amber-600" /> Handwoven freshness by
          <span className="font-semibold"> Cotton Casa</span>
        </p>
      </footer>
    </div>
  );
}
