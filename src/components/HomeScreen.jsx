import React from 'react';
import AppGrid from './AppGrid';
import Dock from './Dock';

const HomeScreen = ({ apps, onAppClick }) => {
  return (
    <div className="relative w-full h-full pt-12 pb-24 overflow-y-auto">
      <div className="px-4">
        <AppGrid apps={apps} onAppClick={onAppClick} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <Dock apps={apps.filter(app => app.isInDock)} onAppClick={onAppClick} />
      </div>
    </div>
  );
};

export default HomeScreen;
