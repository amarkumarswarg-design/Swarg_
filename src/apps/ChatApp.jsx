import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true, time: '10:00' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = [
      "That's an interesting question! Let me think about that...",
      "Based on my knowledge, I can tell you that...",
      "I understand your concern. Here's what I think...",
      "Great question! Here's some information that might help...",
      "I'm happy to help with that! Here's what you need to know...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: input,
        isBot: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...messages, userMessage]);
      setInput('');
      setIsTyping(true);

      // Simulate AI thinking
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: simulateAIResponse(input),
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Assistant</h1>
            <p className="text-sm text-white/80">Powered by GPT</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.isBot
                  ? 'bg-white shadow-md rounded-tl-none'
                  : 'bg-blue-500 text-white rounded-tr-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.isBot ? (
                  <Bot size={16} className="text-blue-500" />
                ) : (
                  <User size={16} className="text-white/80" />
                )}
                <span className="text-xs opacity-70">{message.time}</span>
              </div>
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-2xl rounded-tl-none p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full border rounded-xl py-3 px-4 pr-12 resize-none focus:outline-none focus:border-blue-500"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                input.trim()
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-200 cursor-not-allowed'
              } transition-colors`}
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          AI responses are simulated for demo purposes
        </p>
      </div>
    </div>
  );
};

export default ChatApp;
