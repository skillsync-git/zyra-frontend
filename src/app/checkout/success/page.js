// app/checkout/success/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Calendar,
  Download,
  Home,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated, getAuthHeader, refreshCounts } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const API_URL = 'https://api-xmg2fjjbya-uc.a.run.app/api';

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!orderId) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
    refreshCounts(); // Refresh cart count
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 days from now
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const downloadInvoice = () => {
    // Mock invoice download - in production, this would generate a PDF
    alert('Invoice download functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="inline-block px-4 py-2 bg-amber-100 rounded-lg">
            <p className="text-sm text-slate-600">Order ID: <span className="font-bold text-amber-700">#{order.order_id}</span></p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Order Details</h2>
              <p className="text-sm text-slate-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={downloadInvoice}
              className="flex items-center gap-2 px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          </div>

          {/* Delivery Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Delivery Address</h3>
                <p className="text-sm text-slate-600">
                  {order.delivery_address.name}<br />
                  {order.delivery_address.house_number}, {order.delivery_address.address}<br />
                  {order.delivery_address.locality}, {order.delivery_address.city}<br />
                  {order.delivery_address.state} - {order.delivery_address.pincode}<br />
                  Mobile: {order.delivery_address.mobile}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Expected Delivery</h3>
                <p className="text-sm text-slate-600 mb-2">
                  {getEstimatedDelivery()}
                </p>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Standard Delivery (FREE)
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
            <Package className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Payment Method</h3>
              <p className="text-sm text-slate-600 capitalize">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 
                 order.payment_method === 'upi' ? 'UPI Payment' :
                 order.payment_method === 'card' ? 'Credit/Debit Card' :
                 order.payment_method === 'netbanking' ? 'Net Banking' : 
                 order.payment_method}
              </p>
              {order.payment_method === 'cod' && (
                <p className="text-xs text-amber-600 mt-1">
                  ₹{parseFloat(order.total_amount).toFixed(2)} to be collected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Order Items</h2>
          <div className="space-y-4">
     

{order.items.map((item, index) => (
  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
    <img
      src={item.image ? `https://api-xmg2fjjbya-uc.a.run.app${item.image}` : '/placeholder-saree.jpg'}
      alt={item.product_name}
      className="w-20 h-20 object-cover rounded-lg border"
      onError={(e) => {
        console.log('Image failed to load:', item.image);
        e.target.onerror = null;
        e.target.src = '/placeholder-saree.jpg';
      }}
    />
    <div className="flex-1">
      <h3 className="font-semibold text-slate-800 mb-1">
        {item.product_name}
      </h3>
      <p className="text-sm text-slate-600 mb-2">
        Quantity: {item.quantity}
      </p>
      <p className="text-amber-600 font-bold">
        ₹{parseFloat(item.price).toFixed(2)}
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm text-slate-600 mb-1">Subtotal</p>
      <p className="font-bold text-slate-800">
        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
))}
          </div>

          {/* Price Summary */}
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span className="text-green-600">- ₹0</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-800 pt-4 border-t">
              <span>Total Amount</span>
              <span className="text-amber-600">₹{parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Tracking Info */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Track Your Order</h3>
          <p className="text-sm text-slate-600 mb-4">
            You will receive email and SMS updates about your order status. You can also track your order anytime from your account.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            <Package className="w-4 h-4" />
            View Order Status
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/collections/newarrivals"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <p className="mb-2">Need help with your order?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:support@example.com" className="text-amber-600 hover:text-amber-700">
              Contact Support
            </a>
            <span>•</span>
            <Link href="/faq" className="text-amber-600 hover:text-amber-700">
              FAQs
            </Link>
            <span>•</span>
            <Link href="/returns" className="text-amber-600 hover:text-amber-700">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}