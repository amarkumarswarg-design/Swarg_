// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
  },
  
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Swarg Number
  swargNumber: {
    type: String,
    required: true,
    unique: true,
    immutable: true // Cannot be changed once set
  },
  
  // Profile
  profilePic: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    maxlength: [100, 'Bio cannot exceed 100 characters'],
    default: ''
  },
  
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy'],
    default: 'offline'
  },
  
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  // Theme & Settings
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  
  privacy: {
    lastSeen: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    },
    profilePhoto: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    },
    status: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    }
  },
  
  // Contacts
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Groups
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  loginAlerts: {
    type: Boolean,
    default: true
  },
  
  encryptionKey: {
    publicKey: String,
    privateKey: {
      type: String,
      select: false
    }
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for online status
userSchema.virtual('isOnline').get(function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastSeen > fiveMinutesAgo;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate encryption keys
userSchema.methods.generateEncryptionKeys = function() {
  // Generate RSA keys for end-to-end encryption
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  this.encryptionKey = {
    publicKey,
    privateKey
  };
};

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Clear reset token
userSchema.methods.clearResetToken = function() {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

// Update last seen
userSchema.methods.updateLastSeen = function() {
  this.lastSeen = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Check if user is blocked
userSchema.methods.isBlockedBy = async function(userId) {
  const user = await this.model('User').findById(userId).select('blockedUsers');
  return user && user.blockedUsers.includes(this._id);
};

// Get safe user object (without sensitive data)
userSchema.methods.getSafeUser = function() {
  const user = this.toObject();
  delete user.password;
  delete user.encryptionKey?.privateKey;
  delete user.twoFactorSecret;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

// Static method to find by Swarg number
userSchema.statics.findBySwargNumber = function(swargNumber) {
  return this.findOne({ swargNumber });
};

// Static method to find by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Indexes for faster queries
userSchema.index({ username: 1 });
userSchema.index({ swargNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ 'contacts.user': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
