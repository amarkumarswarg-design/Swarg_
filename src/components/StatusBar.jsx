import React, { useState, useEffect } from 'react';

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
      <div className="text-sm font-semibold tracking-tight">
        {formatTime(time)}
      </div>
      <div className="flex items-center gap-2">
        <span>📶</span>
        <span>📡</span>
        <div className="flex items-center">
          <span className="text-xs mr-1">75%</span>
          <span>🔋</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
