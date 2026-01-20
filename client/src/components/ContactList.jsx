// client/src/components/chat/ContactList.jsx
import React from 'react';
import { 
  UserCircleIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const ContactList = ({ contacts, onSelectContact, searchQuery, onSearchChange, onAddContact }) => {
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.swargNumber.includes(searchQuery)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Add Contact Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onAddContact}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <UserPlusIcon className="h-5 w-5" />
          Add New Contact
        </button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onSelectContact(contact)}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      contact.online
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {contact.avatar || <UserCircleIcon className="w-8 h-8" />}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {contact.name}
                        {contact.verified && (
                          <CheckBadgeIcon className="w-4 h-4 text-blue-500 inline ml-1" />
                        )}
                      </h3>
                      {contact.unread > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {contact.lastMessage || contact.username || contact.swargNumber}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.online ? 'Online' : contact.lastSeen}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No contacts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'Try a different search' : 'Add contacts to start chatting'}
            </p>
            <button
              onClick={onAddContact}
              className="btn-secondary"
            >
              Add Contact
            </button>
          </div>
        )}
      </div>

      {/* Contacts Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {filteredContacts.length} contacts
          </span>
          <span className="text-green-500 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {contacts.filter(c => c.online).length} online
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
