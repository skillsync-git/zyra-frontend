// File: app/track-order/page.jsx
'use client';
import { useState } from 'react';
import { Package, Truck, MapPin, CheckCircle, Clock, AlertCircle, Search, ChevronDown } from 'lucide-react';

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-001',
      orderDate: '2024-01-15',
      sareeType: 'Royal Purple Kanjivaram',
      price: '₹18,999',
      status: 'Delivered',
      estimatedDelivery: '2024-01-22',
      currentStep: 4,
      timeline: [
        { step: 1, title: 'Order Placed', date: '2024-01-15', completed: true },
        { step: 2, title: 'Processing', date: '2024-01-16', completed: true },
        { step: 3, title: 'Shipped', date: '2024-01-18', completed: true },
        { step: 4, title: 'Delivered', date: '2024-01-22', completed: true }
      ]
    },
    {
      id: 'ORD-2024-002',
      orderDate: '2024-01-18',
      sareeType: 'Golden Kanjivaram Bridal',
      price: '₹24,999',
      status: 'In Transit',
      estimatedDelivery: '2024-01-25',
      currentStep: 3,
      timeline: [
        { step: 1, title: 'Order Placed', date: '2024-01-18', completed: true },
        { step: 2, title: 'Processing', date: '2024-01-19', completed: true },
        { step: 3, title: 'Shipped', date: '2024-01-20', completed: true },
        { step: 4, title: 'Delivery', date: '2024-01-25', completed: false }
      ]
    },
    {
      id: 'ORD-2024-003',
      orderDate: '2024-01-20',
      sareeType: 'Emerald Temple Border',
      price: '₹19,999',
      status: 'Processing',
      estimatedDelivery: '2024-01-27',
      currentStep: 2,
      timeline: [
        { step: 1, title: 'Order Placed', date: '2024-01-20', completed: true },
        { step: 2, title: 'Processing', date: '2024-01-21', completed: true },
        { step: 3, title: 'Shipped', date: '2024-01-23', completed: false },
        { step: 4, title: 'Delivery', date: '2024-01-27', completed: false }
      ]
    }
  ]);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-50 border-green-200';
      case 'In Transit':
        return 'bg-blue-50 border-blue-200';
      case 'Processing':
        return 'bg-yellow-50 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Processing':
        return <Package className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="h-24"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-red-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-2">Track Your Order</h1>
          <p className="text-amber-100">Monitor your silk saree delivery status in real-time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g., ORD-2024-001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-amber-900 to-red-900 p-4 text-white">
                <h2 className="text-lg font-light">My Orders</h2>
                <p className="text-sm text-amber-100">{filteredOrders.length} order(s) found</p>
              </div>

              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full text-left p-4 hover:bg-stone-50 transition ${
                        selectedOrder?.id === order.id ? 'bg-amber-50 border-l-4 border-amber-700' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm text-stone-900">{order.id}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mb-1">{order.sareeType}</p>
                      <p className="text-sm font-medium text-amber-700">{order.price}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-stone-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details & Timeline */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Header */}
                <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  selectedOrder.status === 'Delivered' ? 'border-green-500' :
                  selectedOrder.status === 'In Transit' ? 'border-blue-500' :
                  'border-yellow-500'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Order Number</p>
                      <h3 className="text-2xl font-light text-stone-900">{selectedOrder.id}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                      selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      selectedOrder.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Order Date</p>
                      <p className="font-medium text-stone-900">{selectedOrder.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Estimated Delivery</p>
                      <p className="font-medium text-stone-900">{selectedOrder.estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Saree Type</p>
                      <p className="font-medium text-stone-900">{selectedOrder.sareeType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Total Amount</p>
                      <p className="font-medium text-amber-700 text-lg">{selectedOrder.price}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-light text-stone-900 mb-6">Delivery Timeline</h3>
                  
                  <div className="relative">
                    {selectedOrder.timeline.map((item, index) => (
                      <div key={item.step} className="flex gap-4 pb-6">
                        {/* Timeline dot and line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                            item.completed 
                              ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                              : 'bg-stone-200 text-stone-600 border-2 border-stone-300'
                          }`}>
                            {item.completed ? '✓' : item.step}
                          </div>
                          {index < selectedOrder.timeline.length - 1 && (
                            <div className={`w-1 h-12 mt-2 ${
                              item.completed ? 'bg-green-500' : 'bg-stone-300'
                            }`}></div>
                          )}
                        </div>

                        {/* Timeline content */}
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${item.completed ? 'text-stone-900' : 'text-stone-500'}`}>
                            {item.title}
                          </p>
                          <p className={`text-sm ${item.completed ? 'text-stone-600' : 'text-stone-400'}`}>
                            {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-light text-stone-900 mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-stone-600">
                      For any queries regarding your order, please contact our customer support team.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium">
                        Contact Support
                      </button>
                      <button className="px-4 py-2 border border-stone-300 text-stone-900 rounded-lg hover:bg-stone-50 transition text-sm font-medium">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-stone-300 mb-4" />
                <p className="text-lg text-stone-500">Select an order to view details</p>
                <p className="text-sm text-stone-400 mt-2">Click on an order from the list to track its status</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex gap-4">
            <MapPin className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">Real-time Tracking</h3>
              <p className="text-sm text-amber-800">
                Your order will be updated in real-time. Once your saree ships, youll receive a tracking number via email. 
                You can use this number to get more detailed tracking information from our courier partner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
