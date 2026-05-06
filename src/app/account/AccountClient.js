'use client';

import React, { useState } from 'react';
import { User, Package, Heart, MapPin, CreditCard, Settings } from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'orders', name: 'Orders', icon: <Package className="w-5 h-5" /> },
    // { id: 'wishlist', name: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { id: 'addresses', name: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="h-20"></div>
      
      <div className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-light">My Account</h1>
          <p className="text-stone-300 mt-2">Manage your account and orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="w-10 h-10 text-stone-600" />
                </div>
                <h3 className="font-light text-lg">John Doe</h3>
                <p className="text-sm text-stone-600">john@example.com</p>
              </div>
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                      activeTab === tab.id
                        ? 'bg-amber-50 text-amber-700'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm uppercase tracking-wide mb-2 text-stone-600">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-amber-700" />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide mb-2 text-stone-600">Email</label>
                      <input type="email" defaultValue="john@example.com" className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-amber-700" />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide mb-2 text-stone-600">Phone</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-amber-700" />
                    </div>
                    <button className="bg-stone-900 text-white px-8 py-3 rounded hover:bg-stone-800 transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">Order History</h2>
                  <div className="text-center py-12 text-stone-600">
                    <Package className="w-16 h-16 mx-auto mb-4 text-stone-300" />
                    <p>No orders yet</p>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-light mb-6">My Wishlist</h2>
                  <div className="text-center py-12 text-stone-600">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-stone-300" />
                    <p>Your wishlist is empty</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
