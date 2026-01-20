import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from './AppIcon';

const Dock = ({ apps, onAppClick }) => {
  return (
    <div className="relative px-6 pb-6">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 -top-4 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl" />
      
      {/* Dock Icons */}
      <div className="relative flex justify-around items-center py-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            <AppIcon
              app={app}
              size="lg"
              onClick={() => onAppClick(app.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dock;
