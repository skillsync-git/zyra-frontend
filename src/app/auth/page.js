

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authcontext';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

export default function AuthPages() {
  const router = useRouter();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic here
     login({
        name: formData.name || formData.email,
        email: formData.email
      });
      // Navigate to home page
      router.push('/home');
    } else {
      // Signup logic here
      

      // You can add password confirmation check
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Navigate to login page after signup
     alert("Signup successful! Please login.");
    setIsLogin(true);

    // Optionally, clear password fields
    setFormData({ ...formData, password: '', confirmPassword: '' });
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    // Clear form data when switching mode
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4 pt-30">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
<h2 className="text-3xl font-bold text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

 <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-brown-500 to-amber-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} className="text-amber-600 font-semibold hover:text-amber-700">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
        {/* Left Side - Image/Branding
        <div className="hidden md:flex flex-col justify-center items-center space-y-6 ">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-brown-500 to-amber-600 bg-clip-text text-transparent">
              SILKEN
            </h1>
            <p className="text-xl text-gray-700 font-medium">Premium Silk Sarees</p>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-brown-500 mx-auto rounded-full"></div>
          </div>

          {/* Decorative Element */}
    //       <div className="relative w-72 h-72">
    //         <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-brown-800 rounded-full opacity-20 animate-pulse"></div>
    //         <div className="absolute inset-8 bg-gradient-to-br from-amber-500 to-brown-600 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    //         <div className="absolute inset-16 bg-gradient-to-br from-amber-800 to-brown-600 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

    //         <div className="absolute inset-0 flex items-center justify-center">
    //           <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
    //             <img src="/images/fs1.jpeg" alt="Silk Saree" className="w-full h-full object-cover" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="text-center space-y-2">
    //         <p className="text-gray-600 italic">&quot;Elegance woven with tradition&quot;</p>
    //         <p className="text-sm text-gray-500">Discover the finest collection of handcrafted silk sarees</p>
    //       </div>
    //     </div>

    //     {/* Right Side - Auth Form */}
    //     <div className="w-full">
    //       <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">

    //         {/* Logo for mobile */}
    //         <div className="md:hidden text-center mb-6">
    //           <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-brown-400 bg-clip-text text-transparent">
    //             SILKEN
    //           </h1>
    //         </div>

    //         {/* Header */}
    //         <div className="text-center space-y-2">
    //           <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
    //           <p className="text-gray-600">{isLogin ? 'Login to access your account' : 'Sign up to start shopping'}</p>
    //         </div>

    //         {/* Form */}
    //         <form className="space-y-5" onSubmit={handleSubmit}>

    //           {/* Name Field - Only for Signup */}
    //           {!isLogin && (
    //             <div className="space-y-2">
    //               <label className="text-sm font-medium text-gray-700">Full Name</label>
    //               <div className="relative">
    //                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //                 <input
    //                   type="text"
    //                   name="name"
    //                   value={formData.name}
    //                   onChange={handleChange}
    //                   placeholder="Enter your full name"
    //                   className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
    //                   required
    //                 />
    //               </div>
    //             </div>
    //           )}

    //           {/* Email Field */}
    //           <div className="space-y-2">
    //             <label className="text-sm font-medium text-gray-700">Email Address</label>
    //             <div className="relative">
    //               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //               <input
    //                 type="email"
    //                 name="email"
    //                 value={formData.email}
    //                 onChange={handleChange}
    //                 placeholder="Enter your email"
    //                 className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
    //                 required
    //               />
    //             </div>
    //           </div>

    //           {/* Phone Field - Only for Signup */}
    //           {!isLogin && (
    //             <div className="space-y-2">
    //               <label className="text-sm font-medium text-gray-700">Phone Number</label>
    //               <div className="relative">
    //                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //                 <input
    //                   type="tel"
    //                   name="phone"
    //                   value={formData.phone}
    //                   onChange={handleChange}
    //                   placeholder="Enter your phone number"
    //                   className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
    //                   required
    //                 />
    //               </div>
    //             </div>
    //           )}

    //           {/* Password Field */}
    //           <div className="space-y-2">
    //             <label className="text-sm font-medium text-gray-700">Password</label>
    //             <div className="relative">
    //               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //               <input
    //                 type={showPassword ? "text" : "password"}
    //                 name="password"
    //                 value={formData.password}
    //                 onChange={handleChange}
    //                 placeholder="Enter your password"
    //                 className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
    //                 required
    //               />
    //               <button
    //                 type="button"
    //                 onClick={() => setShowPassword(!showPassword)}
    //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //               >
    //                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    //               </button>
    //             </div>
    //           </div>

    //           {/* Confirm Password Field - Only for Signup */}
    //           {!isLogin && (
    //             <div className="space-y-2">
    //               <label className="text-sm font-medium text-gray-700">Confirm Password</label>
    //               <div className="relative">
    //                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //                 <input
    //                   type={showPassword ? "text" : "password"}
    //                   name="confirmPassword"
    //                   value={formData.confirmPassword}
    //                   onChange={handleChange}
    //                   placeholder="Confirm your password"
    //                   className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
    //                   required
    //                 />
    //               </div>
    //             </div>
    //           )}

    //           {/* Forgot Password - Only for Login */}
    //           {isLogin && (
    //             <div className="flex justify-end">
    //               <button type="button" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
    //                 Forgot Password?
    //               </button>
    //             </div>
    //           )}

    //           {/* Submit Button */}
    //           <button
    //             type="submit"
    //             className="w-full bg-gradient-to-r from-amber-500 via-brown-500 to-amber-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
    //           >
    //             {isLogin ? 'Login' : 'Sign Up'}
    //           </button>
    //         </form>

    //         {/* Toggle Between Login/Signup */}
    //         <div className="text-center pt-4">
    //           <p className="text-sm text-gray-600">
    //             {isLogin ? "Don't have an account? " : "Already have an account? "}
    //             <button type="button" onClick={switchMode} className="text-amber-600 hover:text-amber-700 font-semibold">
    //               {isLogin ? 'Sign Up' : 'Login'}
    //             </button>
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
//   );
// } */}
