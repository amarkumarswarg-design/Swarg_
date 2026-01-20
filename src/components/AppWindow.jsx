import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

const AppWindow = ({ app, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      setIsClosing(true);
      setTimeout(onClose, 200);
    }
    setDragY(0);
  };

  const handleDrag = (event, info) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y);
    }
  };

  const AppComponent = app.component;

  return (
    <motion.div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50"
        animate={{ y: dragY > 0 ? dragY : 0 }}
      >
        <ChevronDown className="w-8 h-8 text-white/70" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-white rounded-t-3xl overflow-hidden"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ y: isClosing ? '100%' : dragY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ cursor: 'grab' }}
      >
        <div className="relative h-12 flex items-center justify-center bg-white border-b">
          <div className="flex-1 text-center">
            <span className="font-semibold">{app.name}</span>
          </div>
          <button
            onClick={() => {
              setIsClosing(true);
              setTimeout(onClose, 200);
            }}
            className="absolute right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-[calc(100%-3rem)] overflow-auto">
          <AppComponent />
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-gray-300 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default AppWindow;
