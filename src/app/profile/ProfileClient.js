// app/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
    location: '',
    alternate_mobile: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    if (user) {
      console.log('✅ Loading profile from user context:', user);
      setFormData({
        full_name: user.full_name || user.name || '',
        email: user.email || '',
        mobile: user.mobile || user.mobile_number || '',
        gender: user.gender || '',
        dob: user.dob ? (typeof user.dob === 'string' ? user.dob.split('T')[0] : user.dob) : '',
        location: user.location || '',
        alternate_mobile: user.alternate_mobile || ''
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Get token from localStorage (authToken is the correct key)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No token found in localStorage');
        setMessage({ type: 'error', text: 'Authentication required. Please log in again.' });
        setTimeout(() => router.push('/login'), 2000);
        setSaving(false);
        return;
      }
      
      console.log('✅ Token found');
      
      // Validate mobile number
      if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
        setMessage({ type: 'error', text: 'Mobile number must be exactly 10 digits' });
        setSaving(false);
        return;
      }

      // Validate alternate mobile if provided
      if (formData.alternate_mobile && formData.alternate_mobile.length > 0) {
        if (!/^[0-9]{10}$/.test(formData.alternate_mobile)) {
          setMessage({ type: 'error', text: 'Alternate mobile number must be exactly 10 digits' });
          setSaving(false);
          return;
        }
      }

      const payload = {
        full_name: formData.full_name.trim(),
        mobile: formData.mobile.trim(),
        gender: formData.gender || null,
        dob: formData.dob || null,
        location: formData.location?.trim() || null,
        alternate_mobile: formData.alternate_mobile?.trim() || null
      };
      
      console.log('📤 Submitting profile update:', payload);

      const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        setMessage({ 
          type: 'error', 
          text: 'Server returned an invalid response' 
        });
        setSaving(false);
        return;
      }

      // Handle authentication errors
      if (response.status === 403 || response.status === 401) {
        console.error('❌ Authentication failed');
        setMessage({ 
          type: 'error', 
          text: 'Session expired. Please log in again.' 
        });
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        setSaving(false);
        return;
      }

      // Handle success
      if (response.ok && data.success) {
        console.log('✅ Profile updated successfully');
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update localStorage with new user data
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = {
              ...parsedUser,
              full_name: formData.full_name,
              name: formData.full_name,
              mobile: formData.mobile,
              mobile_number: formData.mobile,
              gender: formData.gender,
              dob: formData.dob,
              location: formData.location,
              alternate_mobile: formData.alternate_mobile
            };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            console.log('💾 Updated localStorage');
            
            // Trigger a page reload to refresh the user context
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } catch (error) {
            console.error('❌ Failed to update localStorage:', error);
          }
        }
        
        // Clear success message after showing it briefly
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Handle API error
        console.error('❌ Update failed:', data);
        setMessage({ 
          type: 'error', 
          text: data.message || data.error || 'Failed to update profile. Please try again.' 
        });
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">My Profile</h1>
              <p className="text-slate-600 text-sm sm:text-base">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* Success/Error Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            } flex items-start gap-3`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'success' ? 'bg-green-200' : 'bg-red-200'
              }`}>
                {message.type === 'success' ? '✓' : '✕'}
              </div>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Email cannot be changed</p>
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-slate-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
            </div>

            {/* Alternate Mobile */}
            <div>
              <label htmlFor="alternate_mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                Alternate Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="alternate_mobile"
                  name="alternate_mobile"
                  type="tel"
                  value={formData.alternate_mobile}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-700"
                  placeholder="10-digit mobile number (optional)"
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Your email address is permanent and cannot be changed. 
            If you need to update your email, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}