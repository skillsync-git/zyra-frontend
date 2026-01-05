// app/checkout/payment/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Wallet, 
  Building,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // UPI form
  const [upiId, setUpiId] = useState('');
  
  // Card form
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  const { isAuthenticated, getAuthHeader, refreshCounts } = useAuth();
  const router = useRouter();
  const API_URL = 'https://api-xmg2fjjbya-uc.a.run.app/api';

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Kotak Mahindra Bank',
    'Yes Bank'
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const addressId = sessionStorage.getItem('selectedAddressId');
    if (!addressId) {
      router.push('/checkout/address');
      return;
    }

    fetchCart();
    fetchAddress(addressId);
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

  const fetchAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const addresses = await response.json();
        const address = addresses.find(a => a.address_id === parseInt(addressId));
        setDeliveryAddress(address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }
    
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    // Validate payment method specific fields
    if (selectedPayment === 'card') {
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        alert('Please fill all card details');
        return;
      }
    } else if (selectedPayment === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }
    } else if (selectedPayment === 'netbanking') {
      if (!selectedBank) {
        alert('Please select a bank');
        return;
      }
    }

    setPlacing(true);

    try {
      // Create complete order data with shipping address details
      const orderData = {
        address_id: deliveryAddress.address_id,
        payment_method: selectedPayment,
        total_amount: calculateTotal(),
        // Include full shipping address
        shipping_address: {
          name: deliveryAddress.name,
          mobile: deliveryAddress.mobile,
          house_number: deliveryAddress.house_number,
          address: deliveryAddress.address,
          locality: deliveryAddress.locality,
          landmark: deliveryAddress.landmark || '',
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode,
          address_type: deliveryAddress.address_type
        },
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(orderData)
      });

      // Handle response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create error object
        result = { 
          error: 'Server response error', 
          message: 'Invalid response from server' 
        };
      }

      if (response.ok && result && result.order_id) {
        // Clear cart
        try {
          await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: getAuthHeader()
          });
        } catch (cartError) {
          // Cart clear failed but order was placed, continue
          console.warn('Cart clear failed:', cartError);
        }

        // Refresh counts to update cart badge
        try {
          await refreshCounts();
        } catch (countError) {
          console.warn('Count refresh failed:', countError);
        }

        // Clear session
        sessionStorage.removeItem('selectedAddressId');

        // Redirect to success page
        router.push(`/checkout/success?orderId=${result.order_id}`);
      } else {
        // Handle error response
        const errorMessage = result?.message || result?.error || 'Failed to place order. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      // Network or other errors
      alert('Network error. Please check your connection and try again.');
    } finally {
      setPlacing(false);
    }
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
              <span className="text-sm font-medium text-green-600">BAG</span>
            </div>
            <div className="w-20 h-0.5 bg-green-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-green-600">ADDRESS</span>
            </div>
            <div className="w-20 h-0.5 bg-amber-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-medium text-amber-600">PAYMENT</span>
            </div>
          </div>

          <Link
            href="/checkout/address"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Address
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Summary */}
            {deliveryAddress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">Deliver to:</h3>
                  <Link
                    href="/checkout/address"
                    className="text-amber-600 text-sm hover:text-amber-700"
                  >
                    Change
                  </Link>
                </div>
                <div className="text-slate-600 text-sm">
                  <p className="font-medium text-slate-800">{deliveryAddress.name}</p>
                  <p>{deliveryAddress.house_number}, {deliveryAddress.address}</p>
                  <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
                  <p className="mt-1">Mobile: {deliveryAddress.mobile}</p>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Options</h2>

              <div className="space-y-4">
                {/* UPI */}
                <div className="border-2 rounded-lg overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer flex items-center gap-3 ${
                      selectedPayment === 'upi' ? 'bg-amber-50 border-b-2 border-amber-600' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedPayment('upi')}
                  >
                    <input
                      type="radio"
                      checked={selectedPayment === 'upi'}
                      onChange={() => setSelectedPayment('upi')}
                      className="w-5 h-5 text-amber-600"
                    />
                    <Wallet className="w-6 h-6 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">UPI</p>
                      <p className="text-sm text-slate-600">Pay via GooglePay, PhonePe, Paytm & more</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition ${selectedPayment === 'upi' ? 'rotate-90' : ''}`} />
                  </div>
                  {selectedPayment === 'upi' && (
  <div className="p-4 bg-slate-50">
    <input
      type="text"
      value={upiId}
      onChange={(e) => setUpiId(e.target.value)}
      placeholder="Enter UPI ID (e.g., name@upi)"
      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
    />
    <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
      <Shield className="w-4 h-4 text-green-600" />
      <span>100% secure and encrypted</span>
    </div>
  </div>
)}
                </div>

                {/* Credit/Debit Card */}
                <div className="border-2 rounded-lg overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer flex items-center gap-3 ${
                      selectedPayment === 'card' ? 'bg-amber-50 border-b-2 border-amber-600' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedPayment('card')}
                  >
                    <input
                      type="radio"
                      checked={selectedPayment === 'card'}
                      onChange={() => setSelectedPayment('card')}
                      className="w-5 h-5 text-amber-600"
                    />
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Credit / Debit Card</p>
                      <p className="text-sm text-slate-600">Visa, Mastercard, Rupay & more</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition ${selectedPayment === 'card' ? 'rotate-90' : ''}`} />
                  </div>
                  {selectedPayment === 'card' && (
  <div className="p-4 bg-slate-50 space-y-4">
    <input
      type="text"
      name="number"
      value={cardData.number}
      onChange={handleCardInputChange}
      placeholder="Card Number"
      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
    />
    <input
      type="text"
      name="name"
      value={cardData.name}
      onChange={handleCardInputChange}
      placeholder="Name on Card"
      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
    />
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        name="expiry"
        value={cardData.expiry}
        onChange={handleCardInputChange}
        placeholder="MM/YY"
        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
      />
      <input
        type="text"
        name="cvv"
        value={cardData.cvv}
        onChange={handleCardInputChange}
        placeholder="CVV"
        className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
      />
    </div>
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Shield className="w-4 h-4 text-green-600" />
      <span>Your card information is secure</span>
    </div>
  </div>
)}
                </div>

                {/* Net Banking */}
                <div className="border-2 rounded-lg overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer flex items-center gap-3 ${
                      selectedPayment === 'netbanking' ? 'bg-amber-50 border-b-2 border-amber-600' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedPayment('netbanking')}
                  >
                    <input
                      type="radio"
                      checked={selectedPayment === 'netbanking'}
                      onChange={() => setSelectedPayment('netbanking')}
                      className="w-5 h-5 text-amber-600"
                    />
                    <Building className="w-6 h-6 text-indigo-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Net Banking</p>
                      <p className="text-sm text-slate-600">All major banks supported</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition ${selectedPayment === 'netbanking' ? 'rotate-90' : ''}`} />
                  </div>
                  {selectedPayment === 'netbanking' && (
  <div className="p-4 bg-slate-50">
    <select
      value={selectedBank}
      onChange={(e) => setSelectedBank(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
    >
      <option value="">Select Your Bank</option>
      {banks.map(bank => (
        <option key={bank} value={bank}>{bank}</option>
      ))}
    </select>
  </div>
)}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Price Details
              </h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP ({cartItems.length} items)</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹0</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-slate-800 mb-6">
                <span>Total Amount</span>
                <span className="text-amber-600">₹{calculateTotal()}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>Place Order</>
                )}
              </button>

              {/* Security & Delivery Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}