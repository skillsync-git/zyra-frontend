'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Package, Shield, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('Tamil Nadu');
  const [pin, setPin] = useState('');

  useEffect(() => {
    const storedProduct = sessionStorage.getItem('checkoutProduct');
    if (storedProduct) {
      try {
        const product = JSON.parse(storedProduct);
        // Ensure quantity exists
        if (!product.quantity) product.quantity = 1;
        setCartItems([product]);
      } catch (e) {
        console.error('Error parsing stored product:', e);
      }
    }
    setLoading(false);
  }, []);

  // Helper: convert price "₹12,000.00" to numeric 12000.00
  const parsePrice = (val) => Number(String(val).replace(/[^0-9.]/g, ''));

  // Calculate totals (no GST now)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0
  );
  const shipping = 0; // Free Shipping
  const total = subtotal + shipping;

  const generateOrderId = () => `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      alert('Cart is empty');
      return;
    }
    if (!firstName || !lastName || !phone || !address1 || !city || !pin) {
      alert('Please fill all required fields');
      setStep(1);
      return;
    }
    const item = cartItems[0];
    const address = `${address1}, ${address2}, ${city}, ${stateValue}, ${pin}`;
    const orderId = generateOrderId();

    const orderData = {
      order_id: orderId,
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      product: item.name,
      quantity: item.quantity,
      price: parsePrice(item.price),
      status: 'pending',
      image: item.img,  // use 'image' to match backend field
      order_date: new Date().toISOString()
    };

    try {
      const res = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        sessionStorage.setItem('lastOrderId', orderId);
        sessionStorage.setItem('paymentAmount', `₹${total.toLocaleString()}`); // Save amount for success page
        sessionStorage.removeItem('checkoutProduct'); // Clear cart
        router.push('/success');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Order request failed:', error);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-700 mx-auto mb-4" />
          <p className="text-stone-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="h-20" />
      <div className="bg-stone-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-light">Checkout</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
          {['Address', 'Payment', 'Review'].map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= i + 1 ? 'bg-amber-700 text-white' : 'bg-stone-200'}`}>
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <div className="w-12 h-px bg-stone-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step1 - Address */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl mb-6 flex items-center gap-2"><MapPin className="w-6 h-6" />Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="First Name *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  <input placeholder="Last Name *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <input placeholder="Phone Number *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={phone} onChange={e => setPhone(e.target.value)} />
                <input placeholder="Address Line 1 *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={address1} onChange={e => setAddress1(e.target.value)} />
                <input placeholder="Address Line 2" className="w-full px-4 py-3 border border-stone-300 rounded" value={address2} onChange={e => setAddress2(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="City *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={city} onChange={e => setCity(e.target.value)} />
                  <select className="w-full px-4 py-3 border border-stone-300 rounded" value={stateValue} onChange={e => setStateValue(e.target.value)}>
                    <option>Tamil Nadu</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                  </select>
                  <input placeholder="PIN Code *" required className="w-full px-4 py-3 border border-stone-300 rounded" value={pin} onChange={e => setPin(e.target.value)} />
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-stone-900 text-white py-4 rounded hover:bg-stone-800 mt-6">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl mb-6 flex items-center gap-2"><CreditCard className="w-6 h-6" />Payment Method</h2>
              <label className="border border-stone-300 rounded p-4 flex items-center cursor-pointer hover:border-amber-700">
                <input type="radio" name="payment" className="mr-4 accent-amber-700" defaultChecked />
                <div className="flex-1">
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-stone-600">Pay after you receive product</p>
                </div>
              </label>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border border-stone-300 py-4 rounded hover:bg-stone-50">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-stone-900 text-white py-4 rounded hover:bg-stone-800">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl mb-6 flex items-center gap-2"><Package className="w-6 h-6" />Review Your Order</h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 mb-4">
                      <img src={item.img} alt={item.name} className="w-20 h-28 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                        <p className="text-lg font-light mt-2">₹{parsePrice(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 border border-stone-300 py-4 rounded hover:bg-stone-50 transition">Back</button>
                  <button onClick={handlePlaceOrder} className="flex-1 bg-amber-700 text-white py-4 rounded hover:bg-amber-800 transition">Place Order</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side order summary */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <h3 className="text-xl font-light mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-xl font-light">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Package className="w-5 h-5 text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <Check className="w-5 h-5 text-green-600" />
              <span>7-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
