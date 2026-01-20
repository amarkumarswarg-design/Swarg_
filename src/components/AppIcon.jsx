import React from 'react';
import { motion } from 'framer-motion';

const AppIcon = ({ app, size = 'md', onClick }) => {
  const getIcon = (appId) => {
    const icons = {
      'phone': '📞',
      'messages': '💬',
      'mail': '📧',
      'calendar': '📅',
      'photos': '🖼️',
      'camera': '📸',
      'music': '🎵',
      'maps': '🗺️',
      'weather': '☀️',
      'notes': '📝',
      'chat': '🤖',
      'portfolio': '💼',
      'calculator': '🧮',
      'settings': '⚙️'
    };
    return icons[appId] || '📱';
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center ${app.color} shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
    >
      {getIcon(app.id)}
    </motion.button>
  );
};

export default AppIcon;
