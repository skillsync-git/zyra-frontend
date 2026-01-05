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
//       img: "/s.png",
//     },
//     {
//       id: 5,
//       name: "Cotton Sunshine Saree",
//       fabric: "Cotton",
//       price: "₹5,900",
//       img: "/s.png",
//     },
//     {
//       id: 6,
//       name: "Chiffon Delight Saree",
//       fabric: "Chiffon",
//       price: "₹8,700",
//       img: "/s.png",
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
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-white text-slate-800 relative">
//       {/* HERO */}
//       <section className="relative flex flex-col items-center justify-center h-[65vh] overflow-hidden">
//         <img
//           src="/images/summer.png"
//           alt="Summer collection"
//           className="absolute inset-0 w-full h-full object-cover opacity-10"
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
// import { Sparkles, Sun, Flower2, ArrowUp, Wind, Leaf } from "lucide-react";

// export default function SummerCollectionPage() {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [showScroll, setShowScroll] = useState(false);
//   const [sarees, setSarees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch data from MySQL database
//   useEffect(() => {
//     const fetchSummerSarees = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch from your backend API - you can filter by category if needed
//         const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/sarees');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch sarees');
//         }

//         const data = await response.json();
        
//         // Transform data to match component structure
//         const transformedData = data.map(item => ({
//           id: item.id,
//           name: item.saree_name,
//           fabric: item.fabric || 'Cotton',
//           price: `₹${parseFloat(item.discounted_price).toLocaleString()}`,
//           img: item.images && item.images.length > 0 
//             ? `https://api-xmg2fjjbya-uc.a.run.app${item.images[0]}` 
//             : '/s.png'
//         }));

//         setSarees(transformedData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching sarees:', error);
//         setError(error.message);
//         setSarees([]);
//         setLoading(false);
//       }
//     };

//     fetchSummerSarees();
//   }, []);

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

//   // Get unique fabrics for filter buttons
//   const uniqueFabrics = ["All", ...new Set(sarees.map(s => s.fabric))];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-white text-slate-800 relative">
//       {/* HERO */}
//       <section className="relative flex flex-col items-center justify-center h-[65vh] overflow-hidden">
//         <img
//           src="/images/summer.png"
//           alt="Summer collection"
//           className="absolute inset-0 w-full h-full object-cover opacity-10"
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
//           {uniqueFabrics.map((fabric) => (
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
//       <section className="max-w-7xl mx-auto px-6 pb-20">
//         {loading ? (
//           <div className="text-center py-20">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto"></div>
//             <p className="mt-4 text-amber-700 font-medium">Loading summer collection...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
//             <p className="text-xl text-red-900 mb-2 font-semibold">Failed to load products</p>
//             <p className="text-red-700 mb-4">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
//             >
//               Retry
//             </button>
//           </div>
//         ) : filteredSarees.length === 0 ? (
//           <div className="text-center py-20 bg-amber-50 rounded-2xl border border-amber-200">
//             <p className="text-xl text-amber-900 mb-2 font-semibold">No products found</p>
//             <p className="text-amber-700">Try selecting a different fabric</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredSarees.map((s) => (
//               <div
//                 key={s.id}
//                 className="group bg-white rounded-xl shadow hover:shadow-lg transition-all duration-500 overflow-hidden"
//               >
//                 <div className="relative overflow-hidden aspect-[3/4]">
//                   <img
//                     src={s.img}
//                     alt={s.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs text-amber-600">
//                     {s.fabric}
//                   </div>
//                 </div>
//                 <div className="p-5">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                     {s.name}
//                   </h3>
//                   <p className="text-amber-700 text-xl mb-3 font-medium">
//                     {s.price}
//                   </p>
//                   <button 
//                     onClick={() => alert(`${s.name} added to cart!`)}
//                     className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
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
        const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/sarees');
        
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
            ? `https://api-xmg2fjjbya-uc.a.run.app${item.images[0]}` 
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
          className="absolute inset-0 w-full h-full object-cover opacity-10"
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