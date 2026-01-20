// client/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  VideoCameraIcon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "End-to-End Encryption",
      description: "Military grade AES-256 encryption for all messages and calls"
    },
    {
      icon: <VideoCameraIcon className="h-8 w-8" />,
      title: "HD Voice & Video Calls",
      description: "Crystal clear calls with our advanced WebRTC technology"
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Group Chats",
      description: "Create groups with up to 1000 members"
    },
    {
      icon: <LockClosedIcon className="h-8 w-8" />,
      title: "Privacy First",
      description: "No data collection. Your conversations stay private"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: "Rich Media",
      description: "Share photos, videos, documents and voice messages"
    },
    {
      icon: <DevicePhoneMobileIcon className="h-8 w-8" />,
      title: "PWA Support",
      description: "Install as app on Android/iOS. No Play Store needed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Swarg Messenger
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience the future of secure messaging. Free, encrypted, and packed with features.
                  Your conversations belong to you alone.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started Free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image/Graphics */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 hidden lg:block">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Mockup Chat Interface */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-80 transform rotate-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      <div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-2 w-16 bg-gray-100 dark:bg-gray-600 rounded mt-1"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  
                  {/* Chat bubbles */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-3 max-w-xs">
                        <div className="h-2 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-2 w-24 bg-gray-300 dark:bg-gray-600 rounded mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl rounded-tr-none p-3 max-w-xs">
                        <div className="h-2 w-40 bg-white/80 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full">
                        Encrypted with AES-256
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl transform -rotate-12 shadow-lg"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl transform rotate-12 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need for secure communication
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Swarg combines cutting-edge technology with user-friendly design
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="card hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Join Swarg Messenger today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Create Free Account
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-400"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400 dark:text-gray-500">
              Developed with ❤️ by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Amar Kumar</span>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Swarg Messenger. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
