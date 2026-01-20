import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from './AppIcon';

const AppGrid = ({ apps, onAppClick }) => {
  const gridApps = apps.filter(app => !app.isInDock);
  
  return (
    <div className="grid grid-cols-4 gap-4 py-6">
      {gridApps.map((app, index) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: Math.floor(index / 4) * 0.1 + (index % 4) * 0.05,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <AppIcon
            app={app}
            onClick={() => onAppClick(app.id)}
          />
          <span className="mt-1 text-xs text-white font-medium text-center px-1">
            {app.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default AppGrid;
