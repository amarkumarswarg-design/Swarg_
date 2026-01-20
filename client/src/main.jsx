// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Theme detection
const savedTheme = localStorage.getItem('swarg_theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', savedTheme);

// Online/Offline detection
window.addEventListener('online', () => {
  document.dispatchEvent(new CustomEvent('swarg:online'));
  console.log('Swarg Messenger is online');
});

window.addEventListener('offline', () => {
  document.dispatchEvent(new CustomEvent('swarg:offline'));
  console.log('Swarg Messenger is offline - working in offline mode');
});

// Before install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.dispatchEvent(new CustomEvent('swarg:pwa-prompt', { detail: e }));
});

// App launch
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
                        }
