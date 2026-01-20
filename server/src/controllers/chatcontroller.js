// server/src/controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');
const crypto = require('crypto');

// Encryption utilities
const encryptMessage = (text, key, iv) => {
  // AES-256-GCM encryption
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return { encrypted, authTag };
};

const decryptMessage = (encrypted, key, iv, authTag) => {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// @desc    Send message to user
// @route   POST /api/chats/messages/user/:userId
// @access  Private
exports.sendMessageToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { content, type = 'text', media, replyTo, encryptedContent, encryptionKey, iv } = req.body;
    
    // Check if receiver exists
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }
    
    // Check if blocked
    const sender = await User.findById(req.user.id);
    if (sender.blockedUsers.includes(userId) || receiver.blockedUsers.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot send message to this user'
      });
    }
    
    // Generate message ID for signature
    const messageId = crypto.randomBytes(16).toString('hex');
    
    // Create signature
    const signature = crypto.createHmac('sha256', process.env.ENCRYPTION_SECRET)
      .update(messageId + Date.now())
      .digest('hex');
    
    // Create message
    const message = await Message.create({
      sender: req.user.id,
      receiverType: 'user',
      receiverId: userId,
      type,
      content: type === 'text' ? content : undefined,
      media: media ? {
        url: media.url,
        thumbnail: media.thumbnail,
        size: media.size,
        duration: media.duration,
        fileName: media.fileName,
        mimeType: media.mimeType,
        dimensions: media.dimensions
      } : undefined,
      replyTo,
      encryptedContent,
      encryptionKey,
      iv,
      signature,
      status: 'sent'
    });
    
    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name username profilePic')
      .populate('replyTo', 'content type sender');
    
    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message to group
// @route   POST /api/chats/messages/group/:groupId
// @access  Private
exports.sendMessageToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { content, type = 'text', media, replyTo, encryptedContent, encryptionKey, iv } = req.body;
    
    // Check if group exists and user is member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    if (!group.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }
    
    // Check group settings
    if (group.settings.sendMessages === 'admins' && !group.isAdmin(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send messages in this group'
      });
    }
    
    // Generate message ID for signature
    const messageId = crypto.randomBytes(16).toString('hex');
    
    // Create signature
    const signature = crypto.createHmac('sha256', process.env.ENCRYPTION_SECRET)
      .update(messageId + Date.now())
      .digest('hex');
    
    // Create message
    const message = await Message.create({
      sender: req.user.id,
      receiverType: 'group',
      receiverId: groupId,
      type,
      content: type === 'text' ? content : undefined,
      media: media ? {
        url: media.url,
        thumbnail: media.thumbnail,
        size: media.size,
        duration: media.duration,
        fileName: media.fileName,
        mimeType: media.mimeType,
        dimensions: media.dimensions
      } : undefined,
      replyTo,
      encryptedContent,
      encryptionKey,
      iv,
      signature,
      status: 'sent'
    });
    
    // Update group last message and activity
    group.lastMessage = message._id;
    group.lastActivity = new Date();
    group.messageCount += 1;
    await group.save();
    
    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name username profilePic')
      .populate('replyTo', 'content type sender');
    
    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation with user
// @route   GET /api/chats/conversation/:userId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50, before, after } = req.query;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get messages
    const messages = await Message.getConversation(req.user.id, userId, {
      limit: parseInt(limit),
      before,
      after,
      type: 'user'
    });
    
    // Get conversation info
    const conversationInfo = {
      user: user.getSafeUser(),
      unreadCount: await Message.getUnreadCount(req.user.id, userId),
      lastMessage: messages[0] || null
    };
    
    res.status(200).json({
      success: true,
      conversation: conversationInfo,
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group messages
// @route   GET /api/chats/group/:groupId/messages
// @access  Private
exports.getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { limit = 50, before, after } = req.query;
    
    // Check if group exists and user is member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    if (!group.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }
    
    // Get messages
    const messages = await Message.find({
      receiverType: 'group',
      receiverId: groupId,
      deletedFor: { $ne: req.user.id }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .populate('sender', 'name username profilePic')
    .populate('replyTo', 'content type sender')
    .populate('reactions.user', 'name username profilePic');
    
    // Mark messages as delivered
    const unreadMessages = messages.filter(msg => 
      msg.sender._id.toString() !== req.user.id.toString() && 
      msg.status === 'sent'
    );
    
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(msg => msg._id) },
          status: 'sent'
        },
        { $set: { status: 'delivered', deliveredAt: new Date() } }
      );
    }
    
    res.status(200).json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        profilePic: group.profilePic,
        memberCount: group.memberCount
      },
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/messages/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { messageIds, userId } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({
        success: false,
        message: 'Message IDs are required'
      });
    }
    
    // Mark messages as read
    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: req.user.id,
        receiverType: 'user',
        sender: userId
      },
      { 
        $set: { 
          status: 'read',
          readAt: new Date()
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reaction to message
// @route   POST /api/chats/messages/:messageId/reaction
// @access  Private
exports.addReaction = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Check if user can see the message
    if (message.receiverType === 'user') {
      if (![message.sender.toString(), message.receiverId.toString()].includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot react to this message'
        });
      }
    } else {
      // For groups, check if user is member
      const group = await Group.findById(message.receiverId);
      if (!group || !group.isMember(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot react to this message'
        });
      }
    }
    
    await message.addReaction(req.user.id, emoji);
    
    // Get updated message
    const updatedMessage = await Message.findById(messageId)
      .populate('reactions.user', 'name username profilePic');
    
    res.status(200).json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove reaction from message
// @route   DELETE /api/chats/messages/:messageId/reaction
// @access  Private
exports.removeReaction = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await message.removeReaction(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Reaction removed'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message for me
// @route   DELETE /api/chats/messages/:messageId/forme
// @access  Private
exports.deleteMessageForMe = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Check if user is sender or receiver
    const canDelete = message.sender.toString() === req.user.id || 
                     (message.receiverType === 'user' && message.receiverId.toString() === req.user.id);
    
    if (!canDelete) {
      // For groups, check if member
      if (message.receiverType === 'group') {
        const group = await Group.findById(message.receiverId);
        if (!group || !group.isMember(req.user.id)) {
          return res.status(403).json({
            success: false,
            message: 'You cannot delete this message'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You cannot delete this message'
        });
      }
    }
    
    // Delete for user
    await message.deleteForUser(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Message deleted for you'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message for everyone
// @route   DELETE /api/chats/messages/:messageId/foreveryone
// @access  Private
exports.deleteMessageForEveryone = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Check if user is sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can delete messages for everyone'
      });
    }
    
    // Check time limit (15 minutes)
    const timeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (Date.now() - message.timestamp > timeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Messages can only be deleted within 15 minutes of sending'
      });
    }
    
    // Mark as deleted
    message.isDeleted = true;
    await message.save();
    
    res.status(200).json({
      success: true,
      message: 'Message deleted for everyone'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread messages count
// @route   GET /api/chats/unread
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    // Get unread messages from users
    const unreadUserMessages = await Message.aggregate([
      {
        $match: {
          receiverId: req.user.id,
          receiverType: 'user',
          status: { $in: ['sent', 'delivered'] }
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get unread messages from groups
    const userGroups = await Group.find({ 'members.user': req.user.id });
    const groupIds = userGroups.map(g => g._id);
    
    const unreadGroupMessages = await Message.aggregate([
      {
        $match: {
          receiverId: { $in: groupIds },
          receiverType: 'group',
          status: { $in: ['sent', 'delivered'] }
        }
      },
      {
        $group: {
          _id: '$receiverId',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get user details for unread messages
    const userIds = unreadUserMessages.map(msg => msg._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name username profilePic');
    
    // Get group details for unread messages
    const groupIdMap = unreadGroupMessages.reduce((map, msg) => {
      map[msg._id.toString()] = msg.count;
      return map;
    }, {});
    
    const groupsWithUnread = userGroups.filter(g => groupIdMap[g._id.toString()])
      .map(g => ({
        _id: g._id,
        name: g.name,
        profilePic: g.profilePic,
        unreadCount: groupIdMap[g._id.toString()]
      }));
    
    res.status(200).json({
      success: true,
      totalUnread: unreadUserMessages.reduce((sum, msg) => sum + msg.count, 0) +
                   unreadGroupMessages.reduce((sum, msg) => sum + msg.count, 0),
      byUsers: unreadUserMessages.map(msg => ({
        userId: msg._id,
        count: msg.count,
        user: users.find(u => u._id.toString() === msg._id.toString())
      })),
      byGroups: groupsWithUnread
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent conversations
// @route   GET /api/chats/conversations
// @access  Private
exports.getRecentConversations = async (req, res, next) => {
  try {
    // Get recent messages with users
    const recentUserMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.id, receiverType: 'user' },
            { receiverId: req.user.id, receiverType: 'user' }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.id] },
              '$receiverId',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      },
      {
        $limit: 50
      }
    ]);
    
    // Get user details
    const userIds = recentUserMessages.map(msg => msg._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name username profilePic status lastSeen privacy');
    
    // Format conversations
    const conversations = await Promise.all(
      recentUserMessages.map(async (msg) => {
        const user = users.find(u => u._id.toString() === msg._id.toString());
        if (!user) return null;
        
        // Get unread count
        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiverId: req.user.id,
          receiverType: 'user',
          status: { $in: ['sent', 'delivered'] }
        });
        
        // Check privacy settings
        let userData = user.toObject();
        if (user.privacy.status === 'contacts' && !user.contacts.includes(req.user.id)) {
          userData.status = null;
        }
        if (user.privacy.lastSeen === 'contacts' && !user.contacts.includes(req.user.id)) {
          userData.lastSeen = null;
          userData.isOnline = null;
        }
        
        return {
          type: 'user',
          user: userData,
          lastMessage: msg.lastMessage,
          unreadCount,
          timestamp: msg.lastMessage.timestamp
        };
      })
    );
    
    // Get recent group messages
    const userGroups = await Group.find({ 'members.user': req.user.id });
    const groupIds = userGroups.map(g => g._id);
    
    const recentGroupMessages = await Message.aggregate([
      {
        $match: {
          receiverId: { $in: groupIds },
          receiverType: 'group'
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$receiverId',
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);
    
    // Format group conversations
    const groupConversations = await Promise.all(
      recentGroupMessages.map(async (msg) => {
        const group = userGroups.find(g => g._id.toString() === msg._id.toString());
        if (!group) return null;
        
        // Get unread count
        const unreadCount = await Message.countDocuments({
          receiverId: group._id,
          receiverType: 'group',
          sender: { $ne: req.user.id },
          status: { $in: ['sent', 'delivered'] }
        });
        
        return {
          type: 'group',
          group: {
            _id: group._id,
            name: group.name,
            profilePic: group.profilePic,
            memberCount: group.memberCount,
            onlineCount: await group.onlineCount
          },
          lastMessage: msg.lastMessage,
          unreadCount,
          timestamp: msg.lastMessage.timestamp
        };
      })
    );
    
    // Combine and sort all conversations
    const allConversations = [...conversations.filter(c => c), ...groupConversations.filter(c => c)]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.status(200).json({
      success: true,
      count: allConversations.length,
      conversations: allConversations
    });
  } catch (error) {
    next(error);
  }
};
