import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBar from './components/StatusBar';
import DynamicIsland from './components/DynamicIsland';
import HomeScreen from './components/HomeScreen';
import AppWindow from './components/AppWindow';
import { appsConfig } from './utils/appsConfig';

function App() {
  const [currentApp, setCurrentApp] = useState(null);
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);

  const openApp = (appId) => {
    setCurrentApp(appId);
  };

  const closeApp = () => {
    setCurrentApp(null);
  };

  const handleSwipeUp = () => {
    if (currentApp) {
      closeApp();
    }
  };

  // Add keyboard shortcut for home button
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && currentApp) {
        closeApp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentApp]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Wallpaper */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1502741338009-5b3f2a1b4e8d?q=80&w=2940")',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* iOS Simulator Container */}
        <motion.div 
          className="relative w-full max-w-md h-[90vh] max-h-[800px] rounded-[60px] overflow-hidden border-[14px] border-gray-900 shadow-2xl mx-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Status Bar */}
          <StatusBar />
          
          {/* Dynamic Island */}
          <DynamicIsland 
            isExpanded={isDynamicIslandExpanded}
            onToggle={() => setIsDynamicIslandExpanded(!isDynamicIslandExpanded)}
          />

          {/* Home Screen or App Window */}
          <AnimatePresence mode="wait">
            {currentApp ? (
              <AppWindow
                key={currentApp}
                app={appsConfig.find(app => app.id === currentApp)}
                onClose={closeApp}
                onSwipeUp={handleSwipeUp}
              />
            ) : (
              <HomeScreen
                key="home"
                apps={appsConfig}
                onAppClick={openApp}
              />
            )}
          </AnimatePresence>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-white/70 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
