// client/src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PhoneIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BellIcon,
  BookmarkIcon,
  ArchiveBoxIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftRightIcon as ChatBubbleSolid,
  UserGroupIcon as UserGroupSolid,
  HomeIcon as HomeSolid,
  BellIcon as BellSolid,
  BookmarkIcon as BookmarkSolid
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Chats', path: '/chats', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleSolid },
    { name: 'Groups', path: '/groups', icon: UserGroupIcon, activeIcon: UserGroupSolid },
    { name: 'Calls', path: '/calls', icon: PhoneIcon },
    { name: 'Video Calls', path: '/video-calls', icon: VideoCameraIcon },
    { name: 'Notifications', path: '/notifications', icon: BellIcon, activeIcon: BellSolid, badge: unreadNotifications },
    { name: 'Saved', path: '/saved', icon: BookmarkIcon, activeIcon: BookmarkSolid },
    { name: 'Archived', path: '/archived', icon: ArchiveBoxIcon },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('swarg_token');
    localStorage.removeItem('swarg_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="w-20 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 justify-center lg:justify-start">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Swarg</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Messenger</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const ActiveIcon = item.activeIcon || item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      {isActive ? (
                        <ActiveIcon className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:block font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          <Cog6ToothIcon className="h-6 w-6" />
          <span className="hidden lg:block font-medium">Settings</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>

        {/* User Info */}
        <div className="hidden lg:block pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Amar Kumar</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@amar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
