

const API_BASE_URL = 'https://api-xmg2fjjbya-uc.a.run.app/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('adminToken');

// Dashboard Stats
export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard-stats`);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

// Get All Orders (for admin)
export const fetchAllOrders = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

// Get Single Order Details
export const fetchOrderDetails = async (orderId) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch order details');
  return response.json();
};

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ order_status: status })
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
};