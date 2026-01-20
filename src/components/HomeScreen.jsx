import React from 'react';
import { motion } from 'framer-motion';
import AppGrid from './AppGrid';
import Dock from './Dock';

const HomeScreen = ({ apps, onAppClick }) => {
  return (
    <div className="relative w-full h-full pt-12 pb-24 overflow-y-auto">
      {/* App Grid */}
      <div className="px-4">
        <AppGrid apps={apps} onAppClick={onAppClick} />
      </div>

      {/* Dock */}
      <div className="absolute bottom-0 left-0 right-0">
        <Dock apps={apps.filter(app => app.isInDock)} onAppClick={onAppClick} />
      </div>

      {/* Empty State Message */}
      {apps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-white/50"
        >
          <p className="text-lg font-medium">No Apps Installed</p>
          <p className="text-sm mt-2">Add apps to get started</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomeScreen;
