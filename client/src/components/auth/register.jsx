// client/src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSwargNumber, setGeneratedSwargNumber] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate random Swarg Number
  const generateSwargNumber = () => {
    const areaCode = Math.floor(100 + Math.random() * 900);
    const prefix = Math.floor(100 + Math.random() * 900);
    const lineNumber = Math.floor(1000 + Math.random() * 9000);
    return `+1 (${areaCode}) ${prefix}-${lineNumber}`;
  };

  // Copy Swarg Number to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSwargNumber);
    toast.success('Swarg Number copied to clipboard!');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!formData.username.trim()) {
      toast.error('Please choose a username');
      return;
    }
    
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - Replace with actual API endpoint
      // const response = await axios.post('/api/register', {
      //   name: formData.name,
      //   username: formData.username,
      //   password: formData.password
      // });

      // For now, simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const swargNumber = generateSwargNumber();
      setGeneratedSwargNumber(swargNumber);
      setRegistrationSuccess(true);
      
      toast.success('Account created successfully!');
      
      // Save to localStorage (temporary)
      localStorage.setItem('swarg_temp_user', JSON.stringify({
        name: formData.name,
        username: formData.username,
        swargNumber: swargNumber
      }));

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Swarg Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join the secure messaging revolution
          </p>
        </div>

        {/* Registration Form */}
        {!registrationSuccess ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username (Unique)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">@</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Choose a unique username"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be used to find you on Swarg
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
                    placeholder="Create a strong password"
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

              {/* Confirm Password Field */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Terms and Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By registering, you agree to our{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* Success Screen with Swarg Number */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Created Successfully! 🎉
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to Swarg Messenger, {formData.name}! Your unique Swarg Number is:
            </p>
            
            {/* Swarg Number Display */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 mb-6">
              <div className="swarg-number text-2xl font-bold mb-4">
                {generatedSwargNumber}
              </div>
              <button
                onClick={copyToClipboard}
                className="btn-primary inline-flex items-center gap-2"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
                Copy Swarg Number
              </button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ <strong>Important:</strong> Save your Swarg Number! You'll need it to log in along with your password.
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Your username: <span className="font-bold text-indigo-600 dark:text-indigo-400">@{formData.username}</span>
            </p>
            
            <div className="mt-8">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full py-3"
              >
                Continue to Login
              </button>
              <button
                onClick={() => setRegistrationSuccess(false)}
                className="btn-secondary w-full py-3 mt-3"
              >
                Create Another Account
              </button>
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            End-to-end encrypted with AES-256
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
