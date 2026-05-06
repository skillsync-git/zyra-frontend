'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Phone, AlertCircle, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'https://zyra-website.onrender.com/api';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=enter email, 2=enter new password
  const [fpEmail, setFpEmail] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [showFpPassword, setShowFpPassword] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const { login, loginWithMobile, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loginType === 'email') {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
    } else {
      if (!mobile || !password) {
        setError('Please enter both mobile number and password');
        return;
      }
      if (!/^[0-9]{10}$/.test(mobile)) {
        setError('Mobile number must be exactly 10 digits');
        return;
      }
    }

    setLoading(true);
    let result;
    if (loginType === 'email') {
      result = await login(email, password);
    } else {
      result = await loginWithMobile(mobile, password);
    }

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  // Step 1: Check if email exists
  const handleFpEmailSubmit = async () => {
    setFpError('');
    if (!fpEmail || !/\S+@\S+\.\S+/.test(fpEmail)) {
      setFpError('Please enter a valid email address');
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (res.ok && data.exists) {
        setFpStep(2);
      } else {
        setFpError('No account found with this email address');
      }
    } catch (err) {
      setFpError('Something went wrong. Please try again.');
    }
    setFpLoading(false);
  };

  // Step 2: Reset password
  const handleFpResetSubmit = async () => {
    setFpError('');
    if (!fpNewPassword || fpNewPassword.length < 6) {
      setFpError('Password must be at least 6 characters');
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError('Passwords do not match');
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail, newPassword: fpNewPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFpSuccess('Password reset successfully! You can now login.');
        setTimeout(() => {
          setShowForgotModal(false);
          setFpStep(1);
          setFpEmail('');
          setFpNewPassword('');
          setFpConfirmPassword('');
          setFpSuccess('');
        }, 2000);
      } else {
        setFpError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setFpError('Something went wrong. Please try again.');
    }
    setFpLoading(false);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setFpStep(1);
    setFpEmail('');
    setFpNewPassword('');
    setFpConfirmPassword('');
    setFpError('');
    setFpSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your SareeHaven account</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex rounded-lg border border-slate-200 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setLoginType('email'); setError(''); }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                loginType === 'email'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('mobile'); setError(''); }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                loginType === 'mobile'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-1" />
              Mobile
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginType === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                  placeholder="Enter your password"
                  style={{backgroundImage: 'none'}}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password above Sign In */}
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>


          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-amber-600 transition">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={closeForgotModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {fpStep === 1 ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {fpStep === 1
                ? 'Enter your registered email address'
                : `Set a new password for ${fpEmail}`}
            </p>

            {/* Success message */}
            {fpSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{fpSuccess}</p>
              </div>
            )}

            {/* Error message */}
            {fpError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{fpError}</p>
              </div>
            )}

            {/* Step 1: Email input */}
            {fpStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      placeholder="you@example.com"
                      onKeyDown={(e) => e.key === 'Enter' && handleFpEmailSubmit()}
                    />
                  </div>
                </div>
                <button
                  onClick={handleFpEmailSubmit}
                  disabled={fpLoading}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {fpLoading ? 'Checking...' : 'Continue'}
                </button>
              </div>
            )}

            {/* Step 2: New password input */}
            {fpStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showFpPassword ? 'text' : 'password'}
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                      style={{backgroundImage: 'none'}}
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFpPassword(!showFpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showFpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showFpPassword ? 'text' : 'password'}
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                      style={{backgroundImage: 'none'}}
                      placeholder="Repeat new password"
                      onKeyDown={(e) => e.key === 'Enter' && handleFpResetSubmit()}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setFpStep(1); setFpError(''); }}
                    className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFpResetSubmit}
                    disabled={fpLoading}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {fpLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
