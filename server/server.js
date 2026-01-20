// server/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const callRoutes = require('./src/routes/callRoutes');

// Import middleware
const { authenticate } = require('./src/middleware/auth');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swarg_messenger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Swarg Messenger API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/chats', authenticate, chatRoutes);
app.use('/api/calls', authenticate, callRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  // Join user room
  socket.on('join-user', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  // Join chat room
  socket.on('join-chat', (chatId) => {
    socket.join(`chat:${chatId}`);
    console.log(`Socket ${socket.id} joined chat: ${chatId}`);
  });
  
  // Send message
  socket.on('send-message', (data) => {
    const { chatId, message, senderId } = data;
    
    // Save message to database (you would implement this)
    
    // Broadcast to chat room
    io.to(`chat:${chatId}`).emit('receive-message', {
      ...message,
      senderId,
      timestamp: new Date()
    });
    
    // Notify user if not in chat
    socket.broadcast.to(`chat:${chatId}`).emit('new-message-notification', {
      chatId,
      message: message.text,
      senderId
    });
  });
  
  // Typing indicator
  socket.on('typing-start', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing-start', { userId });
  });
  
  socket.on('typing-stop', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing-stop', { userId });
  });
  
  // Call signaling
  socket.on('call-initiate', ({ from, to, type }) => {
    io.to(`user:${to}`).emit('incoming-call', {
      from,
      type,
      callId: Date.now().toString()
    });
  });
  
  socket.on('call-accept', ({ callId, to }) => {
    io.to(`user:${to}`).emit('call-accepted', { callId });
  });
  
  socket.on('call-reject', ({ callId, to }) => {
    io.to(`user:${to}`).emit('call-rejected', { callId });
  });
  
  socket.on('call-end', ({ callId, to }) => {
    io.to(`user:${to}`).emit('call-ended', { callId });
  });
  
  // WebRTC signaling
  socket.on('webrtc-offer', (data) => {
    socket.to(data.to).emit('webrtc-offer', data);
  });
  
  socket.on('webrtc-answer', (data) => {
    socket.to(data.to).emit('webrtc-answer', data);
  });
  
  socket.on('webrtc-ice-candidate', (data) => {
    socket.to(data.to).emit('webrtc-ice-candidate', data);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
});
