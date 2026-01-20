// server/src/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender Information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Receiver Information (could be user or group)
  receiverType: {
    type: String,
    enum: ['user', 'group'],
    required: true
  },
  
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  
  // Message Content
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'contact'],
    default: 'text'
  },
  
  content: {
    type: String,
    required: function() {
      return this.type === 'text';
    }
  },
  
  // For media messages
  media: {
    url: String,
    thumbnail: String,
    size: Number,
    duration: Number, // For audio/video
    fileName: String,
    mimeType: String,
    dimensions: {
      width: Number,
      height: Number
    }
  },
  
  // For location messages
  location: {
    lat: Number,
    lng: Number,
    address: String,
    name: String
  },
  
  // For contact messages
  contact: {
    name: String,
    swargNumber: String,
    userId: mongoose.Schema.Types.ObjectId
  },
  
  // Encryption
  encryptedContent: {
    type: String,
    required: true
  },
  
  encryptionKey: {
    type: String, // Encrypted with receiver's public key
    required: true
  },
  
  iv: {
    type: String, // Initialization vector for AES
    required: true
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reply To
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Forwarded
  isForwarded: {
    type: Boolean,
    default: false
  },
  
  // Deleted
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  deliveredAt: Date,
  readAt: Date,
  
  // End-to-end encryption metadata
  encryptionVersion: {
    type: String,
    default: 'AES-256-GCM'
  },
  
  signature: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for receiver
messageSchema.virtual('receiver', {
  ref: function() {
    return this.receiverType === 'user' ? 'User' : 'Group';
  },
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true
});

// Indexes for performance
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ receiverId: 1, receiverType: 1, timestamp: -1 });
messageSchema.index({ 'reactions.user': 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });

// Pre-save middleware
messageSchema.pre('save', function(next) {
  if (this.type !== 'text' && !this.media && !this.location && !this.contact) {
    next(new Error('Non-text messages must have media, location, or contact data'));
  }
  next();
});

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  if (this.status !== 'read') {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add reaction
messageSchema.methods.addReaction = async function(userId, emoji) {
  // Remove existing reaction from same user
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    emoji: emoji
  });
  
  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

// Method to delete for user
messageSchema.methods.deleteForUser = function(userId) {
  if (!this.deletedFor.includes(userId)) {
    this.deletedFor.push(userId);
  }
  return this.save();
};

// Static method to get conversation messages
messageSchema.statics.getConversation = async function(userId1, userId2, options = {}) {
  const {
    limit = 50,
    before = null,
    after = null,
    type = 'user'
  } = options;
  
  const query = {
    receiverType: type,
    $or: [
      { sender: userId1, receiverId: userId2 },
      { sender: userId2, receiverId: userId1 }
    ],
    deletedFor: { $ne: userId1 }
  };
  
  if (before) {
    query.timestamp = { $lt: new Date(before) };
  }
  
  if (after) {
    query.timestamp = { $gt: new Date(after) };
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('sender', 'name username profilePic')
    .populate('replyTo', 'content type sender')
    .populate('reactions.user', 'name username profilePic')
    .lean();
};

// Static method to get unread messages count
messageSchema.statics.getUnreadCount = async function(userId, contactId) {
  return this.countDocuments({
    sender: contactId,
    receiverId: userId,
    receiverType: 'user',
    status: { $in: ['sent', 'delivered'] }
  });
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
