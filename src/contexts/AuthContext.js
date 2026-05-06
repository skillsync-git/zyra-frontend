// contexts/AuthContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const API_URL = 'https://zyra-website.onrender.com/api';

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Fetch cart and wishlist counts
        fetchCartCount(token);
        fetchWishlistCount(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  // Fetch cart count
  const fetchCartCount = async (token) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch wishlist count
  const fetchWishlistCount = async (token) => {
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      
      // Fetch counts after login
      fetchCartCount(data.token);
      fetchWishlistCount(data.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login with mobile number
  const loginWithMobile = async (mobile, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login-mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);

      fetchCartCount(data.token);
      fetchWishlistCount(data.token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      
      // Initialize counts for new user
      setCartCount(0);
      setWishlistCount(0);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    window.location.href = '/';
  };

  // Get auth header for API calls
  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  // Add to cart
  const addToCart = async (product_id, quantity = 1) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ product_id, quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      // Update cart count
      const token = localStorage.getItem('authToken');
      fetchCartCount(token);

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add to wishlist
  const addToWishlist = async (product_id) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to add items to wishlist' };
    }

    try {
      const response = await fetch(`${API_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ product_id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      // Update wishlist count
      const token = localStorage.getItem('authToken');
      fetchWishlistCount(token);

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get cart items
  const getCart = async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to view cart' };
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get wishlist items
  const getWishlist = async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please login to view wishlist' };
    }

    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Refresh counts (useful after operations)
  const refreshCounts = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCartCount(token);
      fetchWishlistCount(token);
    }
  };

  const value = {
    user,
    loading,
    cartCount,
    wishlistCount,
    login,
    loginWithMobile,
    register,
    logout,
    getAuthHeader,
    isAuthenticated,
    addToCart,
    addToWishlist,
    getCart,
    getWishlist,
    refreshCounts
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
