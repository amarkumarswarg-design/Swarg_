// server/src/models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    minlength: [1, 'Group name must be at least 1 character'],
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  
  profilePic: {
    type: String,
    default: null
  },
  
  // Group Settings
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  
  inviteLink: {
    type: String,
    unique: true,
    sparse: true
  },
  
  inviteLinkExpires: Date,
  
  // Members
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Settings
  settings: {
    sendMessages: {
      type: String,
      enum: ['all', 'admins'],
      default: 'all'
    },
    editGroupInfo: {
      type: String,
      enum: ['all', 'admins'],
      default: 'admins'
    },
    mediaVisibility: {
      type: Boolean,
      default: true
    },
    encryptionEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Encryption
  encryptionKey: {
    type: String, // Shared encryption key for group (encrypted with each member's public key)
    required: true
  },
  
  // Statistics
  messageCount: {
    type: Number,
    default: 0
  },
  
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for active members count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for online members count
groupSchema.virtual('onlineCount').get(async function() {
  const User = mongoose.model('User');
  const memberIds = this.members.map(m => m.user);
  
  const onlineCount = await User.countDocuments({
    _id: { $in: memberIds },
    lastSeen: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
  });
  
  return onlineCount;
});

// Indexes
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ createdBy: 1 });
groupSchema.index({ lastActivity: -1 });
groupSchema.index({ inviteLink: 1 }, { sparse: true });

// Pre-save middleware
groupSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description')) {
    this.lastActivity = new Date();
  }
  next();
});

// Method to add member
groupSchema.methods.addMember = function(userId, addedById, role = 'member') {
  const existingMember = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this group');
  }
  
  this.members.push({
    user: userId,
    role: role,
    addedBy: addedById,
    joinedAt: new Date()
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => 
    m.user.toString() !== userId.toString()
  );
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to update member role
groupSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  
  if (member) {
    member.role = newRole;
    this.lastActivity = new Date();
    return this.save();
  }
  
  throw new Error('Member not found');
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member && member.role === 'admin';
};

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(m => 
    m.user.toString() === userId.toString()
  );
};

// Method to get member role
groupSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

// Method to generate invite link
groupSchema.methods.generateInviteLink = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.inviteLink = token;
  this.inviteLinkExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return this.save();
};

// Method to revoke invite link
groupSchema.methods.revokeInviteLink = function() {
  this.inviteLink = null;
  this.inviteLinkExpires = null;
  return this.save();
};

// Method to update last activity
groupSchema.methods.updateLastActivity = function() {
  this.lastActivity = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to find groups by user
groupSchema.statics.findByUserId = function(userId) {
  return this.find({
    'members.user': userId,
    isActive: true
  })
  .populate('members.user', 'name username profilePic status')
  .populate('lastMessage')
  .populate('createdBy', 'name username')
  .sort({ lastActivity: -1 });
};

// Static method to find by invite link
groupSchema.statics.findByInviteLink = function(inviteLink) {
  return this.findOne({
    inviteLink: inviteLink,
    inviteLinkExpires: { $gt: new Date() },
    isActive: true
  });
};

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
