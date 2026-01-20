import NotesApp from '../apps/NotesApp';
import ChatApp from '../apps/ChatApp';
import PortfolioApp from '../apps/PortfolioApp';
import CalculatorApp from '../apps/CalculatorApp';
import { 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Calculator,
  Music,
  Camera,
  Settings,
  Phone,
  Mail,
  Calendar,
  Photos,
  Maps,
  Weather
} from 'lucide-react';

export const appsConfig = [
  {
    id: 'phone',
    name: 'Phone',
    icon: 'Phone',
    color: 'bg-green-500',
    isInDock: true,
    component: () => <div className="p-8">Phone App (Simulated)</div>
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: 'MessageSquare',
    color: 'bg-green-400',
    isInDock: false,
    component: () => <div className="p-8">Messages App</div>
  },
  {
    id: 'mail',
    name: 'Mail',
    icon: 'Mail',
    color: 'bg-blue-500',
    isInDock: false,
    component: () => <div className="p-8">Mail App</div>
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: 'Calendar',
    color: 'bg-red-500',
    isInDock: true,
    component: () => <div className="p-8">Calendar App</div>
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: 'Photos',
    color: 'bg-purple-500',
    isInDock: false,
    component: () => <div className="p-8">Photos App</div>
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: 'Camera',
    color: 'bg-gray-700',
    isInDock: false,
    component: () => <div className="p-8">Camera App</div>
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'Music',
    color: 'bg-pink-500',
    isInDock: false,
    component: () => <div className="p-8">Music App</div>
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: 'Maps',
    color: 'bg-blue-600',
    isInDock: false,
    component: () => <div className="p-8">Maps App</div>
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: 'Weather',
    color: 'bg-blue-400',
    isInDock: false,
    component: () => <div className="p-8">Weather App</div>
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'FileText',
    color: 'bg-yellow-500',
    isInDock: true,
    component: NotesApp
  },
  {
    id: 'chat',
    name: 'AI Chat',
    icon: 'MessageSquare',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    isInDock: false,
    component: ChatApp
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: 'Briefcase',
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    isInDock: true,
    component: PortfolioApp
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    color: 'bg-gray-600',
    isInDock: false,
    component: CalculatorApp
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    color: 'bg-gray-400',
    isInDock: false,
    component: () => <div className="p-8">Settings App</div>
  }
];
