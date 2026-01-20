import NotesApp from '../apps/NotesApp';
import ChatApp from '../apps/ChatApp';
import PortfolioApp from '../apps/PortfolioApp';
import CalculatorApp from '../apps/CalculatorApp';

export const appsConfig = [
  {
    id: 'phone',
    name: 'Phone',
    color: 'bg-green-500',
    isInDock: true,
    component: () => <div className="p-8 h-full flex items-center justify-center text-gray-600">Phone App (Simulated)</div>
  },
  {
    id: 'messages',
    name: 'Messages',
    color: 'bg-green-400',
    isInDock: false,
    component: () => <div className="p-8">Messages App</div>
  },
  {
    id: 'mail',
    name: 'Mail',
    color: 'bg-blue-500',
    isInDock: false,
    component: () => <div className="p-8">Mail App</div>
  },
  {
    id: 'calendar',
    name: 'Calendar',
    color: 'bg-red-500',
    isInDock: true,
    component: () => <div className="p-8">Calendar App</div>
  },
  {
    id: 'photos',
    name: 'Photos',
    color: 'bg-purple-500',
    isInDock: false,
    component: () => <div className="p-8">Photos App</div>
  },
  {
    id: 'camera',
    name: 'Camera',
    color: 'bg-gray-700',
    isInDock: false,
    component: () => <div className="p-8">Camera App</div>
  },
  {
    id: 'music',
    name: 'Music',
    color: 'bg-pink-500',
    isInDock: false,
    component: () => <div className="p-8">Music App</div>
  },
  {
    id: 'maps',
    name: 'Maps',
    color: 'bg-blue-600',
    isInDock: false,
    component: () => <div className="p-8">Maps App</div>
  },
  {
    id: 'weather',
    name: 'Weather',
    color: 'bg-blue-400',
    isInDock: false,
    component: () => <div className="p-8">Weather App</div>
  },
  {
    id: 'notes',
    name: 'Notes',
    color: 'bg-yellow-500',
    isInDock: true,
    component: NotesApp
  },
  {
    id: 'chat',
    name: 'AI Chat',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    isInDock: false,
    component: ChatApp
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    isInDock: true,
    component: PortfolioApp
  },
  {
    id: 'calculator',
    name: 'Calculator',
    color: 'bg-gray-600',
    isInDock: false,
    component: CalculatorApp
  },
  {
    id: 'settings',
    name: 'Settings',
    color: 'bg-gray-400',
    isInDock: false,
    component: () => <div className="p-8">Settings App</div>
  }
];
