// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

// export default function ProductDetailPage({ productId }) {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   const images = [
//     '/images/product-1.jpg',
//     '/images/product-2.jpg',
//     '/images/product-3.jpg',
//     '/images/product-4.jpg',
//   ];

//   const product = {
//     name: "Royal Maroon Kanjivaram Silk Saree",
//     price: 18999,
//     originalPrice: 24999,
//     rating: 4.8,
//     reviews: 127,
//     description: "Experience the timeless elegance of this handwoven Kanjivaram silk saree. Crafted by master weavers using pure mulberry silk and genuine zari, this masterpiece features intricate traditional motifs and a rich maroon color that exudes royalty.",
//     features: [
//       "100% Pure Kanjivaram Silk",
//       "Handwoven with Golden Zari",
//       "Traditional Temple Border Design",
//       "Includes Matching Blouse Piece",
//       "Length: 6.3 meters (5.5m saree + 0.8m blouse)",
//     ],
//     care: [
//       "Dry clean only",
//       "Store in a cool, dry place",
//       "Avoid direct sunlight",
//       "Iron on low heat with cloth",
//     ]
//   };

//   const relatedProducts = [
//     { id: 1, name: "Golden Zari Banarasi", price: 22499, img: "/images/product-2.jpg" },
//     { id: 2, name: "Emerald Tussar Silk", price: 15999, img: "/images/product-3.jpg" },
//     { id: 3, name: "Ruby Red Patola", price: 24999, img: "/images/product-4.jpg" },
//     { id: 4, name: "Navy Blue Kanjivaram", price: 19999, img: "/images/product-5.jpg" },
//   ];

//   return (
//     <div className="min-h-screen bg-stone-50">
//       {/* Header Spacer */}
//       <div className="h-20"></div>

//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <p className="text-sm text-stone-600">
//           <Link href="/" className="hover:text-amber-700">Home</Link> / 
//           <Link href="/collections" className="hover:text-amber-700"> Collections</Link> / 
//           <Link href="/collections/kanjivaram" className="hover:text-amber-700"> Kanjivaram</Link> / 
//           <span className="text-stone-900"> {product.name}</span>
//         </p>
//       </div>

//       {/* Product Section */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Image Gallery */}
//           <div>
//             {/* Main Image */}
//             <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4">
//               <Image
//                 src={images[selectedImage]}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//               />
//               <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-stone-100 transition">
//                 <Heart className="w-6 h-6" />
//               </button>
//               <button 
//                 onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button 
//                 onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Thumbnail Images */}
//             <div className="grid grid-cols-4 gap-3">
//               {images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`relative aspect-square rounded-lg overflow-hidden ${
//                     selectedImage === idx ? 'ring-2 ring-amber-700' : ''
//                   }`}
//                 >
//                   <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div>
//             <h1 className="text-4xl font-light mb-4">{product.name}</h1>
            
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex items-center text-amber-600">
//                 <Star className="w-5 h-5 fill-current" />
//                 <span className="ml-2 text-lg">{product.rating}</span>
//               </div>
//               <span className="text-stone-600">({product.reviews} reviews)</span>
//             </div>

//             <div className="flex items-baseline gap-4 mb-6">
//               <span className="text-4xl font-light">₹{product.price.toLocaleString()}</span>
//               <span className="text-2xl text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
//               <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
//                 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//               </span>
//             </div>

//             <p className="text-stone-600 mb-6 leading-relaxed">{product.description}</p>

//             {/* Quantity Selector */}
//             <div className="mb-6">
//               <label className="block text-sm uppercase tracking-wide mb-3 text-stone-600">Quantity</label>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 border border-stone-300 rounded flex items-center justify-center hover:bg-stone-100"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg w-12 text-center">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 border border-stone-300 rounded flex items-center justify-center hover:bg-stone-100"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 mb-8">
//               <button className="flex-1 bg-stone-900 text-white py-4 px-8 rounded hover:bg-stone-800 transition flex items-center justify-center gap-2">
//                 <ShoppingBag className="w-5 h-5" />
//                 Add to Cart
//               </button>
//               <button className="bg-amber-700 text-white py-4 px-8 rounded hover:bg-amber-800 transition">
//                 
//               </button>
//             </div>

//             {/* Features */}
//             <div className="border-t pt-6 mb-6">
//               <h3 className="text-sm uppercase tracking-wide mb-4 text-stone-600">Product Features</h3>
//               <ul className="space-y-2">
//                 {product.features.map((feature, idx) => (
//                   <li key={idx} className="flex items-start">
//                     <span className="text-amber-700 mr-2">✓</span>
//                     <span className="text-stone-700">{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Benefits */}
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="text-center">
//                 <Truck className="w-8 h-8 mx-auto mb-2 text-amber-700" />
//                 <p className="text-xs text-stone-600">Free Shipping</p>
//               </div>
//               <div className="text-center">
//                 <RefreshCw className="w-8 h-8 mx-auto mb-2 text-amber-700" />
//                 <p className="text-xs text-stone-600">Easy Returns</p>
//               </div>
//               <div className="text-center">
//                 <Shield className="w-8 h-8 mx-auto mb-2 text-amber-700" />
//                 <p className="text-xs text-stone-600">Authentic Product</p>
//               </div>
//             </div>

//             {/* Care Instructions */}
//             <div className="border-t pt-6">
//               <h3 className="text-sm uppercase tracking-wide mb-4 text-stone-600">Care Instructions</h3>
//               <ul className="space-y-2">
//                 {product.care.map((instruction, idx) => (
//                   <li key={idx} className="text-sm text-stone-700">• {instruction}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-3xl font-light mb-8 text-center">You May Also Like</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {relatedProducts.map(item => (
//             <Link key={item.id} href={`/product/${item.id}`}>
//               <div className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden mb-3">
//                   <Image
//                     src={item.img}
//                     alt={item.name}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//                 <h3 className="font-light mb-1">{item.name}</h3>
//                 <p className="text-lg">₹{item.price.toLocaleString()}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


















import React from 'react';

export default function ProductDetail() {
  // Sample data; in real use, fetch from API or route params
  const product = {
    name: "Premium Kanjivaram Silk Saree",
    category: "Kanjivaram",
    price: 6200,
    cutPrice: 7800,
    rating: 5.0,
    reviews: 71,
    description:
      "Experience the luxury and tradition of handwoven Kanjivaram silk. Vibrant colors, beautiful zari border, and premium quality fabric – perfect for weddings and festive occasions.",
    img: "/images/saree3.jpg",
    offers: "Save ₹1600 • 21% OFF",
    inStock: true,
    colors: ["red", "gold"]
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-12 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row w-full max-w-4xl">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
          <img src={product.img} alt={product.name} className="rounded-lg shadow-lg h-96 object-cover" />
        </div>
        {/* Product Details */}
        <div className="md:w-1/2 md:pl-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">{product.name}</h2>
          <span className="bg-yellow-100 text-yellow-900 text-xs rounded-full px-3 py-1 mb-2 w-fit">{product.category}</span>
          <div className="flex items-center text-lg font-semibold mb-1">
            ₹{product.price}
            <span className="line-through text-gray-400 text-sm ml-3">₹{product.cutPrice}</span>
          </div>
          <span className="text-green-600 text-sm mb-2">{product.offers}</span>
          <div className="flex items-center my-2">
            <span className="text-yellow-500 mr-2">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="text-gray-400">{'★'.repeat(5 - Math.floor(product.rating))}</span>
            <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
          </div>
          <p className="text-slate-700 text-base mt-4 mb-4">{product.description}</p>
          <p className="text-sm text-slate-500 mb-2">
            <span className={product.inStock ? "text-green-600" : "text-red-500"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </p>
          <div className="flex space-x-2 mb-6">
            {product.colors.map((color, idx) => (
              <span
                key={color}
                className={`w-6 h-6 rounded-full border border-gray-200 ${color === "red" ? "bg-red-500" : color === "gold" ? "bg-yellow-400" : ""}`}
                title={color}
              ></span>
            ))}
          </div>
          <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 px-6 font-semibold shadow transition">
            Add to Cart
          </button>
        </div>
      </div>
      {/* You can add more tabs/sections: fabric info, wash care, delivery, etc. below as desired */}
    </div>
  );
}
