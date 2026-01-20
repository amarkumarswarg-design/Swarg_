// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  EllipsisHorizontalIcon,
  VideoCameraIcon,
  PhoneIcon,
  UserPlusIcon,
  UsersIcon,
  CameraIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { 
  VideoCameraIcon as VideoCameraSolid,
  PhoneIcon as PhoneSolid
} from '@heroicons/react/24/solid';

// Components
import ContactList from '../components/chat/ContactList';
import MessageBubble from '../components/chat/MessageBubble';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [onlineContacts, setOnlineContacts] = useState(12);
  const [unreadMessages, setUnreadMessages] = useState(5);
  const [isTyping, setIsTyping] = useState(false);

  // Mock data for contacts
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Rajesh Kumar', username: '@rajesh', swargNumber: '+1(672)9061234', avatar: 'R', online: true, lastSeen: '2 min ago', lastMessage: 'Meeting at 3 PM?', unread: 2, time: '10:30 AM' },
    { id: 2, name: 'Priya Sharma', username: '@priya', swargNumber: '+1(672)9065678', avatar: 'P', online: true, lastSeen: 'Online', lastMessage: 'Thanks for the files!', unread: 0, time: '9:45 AM' },
    { id: 3, name: 'Amit Singh', username: '@amit', swargNumber: '+1(672)9069012', avatar: 'A', online: false, lastSeen: '2 hours ago', lastMessage: 'Call me when free', unread: 1, time: 'Yesterday' },
    { id: 4, name: 'Sneha Gupta', username: '@sneha', swargNumber: '+1(672)9063456', avatar: 'S', online: true, lastSeen: 'Online', lastMessage: '🎉 Party tonight!', unread: 0, time: '10:00 AM' },
    { id: 5, name: 'Tech Support', username: '@support', swargNumber: '+1(672)9067890', avatar: 'T', online: true, lastSeen: 'Online', lastMessage: 'Your issue is resolved', unread: 0, time: '9:00 AM' },
    { id: 6, name: 'Family Group', username: '', swargNumber: '', avatar: '👨‍👩‍👧‍👦', online: true, lastSeen: '5 members online', lastMessage: 'Mom: Dinner at 8 PM', unread: 12, time: 'Yesterday', isGroup: true },
  ]);

  // Mock messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hi there! 👋', time: '10:15 AM', status: 'read' },
    { id: 2, sender: 'me', text: 'Hello! How are you?', time: '10:16 AM', status: 'read' },
    { id: 3, sender: 'them', text: 'I\'m good! Just finished the project. What about you?', time: '10:17 AM', status: 'read' },
    { id: 4, sender: 'me', text: 'Working on Swarg Messenger. It\'s going great!', time: '10:18 AM', status: 'read' },
    { id: 5, sender: 'them', text: 'That\'s awesome! When will it launch?', time: '10:19 AM', status: 'read' },
    { id: 6, sender: 'me', text: 'Very soon! All features are working perfectly. 🔥', time: '10:20 AM', status: 'delivered' },
  ]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('swarg_token');
    if (!token) {
      navigate('/login');
      toast.error('Please login first');
    }

    // Set default selected contact
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }

    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && selectedContact) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    }, 10000);

    return () => clearInterval(typingInterval);
  }, []);

  // Handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsTyping(false);
    
    // Mark messages as read
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unread: 0 } : c
    ));
    
    // Update unread count
    setUnreadMessages(prev => Math.max(0, prev - (contact.unread || 0)));
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Simulate reply after 1-3 seconds
    setTimeout(() => {
      const replies = [
        'That sounds great!',
        'I agree with you.',
        'Let me check and get back.',
        'Can we schedule a call?',
        'Thanks for the update! 👍'
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        sender: 'them',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    }, 1000 + Math.random() * 2000);

    setMessage('');
  };

  // Handle key press for Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle voice/video call
  const handleCall = (type) => {
    setIsCallActive(true);
    toast.success(`${type === 'video' ? 'Video' : 'Voice'} call connecting...`);
    
    // Simulate call
    setTimeout(() => {
      setIsCallActive(false);
      toast.success(`Call ended. Duration: 2:30 mins`);
    }, 5000);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.swargNumber.includes(searchQuery)
  );

  // Handle new contact
  const handleAddContact = () => {
    const newContact = {
      id: contacts.length + 1,
      name: 'New Contact',
      username: '@newuser',
      swargNumber: `+1(672)906${1000 + contacts.length}`,
      avatar: 'N',
      online: true,
      lastSeen: 'Just now',
      lastMessage: 'Say hello!',
      unread: 0,
      time: 'Now'
    };
    
    setContacts(prev => [newContact, ...prev]);
    setSelectedContact(newContact);
    toast.success('New contact added!');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* App Logo/Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Swarg Messenger</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                <span>End-to-end encrypted</span>
                <span className="online-indicator"></span>
                <span>{onlineContacts} online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages, contacts..."
              className="input-field pl-10 w-64"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <BellIcon className="h-6 w-6" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Settings */}
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">Amar Kumar</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@amar</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Contacts */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'chats'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'contacts'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'groups'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
          </div>

          {/* New Chat/Contact Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAddContact}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <PencilSquareIcon className="h-5 w-5" />
              New Chat
            </button>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
                  selectedContact?.id === contact.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      contact.online
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {contact.avatar}
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
                        {contact.isGroup && <UsersIcon className="w-4 h-4 inline ml-1" />}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unread > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.username || contact.swargNumber}
                      </span>
                      <span className="text-xs">
                        {contact.online ? (
                          <span className="text-green-500">● Online</span>
                        ) : (
                          <span className="text-gray-500">○ {contact.lastSeen}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Contact Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAddContact}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              Add New Contact
            </button>
          </div>
        </div>

        {/* Right Content - Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedContact.online
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedContact.name}
                      {selectedContact.isGroup && <UsersIcon className="w-5 h-5 inline ml-2" />}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>{selectedContact.username || selectedContact.swargNumber}</span>
                      <span>•</span>
                      <span className={selectedContact.online ? 'text-green-500' : 'text-gray-500'}>
                        {selectedContact.online ? 'Online' : selectedContact.lastSeen}
                      </span>
                      {isTyping && (
                        <span className="text-indigo-500 animate-pulse">
                          typing...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Call Button */}
                  <button
                    onClick={() => handleCall('voice')}
                    className={`p-3 rounded-full ${
                      isCallActive
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isCallActive ? (
                      <PhoneSolid className="h-6 w-6" />
                    ) : (
                      <PhoneIcon className="h-6 w-6" />
                    )}
                  </button>

                  {/* Video Call Button */}
                  <button
                    onClick={() => handleCall('video')}
                    className={`p-3 rounded-full ${
                      isCallActive
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isCallActive ? (
                      <VideoCameraSolid className="h-6 w-6" />
                    ) : (
                      <VideoCameraIcon className="h-6 w-6" />
                    )}
                  </button>

                  {/* More Options */}
                  <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <EllipsisHorizontalIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Encryption Notice */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full">
                      <ShieldCheckIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm text-indigo-700 dar
