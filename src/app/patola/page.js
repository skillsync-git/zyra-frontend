'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, SlidersHorizontal, X, Award, Sparkles, ShoppingBag } from 'lucide-react';

export default function PatolaPage() {
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryData = {
    title: "Patola Silk Sarees",
    subtitle: "Double Ikat Masterpieces",
    description: "Handcrafted using the complex double ikat technique from Gujarat, each Patola saree is a work of art.",
    backgroundColor: "from-green-900 to-teal-900",
    heroImage: "/images/patola.jpg",
    designs: "65+",
    features: ["Double Ikat Weaving", "Geometric Patterns", "Reversible Design", "Vibrant Colors"]
  };

  const colors = [
    { id: 'all', name: 'All Colors' },
    { id: 'red', name: 'Red & Maroon' },
    { id: 'blue', name: 'Blue & Navy' },
    { id: 'pink', name: 'Pink & Magenta' },
    { id: 'green', name: 'Green' },
    { id: 'gold', name: 'Gold' },
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'under25k', name: 'Under ₹25,000', min: 0, max: 25000 },
    { id: '25to30k', name: '₹25,000 - ₹30,000', min: 25000, max: 30000 },
    { id: 'above30k', name: 'Above ₹30,000', min: 30000, max: Infinity },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/sarees?category=patola');
        const data = await response.json();
        
        const arr = Array.isArray(data) ? data : data.data || [];
        const formatted = arr.map(item => ({
          ...item,
          images: item.images ? (Array.isArray(item.images) ? item.images : item.images.split(',')) : [],
        }));
        setProducts(formatted);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const colorMatch = selectedColor === 'all' || (product.color && product.color.toLowerCase().includes(selectedColor.toLowerCase()));
    const priceRange = priceRanges.find(p => p.id === selectedPrice);
    const productPrice = parseFloat(product.discounted_price) || 0;
    const priceMatch = selectedPrice === 'all' || (productPrice >= priceRange.min && productPrice < priceRange.max);
    return colorMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (parseFloat(a.discounted_price) || 0) - (parseFloat(b.discounted_price) || 0);
    if (sortBy === 'price-high') return (parseFloat(b.discounted_price) || 0) - (parseFloat(a.discounted_price) || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

   const handleBuyNow = (product) => {
  // Save product details as JSON in session storage
  if (typeof window !== "undefined") {
    sessionStorage.setItem('checkoutProduct', JSON.stringify(product));
    window.location.href = "/checkout";
  }
  };
  
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="h-24"></div>

      <div className={`relative h-80 sm:h-96 bg-gradient-to-r ${categoryData.backgroundColor} overflow-hidden`}>
        <div className="absolute inset-0">
          <img src={categoryData.heroImage} alt={categoryData.title} className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-amber-300" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4">{categoryData.title}</h1>
            <p className="text-lg sm:text-xl mb-2 opacity-90">{categoryData.subtitle}</p>
            <p className="text-sm sm:text-base opacity-80 max-w-2xl mx-auto">{categoryData.description}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-6 sm:py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
             {categoryData.features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-amber-600" />
                <p className="text-xs sm:text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-light mb-4 pb-4 border-b flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />Filters
              </h3>
              
              <div className="mb-6">
                <h4 className="text-sm uppercase tracking-wide mb-3 text-stone-600">Color</h4>
                <div className="space-y-2">
                  {colors.map(color => (
                    <label key={color.id} className="flex items-center cursor-pointer">
                      <input type="radio" name="color" checked={selectedColor === color.id} onChange={() => setSelectedColor(color.id)} className="mr-2 accent-amber-700" />
                      <span className="text-sm">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm uppercase tracking-wide mb-3 text-stone-600">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.id} className="flex items-center cursor-pointer">
                      <input type="radio" name="price" checked={selectedPrice === range.id} onChange={() => setSelectedPrice(range.id)} className="mr-2 accent-amber-700" />
                      <span className="text-sm">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-xs text-amber-900 mb-2 font-medium">✨ {products.length} Designs</p>
                  <p className="text-xs text-amber-800">Handwoven by master artisans</p>
                </div>
              </div>
            </div>
          </aside>

          <button onClick={() => setShowFilters(true)} className="lg:hidden fixed bottom-6 right-6 bg-stone-900 text-white p-4 rounded-full shadow-lg z-40">
            <SlidersHorizontal className="w-6 h-6" />
          </button>

          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-light">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-stone-600">Color</h4>
                  <div className="space-y-2">
                    {colors.map(color => (
                      <label key={color.id} className="flex items-center cursor-pointer">
                        <input type="radio" name="color-mobile" checked={selectedColor === color.id} onChange={() => setSelectedColor(color.id)} className="mr-2 accent-amber-700" />
                        <span className="text-sm">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm uppercase tracking-wide mb-3 text-stone-600">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range.id} className="flex items-center cursor-pointer">
                        <input type="radio" name="price-mobile" checked={selectedPrice === range.id} onChange={() => setSelectedPrice(range.id)} className="mr-2 accent-amber-700" />
                        <span className="text-sm">{range.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-light mb-1">Patola</p>
                <p className="text-sm text-stone-600">{sortedProducts.length} Beautiful Sarees</p>
              </div>
              <select onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-auto border border-stone-300 px-4 py-2 rounded text-sm">
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map(product => (
                  <div key={product.id} className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                    <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
                      <img src={product.images && product.images[0] ? `https://api-xmg2fjjbya-uc.a.run.app${product.images[0]}` : '/placeholder.jpg'} alt={product.saree_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       {/* Desktop Hover Card - Only shows on hover */}
                    <div className="hidden md:block absolute inset-x-0 bottom-4 mx-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3">
                        {/* Buy Button */}
                        <Link href= "/checkout">
                        <button 
                          className="flex items-center gap-2 text-stone-900 font-medium hover:text-amber-700 transition text-sm"
                        >
                          Buy Now
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                        </Link>
                        {/* Divider */}
                        <div className="h-6 w-px bg-stone-200"></div>
                        
                        {/* Quick View Icon */}
                        <Link href={`/product/${product.id}`}>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-stone-100 rounded transition hover:text-amber-700"
                            title="Quick View"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        </Link>
                        
                        {/* Divider */}
                        <div className="h-6 w-px bg-stone-200"></div>
                        
                        {/* Wishlist Heart Icon */}
                        {/* <button 
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`${product.name} added to wishlist!`);
                          }}
                          className="p-2 hover:bg-stone-100 rounded transition hover:text-amber-700"
                          title="Add to Wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>
                      <div className="md:hidden absolute top-2 right-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-stone-100 transition">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-light text-base sm:text-lg mb-2 truncate">{product.saree_name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg sm:text-xl font-light">₹{parseFloat(product.discounted_price || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                        <div className="flex items-center text-xs sm:text-sm text-amber-600">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current mr-1" />
                          4.8
                        </div>
                      </div>
                      <button onClick={() => handleBuyNow(product)}>
                        Buy Now
                          </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-stone-600">No products found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
