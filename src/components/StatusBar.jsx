import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase().replace(' ', '');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-6 pt-2 pb-1 flex justify-between items-center text-white">
      {/* Left side - Time */}
      <div className="text-sm font-semibold tracking-tight">
        {formatTime(time)}
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <div className="flex items-center gap-0.5">
          <div className="relative w-6 h-3 border border-white rounded-sm">
            <div 
              className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 bg-white rounded-[1px]"
              style={{ width: '75%' }}
            />
          </div>
          <Battery className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
