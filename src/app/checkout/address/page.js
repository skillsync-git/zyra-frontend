// app/checkout/address/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, MapPin, Check } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutAddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    house_number: '',
    address: '',
    locality: '',
    landmark: '',
    city: '',
    state: '',
    address_type: 'home',
    is_default: false
  });

  const { isAuthenticated, getAuthHeader } = useAuth();
  const router = useRouter();
  const API_URL = 'https://zyra-website.onrender.com/api';

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchAddresses();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        
        // Auto-select default address
        const defaultAddr = data.find(addr => addr.is_default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.address_id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAddress 
        ? `${API_URL}/addresses/${editingAddress.address_id}`
        : `${API_URL}/addresses`;
      
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAddresses();
        setShowAddForm(false);
        setEditingAddress(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const deleteAddress = async (addressId) => {
    if (!confirm('Delete this address?')) return;

    try {
      const response = await fetch(`${API_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        fetchAddresses();
        if (selectedAddress === addressId) {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || '',
      mobile: address.mobile || '',
      pincode: address.pincode || '',
      house_number: address.house_number || '',
      address: address.address || '',
      locality: address.locality || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      address_type: address.address_type || 'home',
      is_default: address.is_default || false
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      pincode: '',
      house_number: '',
      address: '',
      locality: '',
      landmark: '',
      city: '',
      state: '',
      address_type: 'home',
      is_default: false
    });
  };

const proceedToPayment = () => {
  if (!selectedAddress) {
    alert('Please select a delivery address');
    return;
  }
  
  // Find the complete address object
  const selectedAddressData = addresses.find(
    addr => addr.address_id === selectedAddress
  );
  
  sessionStorage.setItem('selectedAddressId', selectedAddress);
  sessionStorage.setItem('selectedAddress', JSON.stringify(selectedAddressData)); // ✅ ADD THIS
  
  router.push('/checkout/payment');
};

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-green-600">CART</span>
            </div>
            <div className="w-20 h-0.5 bg-amber-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-medium text-amber-600">ADDRESS</span>
            </div>
            <div className="w-20 h-0.5 bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-medium text-slate-400">PAYMENT</span>
            </div>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 text-black">
          {/* Address Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Select Delivery Address
                </h2>
<button
  onClick={() => {
    setShowAddForm(!showAddForm);
    setEditingAddress(null);
    resetForm();
  }}
  className="flex items-center gap-2 px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition font-semibold"
>
  <Plus className="w-4 h-4" />
  Add New Address
</button>
              </div>

              {/* Add/Edit Address Form */}
              {showAddForm && (
                <div className="mb-6 p-6 border-2 border-amber-200 rounded-lg bg-amber-50 text-black">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name*"
                        required
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Mobile No*"
                        required
                        pattern="[0-9]{10}"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pin Code*"
                        required
                        pattern="[0-9]{6}"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        name="house_number"
                        value={formData.house_number}
                        onChange={handleInputChange}
                        placeholder="House No/Building*"
                        required
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Road name, Area, Colony*"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        placeholder="Locality*"
                        required
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Landmark (Optional)"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City/District*"
                        required
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State*"
                        required
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="address_type"
                            value="home"
                            checked={formData.address_type === 'home'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-amber-600"
                          />
                          <span>Home</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="address_type"
                            value="work"
                            checked={formData.address_type === 'work'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-amber-600"
                          />
                          <span>Work</span>
                        </label>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span className="text-sm">Make this my default address</span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
                      >
                        {editingAddress ? 'Update Address' : 'Add Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingAddress(null);
                          resetForm();
                        }}
                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saved Addresses */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MapPin className="w-16 h-16 mx-auto mb-3 text-slate-300" />
                    <p>No saved addresses. Add a new address to continue.</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddress === address.address_id
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-slate-200 hover:border-amber-300'
                      }`}
                      onClick={() => setSelectedAddress(address.address_id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="radio"
                            checked={selectedAddress === address.address_id}
                            onChange={() => setSelectedAddress(address.address_id)}
                            className="mt-1 w-4 h-4 text-amber-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-800">
                                {address.name}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded uppercase font-medium">
                                {address.address_type}
                              </span>
                              {address.is_default && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mb-1">{address.mobile}</p>
                            <p className="text-slate-600 text-sm">
                              {address.house_number}, {address.address}, {address.locality}
                              {address.landmark && `, ${address.landmark}`}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editAddress(address);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(address.address_id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Price Details ({cartItems.length} items)
              </h3>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount on MRP</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800 mb-6">
                <span>Total Amount</span>
                <span className="text-amber-600">₹{calculateTotal()}</span>
              </div>
<button
  onClick={proceedToPayment}
  disabled={!selectedAddress}
  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
>
  Continue to Payment
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
