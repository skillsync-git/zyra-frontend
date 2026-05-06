// app/wishlist/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingToCart, setMovingToCart] = useState({});

  const { isAuthenticated, getAuthHeader, refreshCounts } = useAuth();
  const router = useRouter();

  const API_URL = 'https://zyra-website.onrender.com/api';

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('❤️ Wishlist data received:', data);

        const wishlistWithImages = await Promise.all(
          data.map(async (item) => {
            try {
              const imgResponse = await fetch(
                `${API_URL}/products/${item.product_id}/images`
              );

              if (imgResponse.ok) {
                const images = await imgResponse.json();
                console.log(
                  `🖼️ Images for product ${item.product_id}:`,
                  images
                );

                return {
                  ...item,
                  images: images.map(
                    (img) => `https://zyra-website.onrender.com${img.image_url}`
                  ),
                  image:
                    images.length > 0
                      ? `https://zyra-website.onrender.com${images[0].image_url}`
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

        console.log('✅ Wishlist with images:', wishlistWithImages);
        setWishlistItems(wishlistWithImages);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (wishlistId) => {
    if (!confirm('Remove this item from wishlist?')) return;

    try {
      const response = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        fetchWishlist();
        refreshCounts();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const moveToCart = async (item) => {
    setMovingToCart((prev) => ({ ...prev, [item.wishlist_id]: true }));

    try {
      const cartResponse = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: 1
        })
      });

      if (cartResponse.ok) {
        const removeResponse = await fetch(
          `${API_URL}/wishlist/${item.wishlist_id}`,
          {
            method: 'DELETE',
            headers: getAuthHeader()
          }
        );

        if (removeResponse.ok) {
          fetchWishlist();
          refreshCounts();
          alert('Item moved to cart successfully!');
        }
      } else {
        const errorData = await cartResponse.json();
        alert(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move item to cart');
    } finally {
      setMovingToCart((prev) => ({ ...prev, [item.wishlist_id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading wishlist...</p>
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
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-amber-600 fill-amber-600" />
            <h1 className="text-3xl font-bold text-slate-800">My Wishlist</h1>
          </div>
          <p className="text-slate-600">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 mb-6">
              Save your favorite sarees for later!
            </p>
            <Link
              href="/collections/newarrivals"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={`wishlist-${item.wishlist_id ?? item.product_id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition"
              >
                {/* Product Image */}
                <Link
                  href={`/productdetail/${item.product_id}`}
                  className="block relative"
                >
                  <div className="relative aspect-square bg-slate-100">
                    <img
                      src={item.image || '/placeholder-saree.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', item.image);
                        e.target.src = '/placeholder-saree.jpg';
                      }}
                    />

                    {/* Stock Badge */}
                    {item.stock_quantity === 0 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}

                    {item.stock_quantity > 0 &&
                      item.stock_quantity < 5 && (
                        <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Only {item.stock_quantity} left
                        </div>
                      )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <Link
                    href={`/productdetail/${item.product_id}`}
                    className="font-semibold text-slate-800 hover:text-amber-600 mb-2 block line-clamp-2 min-h-[3rem]"
                  >
                    {item.name}
                  </Link>

                  <p className="text-amber-600 font-bold text-xl mb-4">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={
                        item.stock_quantity === 0 ||
                        movingToCart[item.wishlist_id]
                      }
                      className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {movingToCart[item.wishlist_id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Moving...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          {item.stock_quantity === 0
                            ? 'Out of Stock'
                            : 'Add to Cart'}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => removeItem(item.wishlist_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-slate-400 mt-3">
                    Added{' '}
                    {new Date(item.added_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Love everything in your wishlist?
                </h3>
                <p className="text-slate-600 text-sm">
                  Move all items to cart and checkout quickly
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/cart"
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/collections/newarrivals"
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
