

// app/cart/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [movingToWishlist, setMovingToWishlist] = useState({});

  const { isAuthenticated, getAuthHeader, refreshCounts } = useAuth();
  const router = useRouter();

  const API_URL = 'https://zyra-website.onrender.com/api';

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Cart data received:', data);

        const cartWithImages = await Promise.all(
          data.map(async (item) => {
            try {
              const imgResponse = await fetch(
                `${API_URL}/products/${item.product_id}/images`
              );

              if (imgResponse.ok) {
                const images = await imgResponse.json();
                console.log(`🖼️ Images for product ${item.product_id}:`, images);

                return {
                  ...item,
                  images: images.map(
                    (img) => img.image_url
                  ),
                  image:
                    images.length > 0
                      ? images[0].image_url
                      : '/placeholder-saree.jpg'
                };
              }
            } catch (imgError) {
              console.error(
                `❌ Error fetching images for product ${item.product_id}:`,
                imgError
              );
            }

            return {
              ...item,
              images: [],
              image: '/placeholder-saree.jpg'
            };
          })
        );

        console.log('✅ Cart with images:', cartWithImages);
        setCartItems(cartWithImages);
        // Refresh counts after fetching cart
        refreshCounts();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (cartId) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Move cart item to wishlist (add to wishlist then delete from cart)
  const moveToWishlist = async (item) => {
    if (!confirm('Move this item to wishlist?')) return;

    setMovingToWishlist((prev) => ({ ...prev, [item.cart_id]: true }));

    try {
      // 1) Add to wishlist
      const wlRes = await fetch(`${API_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ product_id: item.product_id })
      });

      if (!wlRes.ok) {
        const err = await wlRes.json().catch(() => ({}));
        alert(err.message || 'Failed to add to wishlist');
        setMovingToWishlist((prev) => ({ ...prev, [item.cart_id]: false }));
        return;
      }

      // 2) Remove from cart
      const delRes = await fetch(`${API_URL}/cart/${item.cart_id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (delRes.ok) {
        await fetchCart();
        alert('Item moved to wishlist successfully!');
      } else {
        const err2 = await delRes.json().catch(() => ({}));
        alert(err2.message || 'Failed to remove from cart after adding to wishlist');
      }
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      alert('Failed to move item to wishlist');
    } finally {
      setMovingToWishlist((prev) => ({ ...prev, [item.cart_id]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">
            {cartItems.length}{' '}
            {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-6">
              Add some beautiful sarees to your cart!
            </p>
            <Link
              href="/collections/newarrivals"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cart_id}
                  className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-saree.jpg'}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', item.image);
                        e.target.src = '/placeholder-saree.jpg';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/productdetail/${item.product_id}`}
                      className="font-semibold text-slate-800 hover:text-amber-600 mb-1 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-amber-600 font-bold text-lg mb-3">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
<div className="flex items-center gap-4 mb-3">
  <div className="flex items-center gap-2 border border-slate-300 rounded-lg">
    <button
      onClick={() =>
        updateQuantity(item.cart_id, item.quantity - 1)
      }
      disabled={updating || item.quantity <= 1}
      className="p-2 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:text-slate-900"
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="px-4 font-semibold min-w-[3rem] text-center text-slate-800">
      {item.quantity}
    </span>
    <button
      onClick={() =>
        updateQuantity(item.cart_id, item.quantity + 1)
      }
      disabled={
        updating || item.quantity >= item.stock_quantity
      }
      className="p-2 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:text-slate-900"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>

  <button
    onClick={() => removeItem(item.cart_id)}
    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
    title="Remove from cart"
  >
    <Trash2 className="w-5 h-5" />
  </button>

  <button
    onClick={() => moveToWishlist(item)}
    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
    title="Move to wishlist"
    disabled={movingToWishlist[item.cart_id]}
  >
    <Heart className="w-4 h-4" />
    <span className="text-sm font-medium">
      {movingToWishlist[item.cart_id]
        ? 'Moving...'
        : 'Move to Wishlist'}
    </span>
  </button>
</div>

                    {item.stock_quantity < 5 && (
                      <p className="text-orange-600 text-sm mt-2 font-medium">
                        ⚠️ Only {item.stock_quantity} left in stock
                      </p>
                    )}
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-slate-800">
                      ₹
                      {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-800">
                    <span>Total</span>
                    <span className="text-amber-600">
                      ₹{calculateTotal()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout/address"
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition mb-3 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>

                <Link
                  href="/collections/newarrivals"
                  className="block text-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Free shipping on all orders</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>7-day easy returns</span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
