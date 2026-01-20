import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Wifi, Battery, X } from 'lucide-react';

const DynamicIsland = ({ isExpanded, onToggle }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <motion.div
      className="absolute top-3 left-1/2 transform -translate-x-1/2 z-40"
      animate={{ width: isExpanded ? 200 : 120 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      <div 
        className="relative h-8 bg-black rounded-full flex items-center justify-center cursor-pointer"
        onClick={onToggle}
      >
        {!isExpanded ? (
          // Collapsed state
          <div className="flex items-center justify-center w-full gap-2 px-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">Now Playing</span>
          </div>
        ) : (
          // Expanded state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between w-full px-4"
          >
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-white" />
              <div className="text-white">
                <p className="text-xs font-semibold">iOS Simulator</p>
                <p className="text-[10px] text-gray-400">Demo Mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-white" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Expanded Content Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-64 bg-black/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Quick Settings</h3>
              <X 
                className="w-4 h-4 text-gray-400 cursor-pointer" 
                onClick={onToggle}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'WiFi', label: 'Wi-Fi', active: true },
                { icon: 'BT', label: 'Bluetooth', active: false },
                { icon: '🔋', label: 'Battery', value: '75%' },
                { icon: '🔊', label: 'Volume', value: '50%' },
                { icon: '🌙', label: 'Dark Mode', active: true },
                { icon: '✈️', label: 'Airplane', active: false },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs text-white">{item.label}</span>
                  {item.value && (
                    <span className="text-[10px] text-gray-400 mt-1">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DynamicIsland;
