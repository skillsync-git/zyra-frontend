// app/components/ProductActions.js
'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductActions({ productId, className = '' }) {
  const [adding, setAdding] = useState(false);
  const { isAuthenticated, addToCart, addToWishlist } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setAdding(true);
    const result = await addToCart(productId, 1);
    
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    setAdding(false);
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const result = await addToWishlist(productId);
    
    if (result.success) {
      alert('Added to wishlist!');
    } else {
      alert(result.error || 'Failed to add to wishlist');
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
      >
        <ShoppingCart className="w-4 h-4" />
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
      
      <button
        onClick={handleAddToWishlist}
        className="p-2 border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition group"
        title="Add to Wishlist"
      >
        <Heart className="w-5 h-5 text-slate-600 group-hover:text-red-600 group-hover:fill-red-600 transition" />
      </button>
    </div>
  );
}

// Example usage in a product card:
/*
import ProductActions from '@/app/components/ProductActions';

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      
      <ProductActions productId={product.product_id} />
    </div>
  );
}
*/