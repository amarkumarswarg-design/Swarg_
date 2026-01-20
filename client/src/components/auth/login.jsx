// client/src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, DevicePhoneMobileIcon, KeyIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    countryCode: '+1',
    swargNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [countryCodes] = useState([
    { code: '+1', country: 'USA/Canada' },
    { code: '+91', country: 'India' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+81', country: 'Japan' },
    { code: '+971', country: 'UAE' },
    { code: '+92', country: 'Pakistan' },
    { code: '+880', country: 'Bangladesh' },
  ]);

  // Check if there's saved login info
  useEffect(() => {
    const savedLogin = localStorage.getItem('swarg_saved_login');
    if (savedLogin) {
      const { countryCode, swargNumber, remember } = JSON.parse(savedLogin);
      if (remember) {
        setFormData(prev => ({ ...prev, countryCode, swargNumber }));
        setRememberMe(true);
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format Swarg Number input
  const formatSwargNumber = (value) => {
    // Remove all non-digits
    let numbers = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (numbers.length > 0) {
      if (numbers.length <= 3) {
        return `(${numbers}`;
      } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      } else {
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
      }
    }
    return value;
  };

  // Handle Swarg Number input with formatting
  const handleSwargNumberChange = (e) => {
    const formatted = formatSwargNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      swargNumber: formatted
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.swargNumber.trim()) {
      toast.error('Please enter your Swarg Number');
      return;
    }
    
    if (!formData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    // Save login info if remember me is checked
    if (rememberMe) {
      localStorage.setItem('swarg_saved_login', JSON.stringify({
        countryCode: formData.countryCode,
        swargNumber: formData.swargNumber,
        remember: true
      }));
    } else {
      localStorage.removeItem('swarg_saved_login');
    }

    setIsLoading(true);

    try {
      // Simulate API call - Replace with actual API endpoint
      // const response = await axios.post('/api/login', {
      //   countryCode: formData.countryCode,
      //   swargNumber: formData.swargNumber.replace(/\D/g, ''),
      //   password: formData.password
      // });

      // For now, simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('swarg_token', token);
      
      // Get user info from temp storage or mock
      const tempUser = localStorage.getItem('swarg_temp_user');
      const userData = tempUser ? JSON.parse(tempUser) : {
        name: 'Demo User',
        username: 'demo',
        swargNumber: formData.countryCode + ' ' + formData.swargNumber
      };
      
      localStorage.setItem('swarg_user', JSON.stringify(userData));
      
      toast.success('Login successful!');
      
      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    setFormData({
      countryCode: '+1',
      swargNumber: '(672) 906-1721',
      password: 'demo123'
    });
    toast.success('Demo credentials loaded. Click Login to continue.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your Swarg account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Country Code and Swarg Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Swarg Number
              </label>
              <div className="flex gap-2">
                {/* Country Code Select */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Swarg Number Input */}
                <div className="relative flex-2">
                  <input
                    type="text"
                    name="swargNumber"
                    value={formData.swargNumber}
                    onChange={handleSwargNumberChange}
                    className="input-field"
                    placeholder="(XXX) XXX-XXXX"
                    maxLength="14"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the Swarg Number you received during registration
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <div>
                <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg font-semibold mb-4"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn-secondary w-full py-3 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Try Demo Account
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              Create New Swarg Account
            </Link>
          </div>

          {/* Security Info */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Secure Login</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your credentials are encrypted end-to-end. No one, not even Swarg, can read your messages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Install Hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For best experience,{' '}
            <button 
              onClick={() => toast.success('Install from browser menu')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              install Swarg as PWA
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
