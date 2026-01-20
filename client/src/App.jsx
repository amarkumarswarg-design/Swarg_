// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

// Components
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Styles
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('swarg_token');
    const savedTheme = localStorage.getItem('swarg_theme') || 'light';
    
    if (token) {
      setIsAuthenticated(true);
    }
    setTheme(savedTheme);
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('swarg_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
        <ChatProvider>
          <Router>
            <div className={`app-container ${theme}`}>
              {/* Show Navbar only when authenticated */}
              {isAuthenticated && <Navbar toggleTheme={toggleTheme} />}
              
              <div className="main-content">
                {/* Show Sidebar only when authenticated */}
                {isAuthenticated && <Sidebar />}
                
                <div className="content-area">
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/" 
                      element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <Home />
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <Register />
                      } 
                    />
                    <Route 
                      path="/login" 
                      element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <Login />
                      } 
                    />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        isAuthenticated ? 
                        <Dashboard /> : 
                        <Navigate to="/login" />
                      } 
                    />
                    <Route 
                      path="/contacts" 
                      element={
                        isAuthenticated ? 
                        <Contacts /> : 
                        <Navigate to="/login" />
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        isAuthenticated ? 
                        <Settings /> : 
                        <Navigate to="/login" />
                      } 
                    />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
              
              {/* PWA Install Prompt */}
              {window.matchMedia('(display-mode: standalone)').matches ? null : (
                <div className="pwa-install-prompt">
                  <p>Install Swarg Messenger for better experience</p>
                  <button className="install-btn">Add to Home Screen</button>
                </div>
              )}
            </div>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
