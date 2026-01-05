// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { Award, Users, Heart, Sparkles } from 'lucide-react';

// export default function AboutPage() {
//   const values = [
//     {
//       icon: <Award className="w-12 h-12" />,
//       title: "Quality Craftsmanship",
//       desc: "Each saree is handwoven by master artisans with decades of experience"
//     },
//     {
//       icon: <Users className="w-12 h-12" />,
//       title: "Artisan Support",
//       desc: "We work directly with weavers, ensuring fair wages and sustainable practices"
//     },
//     {
//       icon: <Heart className="w-12 h-12" />,
//       title: "Heritage Preservation",
//       desc: "Committed to preserving India's rich textile heritage for future generations"
//     },
//     {
//       icon: <Sparkles className="w-12 h-12" />,
//       title: "Authentic Materials",
//       desc: "Only pure cotton and genuine zari used in every piece"
//     }
//   ];

//   const timeline = [
//     { year: "2010", event: "Founded with a vision to preserve traditional cotton weaving" },
//     { year: "2013", event: "Expanded to work with 50+ master weavers across India" },
//     { year: "2016", event: "Launched our first flagship store in Chennai" },
//     { year: "2019", event: "Introduced online shopping experience" },
//     { year: "2023", event: "Serving 10,000+ happy customers nationwide" }
//   ];

//   return (
//     <div className="min-h-screen bg-stone-50">
//       {/* Header Spacer */}
//       <div className="h-20"></div>

//       {/* Hero Section */}
//       <div className="relative h-96 bg-stone-900">
//         <Image
//           src="/images/banerc.jpg"
//           alt="About Us"
//           fill
//           className="object-cover opacity-50"
//         />
//         <div className="absolute inset-0 flex items-center justify-center text-white">
//           <div className="text-center max-w-3xl px-4">
//             <h1 className="text-5xl md:text-6xl font-light mb-6">Our Story</h1>
//             <p className="text-xl opacity-90">Weaving traditions, creating legacies</p>
//           </div>
//         </div>
//       </div>

//       {/* Story Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-light mb-6">Celebrating Indian Cotton Heritage</h2>
//           <div className="w-24 h-1 bg-amber-700 mx-auto mb-8"></div>
//           <p className="text-lg text-stone-700 leading-relaxed mb-6">
//             Founded in 2020, Cotton Casa began with a simple yet profound mission: to preserve and celebrate 
//             Indias rich silk weaving traditions while providing sustainable livelihoods to our master artisans.
//           </p>
//           <p className="text-lg text-stone-700 leading-relaxed mb-6">
//             What started as a small initiative working with a handful of weavers has now grown into a 
//             thriving community of over 50 master craftsmen across Tamil Nadu, Varanasi, and Gujarat. 
//             Each saree we offer tells a story of dedication, skill, and centuries-old techniques passed 
//             down through generations.
//           </p>
//           <p className="text-lg text-stone-700 leading-relaxed">
//             We believe that every woman deserves to experience the timeless elegance of authentic cotton 
//             sarees, and every artisan deserves fair compensation for their extraordinary craftsmanship. 
//             This belief drives everything we do.
//           </p>
//         </div>
//       </div>

//       {/* Values Section */}
//       <div className="bg-white py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-4xl font-light text-center mb-16">Our Values</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((value, idx) => (
//               <div key={idx} className="text-center">
//                 <div className="text-amber-700 flex justify-center mb-4">
//                   {value.icon}
//                 </div>
//                 <h3 className="text-xl font-light mb-3">{value.title}</h3>
//                 <p className="text-stone-600">{value.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Timeline Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20">
//         <h2 className="text-4xl font-light text-center mb-16">Our Journey</h2>
//         <div className="space-y-8">
//           {timeline.map((item, idx) => (
//             <div key={idx} className="flex gap-8 items-start">
//               <div className="flex-shrink-0 w-24 text-right">
//                 <span className="text-2xl font-light text-amber-700">{item.year}</span>
//               </div>
//               <div className="flex-shrink-0 w-4 h-4 bg-amber-700 rounded-full mt-2"></div>
//               <div className="flex-1 pb-8 border-b border-stone-200">
//                 <p className="text-lg text-stone-700">{item.event}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

      

//       {/* Stats Section */}
//       <div className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <p className="text-5xl font-light mb-2">15+</p>
//               <p className="text-stone-400">Master Artisans</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">200+</p>
//               <p className="text-stone-400">Happy Customers</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">250+</p>
//               <p className="text-stone-400">Unique Designs</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">1+</p>
//               <p className="text-stone-400">Years of Excellence</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20 text-center">
//         <h2 className="text-4xl font-light mb-6">Experience the Tradition</h2>
//         <p className="text-lg text-stone-600 mb-8">
//           Discover our curated collection of handwoven cotton sarees
//         </p>
//         <button 
//         onClick={() => {
    
//     window.location.href = '/collections'
//   }}
//         className="bg-stone-900 text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-stone-800 transition">
//           Explore Collections
//         </button>
//       </div>
//     </div>
//   );
// }












// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { Award, Users, Heart, Sparkles } from 'lucide-react';

// export default function AboutPage() {
//   const values = [
//     {
//       icon: <Award className="w-12 h-12" />,
//       title: "Quality Craftsmanship",
//       desc: "Each saree is handwoven by master artisans with decades of experience"
//     },
//     {
//       icon: <Users className="w-12 h-12" />,
//       title: "Artisan Support",
//       desc: "We work directly with weavers, ensuring fair wages and sustainable practices"
//     },
//     {
//       icon: <Heart className="w-12 h-12" />,
//       title: "Heritage Preservation",
//       desc: "Committed to preserving India's rich textile heritage for future generations"
//     },
//     {
//       icon: <Sparkles className="w-12 h-12" />,
//       title: "Authentic Materials",
//       desc: "Only pure cotton and genuine zari used in every piece"
//     }
//   ];

//   const timeline = [
//     { year: "2010", event: "Founded with a vision to preserve traditional cotton weaving" },
//     { year: "2013", event: "Expanded to work with 50+ master weavers across India" },
//     { year: "2016", event: "Launched our first flagship store in Chennai" },
//     { year: "2019", event: "Introduced online shopping experience" },
//     { year: "2023", event: "Serving 10,000+ happy customers nationwide" }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header Spacer */}
//       <div className="h-20"></div>

//       {/* Hero Section */}
//       <div className="relative h-96 bg-blue-900">
//         <Image
//           src="/images/sky.png"
//           alt="About Us"
//           fill
//           className="object-cover opacity-50"
//         />
//         <div className="absolute inset-0 flex items-center justify-center text-white">
//           <div className="text-center max-w-3xl px-4">
//             <h1 className="text-5xl md:text-6xl font-light mb-6">Our Story</h1>
//             <p className="text-xl opacity-90">Weaving traditions, creating legacies</p>
//           </div>
//         </div>
//       </div>

//       {/* Story Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-light mb-6">Celebrating Indian Cotton Heritage</h2>
//           <div className="w-24 h-1 bg-blue-700 mx-auto mb-8"></div>
//           <p className="text-lg text-slate-700 leading-relaxed mb-6">
//             Founded in 2020, Cotton Casa began with a simple yet profound mission: to preserve and celebrate 
//             Indias rich silk weaving traditions while providing sustainable livelihoods to our master artisans.
//           </p>
//           <p className="text-lg text-slate-700 leading-relaxed mb-6">
//             What started as a small initiative working with a handful of weavers has now grown into a 
//             thriving community of over 50 master craftsmen across Tamil Nadu, Varanasi, and Gujarat. 
//             Each saree we offer tells a story of dedication, skill, and centuries-old techniques passed 
//             down through generations.
//           </p>
//           <p className="text-lg text-slate-700 leading-relaxed">
//             We believe that every woman deserves to experience the timeless elegance of authentic cotton 
//             sarees, and every artisan deserves fair compensation for their extraordinary craftsmanship. 
//             This belief drives everything we do.
//           </p>
//         </div>
//       </div>

//       {/* Values Section */}
//       <div className="bg-white py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-4xl font-light text-center mb-16">Our Values</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((value, idx) => (
//               <div key={idx} className="text-center">
//                 <div className="text-blue-700 flex justify-center mb-4">
//                   {value.icon}
//                 </div>
//                 <h3 className="text-xl font-light mb-3">{value.title}</h3>
//                 <p className="text-slate-600">{value.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Timeline Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20">
//         <h2 className="text-4xl font-light text-center mb-16">Our Journey</h2>
//         <div className="space-y-8">
//           {timeline.map((item, idx) => (
//             <div key={idx} className="flex gap-8 items-start">
//               <div className="flex-shrink-0 w-24 text-right">
//                 <span className="text-2xl font-light text-blue-700">{item.year}</span>
//               </div>
//               <div className="flex-shrink-0 w-4 h-4 bg-blue-700 rounded-full mt-2"></div>
//               <div className="flex-1 pb-8 border-b border-slate-200">
//                 <p className="text-lg text-slate-700">{item.event}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-blue-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <p className="text-5xl font-light mb-2">15+</p>
//               <p className="text-slate-300">Master Artisans</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">200+</p>
//               <p className="text-slate-300">Happy Customers</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">250+</p>
//               <p className="text-slate-300">Unique Designs</p>
//             </div>
//             <div>
//               <p className="text-5xl font-light mb-2">1+</p>
//               <p className="text-slate-300">Years of Excellence</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="max-w-4xl mx-auto px-4 py-20 text-center">
//         <h2 className="text-4xl font-light mb-6">Experience the Tradition</h2>
//         <p className="text-lg text-slate-600 mb-8">
//           Discover our curated collection of handwoven cotton sarees
//         </p>
//         <button 
//           onClick={() => {
//             window.location.href = '/collections'
//           }}
//           className="bg-blue-900 text-white px-10 py-4 text-sm uppercase tracking-wider hover:bg-blue-800 transition"
//         >
//           Explore Collections
//         </button>
//       </div>
//     </div>
//   );
// }







'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="w-12 h-12" />,
      title: "Quality Craftsmanship",
      desc: "Each saree is handwoven by master artisans with decades of experience"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Artisan Support",
      desc: "We work directly with weavers, ensuring fair wages and sustainable practices"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Heritage Preservation",
      desc: "Committed to preserving India's rich textile heritage for future generations"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Authentic Materials",
      desc: "Only pure cotton and genuine zari used in every piece"
    }
  ];

  const timeline = [
    { year: "2010", event: "Founded with a vision to preserve traditional cotton weaving" },
    { year: "2013", event: "Expanded to work with 50+ master weavers across India" },
    { year: "2016", event: "Launched our first flagship store in Chennai" },
    { year: "2019", event: "Introduced online shopping experience" },
    { year: "2023", event: "Serving 10,000+ happy customers nationwide" }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-amber-900 to-yellow-800">
        <Image
          src="/images/abt.png"
          alt="About Us"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-3xl px-4">
            <h1 className="text-5xl md:text-6xl font-light mb-6">Our Story</h1>
            <p className="text-xl opacity-90">Weaving traditions, creating legacies</p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-6 text-amber-900">Celebrating Indian Cotton Heritage</h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto mb-8"></div>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Founded in 2020, Cotton Casa began with a simple yet profound mission: to preserve and celebrate 
            Indias rich silk weaving traditions while providing sustainable livelihoods to our master artisans.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            What started as a small initiative working with a handful of weavers has now grown into a 
            thriving community of over 50 master craftsmen across Tamil Nadu, Varanasi, and Gujarat. 
            Each saree we offer tells a story of dedication, skill, and centuries-old techniques passed 
            down through generations.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            We believe that every woman deserves to experience the timeless elegance of authentic cotton 
            sarees, and every artisan deserves fair compensation for their extraordinary craftsmanship. 
            This belief drives everything we do.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-light text-center mb-16 text-amber-900">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 hover:shadow-sm transition">
                <div className="text-amber-700 flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-light mb-3 text-amber-900">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-light text-center mb-16 text-amber-900">Our Journey</h2>
        <div className="space-y-8">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-2xl font-light text-amber-700">{item.year}</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-amber-700 rounded-full mt-2"></div>
              <div className="flex-1 pb-8 border-b border-amber-200">
                <p className="text-lg text-slate-700">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-amber-900 to-yellow-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-light mb-2">15+</p>
              <p className="text-amber-200">Master Artisans</p>
            </div>
            <div>
              <p className="text-5xl font-light mb-2">200+</p>
              <p className="text-amber-200">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-light mb-2">250+</p>
              <p className="text-amber-200">Unique Designs</p>
            </div>
            <div>
              <p className="text-5xl font-light mb-2">1+</p>
              <p className="text-amber-200">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-light mb-6 text-amber-900">Experience the Tradition</h2>
        <p className="text-lg text-slate-600 mb-8">
          Discover our curated collection of handwoven cotton sarees
        </p>
        <button 
          onClick={() => {
            window.location.href = '/collections'
          }}
          className="bg-gradient-to-r from-amber-900 to-yellow-800 text-white px-10 py-4 text-sm uppercase tracking-wider hover:shadow-lg transition rounded-lg"
        >
          Explore Collections
        </button>
      </div>
    </div>
  );
}