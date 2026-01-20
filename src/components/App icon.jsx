import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const AppIcon = ({ app, size = 'md', onClick }) => {
  const IconComponent = LucideIcons[app.icon] || LucideIcons['Smartphone'];
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center ${app.color} shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
    >
      <IconComponent 
        size={iconSizes[size]} 
        className="text-white" 
      />
    </motion.button>
  );
};

export default AppIcon;
