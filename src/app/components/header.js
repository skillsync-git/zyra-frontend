// app/components/header.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, Heart, ShoppingCart, Search, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cottonDropOpen, setCottonDropOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { user, logout, isAuthenticated, cartCount, wishlistCount } = useAuth();
  const router = useRouter();
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropOpen(false);
      }
    };

    if (profileDropOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropOpen]);

  // Fetch categories from database
  useEffect(() => {
    fetch("https://zyra-website.onrender.com/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Convert category name to URL-friendly slug
  const toSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropOpen(false);
    router.push('/');
  };

  const handleProfileClick = (path) => {
    setProfileDropOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl px-3 sm:px-4 md:px-6 mx-auto">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          
         {/* Logo */}
<div className="flex items-center gap-3 sm:gap-4 md:gap-6">
  <Link href="/" className="flex items-center">
    <Image
      src="/images/zyralogo.png"
      alt="ZYRA Logo"
      width={120}
      height={40}
      className="h-8 sm:h-10 md:h-12 w-auto"
      priority
    />
        <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-amber-700 font-serif whitespace-nowrap pl-3">
      ZYRA
    </span>
  </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-4 xl:gap-6 text-slate-700 font-medium relative">
              <div className="group relative">
                <button 
                  className="flex items-center gap-1 focus:outline-none hover:text-amber-600 transition"
                  tabIndex={0}
                >
                  Categories <ChevronDown className="w-4 h-4" />
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 top-full mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 invisible group-hover:visible group-focus-within:visible transition-opacity">
                  {categories.map((cat) => (
                    <Link
                      key={cat.category_id}
                      href={`/collections/${toSlug(cat.category_name)}`}
                      className="block px-5 py-3 hover:bg-amber-50 transition text-slate-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {cat.category_name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/collections/gifts" className="hover:text-amber-600 transition">Gifts</Link>
              <Link href="/collections/newarrivals" className="hover:text-amber-600 transition">New</Link>
              <Link href="/collections/sale" className="hover:text-amber-600 transition">Sale</Link>
              <Link href="/collections/luxe" className="hover:text-amber-600 transition">Luxe</Link>
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 px-4 lg:px-6 max-w-md lg:max-w-lg mx-auto">
            <div className="flex items-center bg-slate-100 rounded-full px-3 lg:px-4 py-2 w-full">
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search sarees..."
                className="bg-transparent outline-none flex-1 text-sm lg:text-base text-slate-700 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-amber-50 transition"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            </button>

            {/* Auth Buttons or Profile Dropdown */}
            {isAuthenticated() ? (
              <>
                {/* Desktop Profile Dropdown */}
                <div className="hidden sm:block relative" ref={profileDropdownRef}>
                  <button 
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-amber-50 transition"
                    onClick={() => setProfileDropOpen(!profileDropOpen)}
                  >
                    <User className="w-5 h-5 text-amber-700" />
                    <span className="hidden lg:block text-sm font-medium text-slate-700">
                      {user?.full_name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="hidden lg:block w-4 h-4 text-slate-600" />
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {profileDropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user?.full_name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => handleProfileClick('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition text-slate-700 text-left"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                      </button>
                      <button
                        onClick={() => handleProfileClick('/orders')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition text-slate-700 text-left"
                      >
                        <Package className="w-4 h-4" />
                        <span className="text-sm">My Orders</span>
                      </button>
                      <button
                        onClick={() => handleProfileClick('/settings')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition text-slate-700 text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-red-600 border-t border-slate-100 mt-1 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Wishlist with Count */}
                <Link href="/wishlist" className="hidden sm:flex p-2 rounded-full hover:bg-amber-50 transition relative">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <Link 
                  href="/login" 
                  className="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart with Count */}
            <Link href="/cart" className="p-2 rounded-full hover:bg-amber-50 transition relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-amber-600 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 rounded-full hover:bg-amber-50 transition" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-3 border-t border-slate-200 pt-3">
            <div className="flex items-center bg-slate-100 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for sarees..."
                className="bg-transparent outline-none flex-1 text-sm text-slate-700"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="lg:hidden bg-white border-t border-slate-200 py-2">
            {/* Categories Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-3 flex items-center justify-between font-medium text-slate-700 hover:bg-amber-50 transition rounded-lg"
                onClick={() => setCottonDropOpen(!cottonDropOpen)}
              >
                <span className="text-sm sm:text-base">Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${cottonDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {cottonDropOpen && (
                <div className="bg-amber-50/50 py-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.category_id}
                      href={`/collections/${toSlug(cat.category_name)}`}
                      className="block px-6 sm:px-8 py-2 text-sm sm:text-base text-slate-700 hover:bg-amber-100 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat.category_name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Other Menu Items */}
            <Link 
              href="/collections/gifts" 
              className="block px-4 py-3 text-sm sm:text-base text-slate-700 hover:bg-amber-50 transition rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Gifts
            </Link>
            <Link 
              href="/collections/newarrivals" 
              className="block px-4 py-3 text-sm sm:text-base text-slate-700 hover:bg-amber-50 transition rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              New
            </Link>
            <Link 
              href="/collections/sale" 
              className="block px-4 py-3 text-sm sm:text-base text-slate-700 hover:bg-amber-50 transition rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Sale
            </Link>
            <Link 
              href="/collections/luxe" 
              className="block px-4 py-3 text-sm sm:text-base text-slate-700 hover:bg-amber-50 transition rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Luxe
            </Link>

            {/* Mobile Auth/Profile Section */}
            <div className="border-t border-slate-200 mt-2 pt-2">
              {isAuthenticated() ? (
                <>
                  <div className="px-4 py-3 bg-amber-50/50 rounded-lg mx-2 mb-2">
                    <p className="text-sm font-semibold text-slate-800">{user?.full_name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-amber-50 transition rounded-lg flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-amber-50 transition rounded-lg flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-amber-50 transition rounded-lg flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-amber-50 transition rounded-lg text-center font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="block mx-4 my-2 py-3 text-sm bg-amber-600 text-white hover:bg-amber-700 transition rounded-lg text-center font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
