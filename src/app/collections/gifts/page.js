'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Gift, Star, X, ShoppingCart, Loader2, Menu, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function GiftCustomizationPage() {
  const router = useRouter();
  const { isAuthenticated, addToCart, refreshCounts } = useAuth();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [giftItems, setGiftItems] = useState([]);
  const [giftCategories, setGiftCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSarees, setSelectedSarees] = useState([]);
  const [selectedGifts, setSelectedGifts] = useState({});
  const [activeCategory, setActiveCategory] = useState('Sarees');
  const [warning, setWarning] = useState('');
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const catRes = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/categories');
      const categoriesData = catRes.ok ? await catRes.json() : [];
      
      const prodRes = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/products');
      const productsData = prodRes.ok ? await prodRes.json() : [];
      
      const giftCatRes = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories');
      const giftCategoriesData = giftCatRes.ok ? await giftCatRes.json() : [];
      
      const giftItemsRes = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/giftitems');
      const giftItemsData = giftItemsRes.ok ? await giftItemsRes.json() : [];
      
      setCategories(categoriesData);
      setProducts(productsData);
      setGiftCategories(giftCategoriesData);
      setGiftItems(giftItemsData);
      
      if (categoriesData.length > 0) {
        setActiveCategory('Sarees');
      } else if (giftCategoriesData.length > 0) {
        setActiveCategory(giftCategoriesData[0].name);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product, category) => {
    if (category === 'Sarees') {
      router.push(`/productdetail/${product.product_id}`);
    }
  };

  const addToHamper = (product, category) => {
    if (category === 'Sarees') {
      setSelectedSarees((prev) => (
        prev.find(item => item.product_id === product.product_id) 
          ? prev 
          : [...prev, product]
      ));
    } else {
      setSelectedGifts((prev) => ({
        ...prev,
        [category]: product
      }));
    }
  };

  const removeFromHamper = (productId, category) => {
    if (category === 'Sarees') {
      setSelectedSarees((prev) => prev.filter(item => item.product_id !== productId));
    } else {
      setSelectedGifts((prev) => {
        const updated = { ...prev };
        delete updated[category];
        return updated;
      });
    }
  };

  const handleOrder = async () => {
    if (selectedSarees.length === 0) {
      setWarning('Please select at least one saree to place your order.');
      setTimeout(() => setWarning(''), 3000);
      return;
    }
    
    if (!isAuthenticated()) {
      setWarning('Please login to place an order');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }
    
    setWarning('');
    setUpdating(true);
    
    try {
      let successCount = 0;
      let failCount = 0;
      const failedItems = [];
      
      for (const saree of selectedSarees) {
        const result = await addToCart(saree.product_id, 1);
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          failedItems.push(saree.name);
          console.error('Failed to add item:', result.error);
        }
      }
      
      if (successCount > 0) {
        refreshCounts();
        
        let message = `${successCount} item(s) added to cart successfully!`;
        if (failCount > 0) {
          message += `\n\nFailed to add ${failCount} item(s):\n${failedItems.join(', ')}`;
        }
        message += '\n\nRedirecting to cart...';
        
        alert(message);
        
        setSelectedSarees([]);
        setSelectedGifts({});
        setShowMobileCart(false);
        
        setTimeout(() => {
          router.push('/cart');
        }, 500);
      } else {
        throw new Error('Failed to add items to cart. Please try again.');
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setWarning(error.message || 'Failed to process order. Please try again.');
      setTimeout(() => setWarning(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentProducts = () => {
    if (activeCategory === 'Sarees') {
      return products;
    } else {
      const giftCategory = giftCategories.find(gc => gc.name === activeCategory);
      if (giftCategory) {
        return giftItems.filter(gi => gi.gift_category_id === giftCategory.gift_category_id);
      }
      return [];
    }
  };

  const currentProducts = getCurrentProducts();
  const getTotal = () => selectedSarees.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const totalItems = selectedSarees.length + Object.keys(selectedGifts).length;

  const isProductSelected = (product, category) => {
    if (category === 'Sarees') {
      return selectedSarees.find(item => item.product_id === product.product_id);
    } else {
      return selectedGifts[category]?.gift_item_id === product.gift_item_id;
    }
  };

  const getProductImage = (product, category) => {
    if (category === 'Sarees') {
      return product.images && product.images.length > 0
        ? `https://api-xmg2fjjbya-uc.a.run.app${product.images[0]}`
        : '/images/placeholder.jpg';
    } else {
      return product.image_url
        ? `https://api-xmg2fjjbya-uc.a.run.app${product.image_url}`
        : '/images/placeholder.jpg';
    }
  };

  const CartSummary = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'h-full flex flex-col' : 'h-full flex flex-col'}`}>
      <div className={`${isMobile ? 'bg-gradient-to-r' : 'bg-gradient-to-r'} from-amber-600 to-amber-700 text-white p-3 sm:p-4 md:p-5 lg:p-6 shadow-md`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-serif">Your Hamper</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white text-amber-600 rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-xs sm:text-sm">
              {totalItems}
            </div>
            {isMobile && (
              <button onClick={() => setShowMobileCart(false)} className="p-1 hover:bg-amber-800 rounded-full transition">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
        <p className="text-amber-100 text-xs sm:text-sm">Create your perfect gift combination</p>
      </div>

      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6`}>
        {selectedSarees.length === 0 && Object.keys(selectedGifts).length === 0 ? (
          <div className="text-center py-8 sm:py-10 lg:py-12">
            <Gift className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-amber-300 mx-auto mb-3 lg:mb-4" />
            <p className="text-slate-600 mb-1 lg:mb-2 font-medium text-sm sm:text-base">Your hamper is empty</p>
            <p className="text-slate-500 text-xs sm:text-sm">Start by selecting items</p>
          </div>
        ) : (
          <div>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 lg:mb-6">
              {selectedSarees.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-900 mb-2 sm:mb-3 uppercase tracking-wide">
                    Sarees ({selectedSarees.length})
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {selectedSarees.map((item) => (
                      <div key={item.product_id} className="bg-white rounded-lg p-2 sm:p-3 border border-amber-100 hover:shadow-md transition">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <img 
                            src={getProductImage(item, 'Sarees')} 
                            alt={item.name} 
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-90"
                            onClick={() => handleProductClick(item, 'Sarees')}
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 
                              className="font-semibold text-slate-900 text-xs sm:text-sm truncate cursor-pointer hover:text-amber-600"
                              onClick={() => handleProductClick(item, 'Sarees')}
                            >
                              {item.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-slate-500 truncate">{item.description}</p>
                            <p className="text-amber-700 font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">
                              ₹{parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromHamper(item.product_id, 'Sarees')}
                            className="p-1 sm:p-1.5 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition flex-shrink-0"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(selectedGifts).length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-900 mb-2 sm:mb-3 uppercase tracking-wide mt-4 sm:mt-5 lg:mt-6">
                    Complimentary Gifts ({Object.keys(selectedGifts).length})
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(selectedGifts).map(([category, item]) => (
                      <div key={item.gift_item_id} className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-2 sm:p-3 border border-emerald-100 hover:shadow-md transition">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <img 
                            src={getProductImage(item, category)} 
                            alt={item.name} 
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{item.name}</h4>
                            <p className="text-[10px] sm:text-xs text-slate-500 truncate">{item.description}</p>
                            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                              <span className="text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                                Free Gift
                              </span>
                              <span className="text-[10px] sm:text-xs text-slate-400">{category}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromHamper(item.gift_item_id, category)}
                            className="p-1 sm:p-1.5 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition flex-shrink-0"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {warning && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs sm:text-sm font-medium text-center">{warning}</p>
              </div>
            )}

            <div className="bg-white border-t border-amber-200 pt-3 sm:pt-4 mt-4 sm:mt-5 lg:mt-6 pb-4 sm:pb-5 lg:pb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-amber-100">
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Total Amount</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-700">
                    ₹{getTotal().toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-slate-500">Items</p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-700">{totalItems}</p>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-4 rounded-xl font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2 sm:gap-3 hover:from-amber-700 hover:to-amber-800 transition shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOrder}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Place Order
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
              
              <p className="text-[10px] sm:text-xs text-center text-slate-500 mt-2 sm:mt-3">
                * Gifts are complimentary with saree purchase
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-amber-600 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-amber-900">Loading Products...</h2>
          <p className="text-sm sm:text-base text-slate-600">Please wait while we prepare your options</p>
        </div>
      </div>
    );
  }

  const allCategories = ['Sarees', ...giftCategories.map(gc => gc.name)];

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Mobile Header with Cart Button */}
      <div className="lg:hidden sticky top-0 bg-white border-b border-amber-200 z-40 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
          <h1 className="text-sm sm:text-base md:text-lg font-serif font-bold text-amber-900">Gift Hamper</h1>
        </div>
        <button
          onClick={() => setShowMobileCart(true)}
          className="relative p-2 bg-amber-100 rounded-full hover:bg-amber-200 transition"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="flex max-w-[2000px] mx-auto">
        {/* Main Content Area */}
        <div className="flex-1 lg:mr-[380px] xl:mr-[420px]">
          {/* Desktop Header */}
          <section className="hidden lg:block px-4 lg:px-6 xl:px-8 py-4 lg:py-5 xl:py-6 bg-white border-b">
            <div className="flex items-center gap-3 lg:gap-4 mb-2">
              <Gift className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-amber-700" />
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-serif font-bold text-amber-900">Customize Your Gift Hamper</h1>
            </div>
            <p className="text-slate-600 text-sm lg:text-base">
              Select multiple sarees (mandatory) and one gift from each category (optional) to create your unique hamper.
            </p>
          </section>

          {/* Mobile Description */}
          <div className="lg:hidden px-3 sm:px-4 py-3 sm:py-4 bg-amber-50 border-b">
            <p className="text-xs sm:text-sm text-slate-600">
              Select sarees (mandatory) and gifts (optional) to create your hamper.
            </p>
          </div>

          {/* Category Tabs */}
          <section className="px-2 sm:px-3 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5 bg-white border-b sticky top-[45px] sm:top-[50px] lg:static z-30">
            <div className="flex gap-1.5 sm:gap-2 lg:gap-3 overflow-x-auto scrollbar-hide pb-1">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs lg:text-sm xl:text-base font-semibold border transition whitespace-nowrap flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Products Grid */}
          <section className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5 xl:py-6 mb-20 sm:mb-24 lg:mb-8">
            <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-serif font-bold text-amber-900 mb-3 sm:mb-4">
              {activeCategory} Items
            </h2>
            {currentProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-10 lg:py-12 bg-white rounded-xl border">
                <Gift className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto text-amber-300 mb-3" />
                <p className="text-xs sm:text-sm lg:text-base text-slate-600">No items available in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
                {currentProducts.map((product) => (
                  <div 
                    key={activeCategory === 'Sarees' ? product.product_id : product.gift_item_id} 
                    className="border rounded-lg lg:rounded-xl group hover:shadow-lg transition bg-white relative p-2 sm:p-2.5 lg:p-3"
                  >
                    <img 
                      src={getProductImage(product, activeCategory)} 
                      alt={product.name} 
                      className={`w-full h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 object-cover mb-2 rounded-md lg:rounded-lg ${
                        activeCategory === 'Sarees' ? 'cursor-pointer hover:opacity-90' : ''
                      }`}
                      onClick={() => handleProductClick(product, activeCategory)}
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                    <h3 
                      className={`font-semibold text-slate-900 mb-1 text-[11px] sm:text-xs lg:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.2rem] lg:min-h-[2.5rem] ${
                        activeCategory === 'Sarees' ? 'cursor-pointer hover:text-amber-600' : ''
                      }`}
                      onClick={() => handleProductClick(product, activeCategory)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] lg:text-xs text-slate-500 mb-1 line-clamp-1 lg:line-clamp-2">
                      {product.description || product.desc || 'No description'}
                    </p>
                    {activeCategory === 'Sarees' && product.price ? (
                      <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
                        <span className="text-xs sm:text-sm lg:text-sm font-bold text-amber-700">
                          ₹{parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-end gap-1 mb-1 sm:mb-1.5">
                        <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Free Gift
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-0.5 mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`} />
                      ))}
                      <span className="text-[9px] sm:text-[10px] lg:text-xs text-slate-600 ml-0.5">(4.5)</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToHamper(product, activeCategory);
                      }}
                      className={`w-full mt-1 sm:mt-1.5 lg:mt-2 px-2 sm:px-2.5 lg:px-3 py-1.5 sm:py-2 bg-amber-600 text-white text-[10px] sm:text-[11px] lg:text-xs font-semibold rounded-lg transition hover:bg-amber-700 active:scale-95 ${
                        isProductSelected(product, activeCategory) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isProductSelected(product, activeCategory)}
                    >
                      {isProductSelected(product, activeCategory) ? '✓ Added' : 'Add to Hamper'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Desktop Fixed Sidebar */}
        <aside className="hidden lg:block fixed right-0 top-20 w-[380px] xl:w-[420px] h-[calc(100vh-5rem)] bg-gradient-to-b from-amber-50 to-white border-l border-amber-200 shadow-2xl overflow-hidden">
          <CartSummary />
        </aside>
      </div>

      {/* Mobile Cart Modal */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-b from-amber-50 to-white overflow-y-auto animate-slide-in-right">
            <CartSummary isMobile />
          </div>
        </div>
      )}

      {/* Mobile Bottom Summary Bar */}
      {!showMobileCart && totalItems > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-2xl p-2.5 sm:p-3 z-40">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide">Total</p>
              <p className="text-base sm:text-lg font-bold text-amber-700 truncate">₹{getTotal().toFixed(2)}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500">{totalItems} items</p>
            </div>
            <button
              onClick={() => setShowMobileCart(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-100 text-amber-800 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 hover:bg-amber-200 transition active:scale-95 whitespace-nowrap"
            >
              View Cart
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleOrder}
              disabled={updating}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 hover:from-amber-700 hover:to-amber-800 transition active:scale-95 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Order
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}