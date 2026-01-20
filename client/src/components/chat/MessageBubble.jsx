// client/src/components/chat/MessageBubble.jsx
import React, { useState } from 'react';
import {
  CheckIcon,
  CheckBadgeIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  PlayIcon,
  PaperClipIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolid } from '@heroicons/react/24/solid';

const MessageBubble = ({ message, isOwn, contact }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Determine message status icon
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckSolid className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckBadgeIcon className="w-4 h-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  // Check if message contains media
  const isMedia = message.type === 'image' || message.type === 'video';
  const isFile = message.type === 'file';
  const isVoice = message.type === 'voice';

  // Format time
  const formatTime = (time) => {
    return time;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`relative max-w-lg ${isOwn ? 'ml-12' : 'mr-12'}`}>
        {/* Message Container */}
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
          }`}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {/* Sender name for group chats (if not own message) */}
          {!isOwn && contact?.isGroup && (
            <div className="text-xs font-semibold mb-1 opacity-90">
              {contact.name}
            </div>
          )}

          {/* Message Content */}
          {isMedia ? (
            <div className="mb-2">
              <div className="relative">
                <div className="w-64 h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg overflow-hidden">
                  {message.type === 'image' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-white opacity-50" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoCameraIcon className="w-12 h-12 text-white opacity-50" />
                      <div className="absolute">
                        <PlayIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {message.type === 'image' ? 'Photo' : 'Video'}
                </div>
              </div>
              {message.text && (
                <p className="mt-2">{message.text}</p>
              )}
            </div>
          ) : isFile ? (
            <div className="flex items-center gap-3 p-3 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium truncate">{message.fileName || 'document.pdf'}</div>
                <div className="text-xs opacity-80">{message.fileSize || '2.4 MB'}</div>
              </div>
              <PaperClipIcon className="w-5 h-5" />
            </div>
          ) : isVoice ? (
            <div className="flex items-center gap-3 p-3 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <PlayIcon className="w-5 h-5 text-white ml-0.5" />
              </div>
              <div className="flex-1">
                <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4"></div>
                </div>
                <div className="text-xs mt-1">{message.duration || '2:30'}</div>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}

          {/* Message Options (hover) */}
          {showOptions && (
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${
              isOwn ? '-left-12' : '-right-12'
            } flex items-center gap-1`}>
              <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Message Time and Status */}
        <div className={`flex items-center gap-2 mt-1 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.time)}
          </span>
          {isOwn && getStatusIcon()}
        </div>

        {/* Tail for message bubble */}
        <div className={`absolute top-0 ${
          isOwn 
            ? 'right-0 translate-x-1' 
            : 'left-0 -translate-x-1'
        }`}>
          <div className={`w-3 h-3 ${
            isOwn
              ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
              : 'bg-gray-200 dark:bg-gray-700'
          }`} style={{
            clipPath: isOwn 
              ? 'polygon(0% 0%, 100% 0%, 100% 100%)'
              : 'polygon(0% 0%, 100% 0%, 0% 100%)'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
