// server/src/controllers/userController.js
const User = require('../models/User');

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    // Search by username, name, or Swarg number
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { isActive: true },
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
            { swargNumber: { $regex: q } }
          ]
        }
      ]
    })
    .select('name username profilePic status lastSeen swargNumber')
    .limit(parseInt(limit))
    .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name username profilePic bio status lastSeen createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check privacy settings
    const currentUser = await User.findById(req.user.id);
    
    let userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      profilePic: user.profilePic,
      bio: user.bio,
      createdAt: user.createdAt
    };
    
    // Add status based on privacy
    if (user.privacy.status === 'everyone' || 
        (user.privacy.status === 'contacts' && currentUser.contacts.includes(user._id))) {
      userData.status = user.status;
    }
    
    // Add last seen based on privacy
    if (user.privacy.lastSeen === 'everyone' || 
        (user.privacy.lastSeen === 'contacts' && currentUser.contacts.includes(user._id))) {
      userData.lastSeen = user.lastSeen;
      userData.isOnline = user.isOnline;
    }
    
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user public key
// @route   GET /api/users/:id/publickey
// @access  Private
exports.getPublicKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('encryptionKey');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.encryptionKey || !user.encryptionKey.publicKey) {
      return res.status(404).json({
        success: false,
        message: 'Public key not found'
      });
    }
    
    res.status(200).json({
      success: true,
      publicKey: user.encryptionKey.publicKey
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile picture
// @route   PUT /api/users/profilepic
// @access  Private
exports.updateProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // TODO: Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll store the file path
    const profilePic = `/uploads/profile/${req.file.filename}`;
    
    user.profilePic = profilePic;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile picture updated',
      profilePic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update privacy settings
// @route   PUT /api/users/privacy
// @access  Private
exports.updatePrivacy = async (req, res, next) => {
  try {
    const { lastSeen, profilePhoto, status } = req.body;
    
    const updates = {};
    if (lastSeen) updates['privacy.lastSeen'] = lastSeen;
    if (profilePhoto) updates['privacy.profilePhoto'] = profilePhoto;
    if (status) updates['privacy.status'] = status;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      privacy: user.privacy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theme
// @route   PUT /api/users/theme
// @access  Private
exports.updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;
    
    if (!['light', 'dark', 'auto'].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      theme: user.theme
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add contact
// @route   POST /api/users/contacts
// @access  Private
exports.addContact = async (req, res, next) => {
  try {
    const { userId, swargNumber, username } = req.body;
    
    let contactUser;
    
    // Find user by ID, Swarg number, or username
    if (userId) {
      contactUser = await User.findById(userId);
    } else if (swargNumber) {
      contactUser = await User.findOne({ swargNumber });
    } else if (username) {
      contactUser = await User.findOne({ username: username.toLowerCase() });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID, Swarg number, or username'
      });
    }
    
    if (!contactUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already a contact
    const user = await User.findById(req.user.id);
    
    if (user.contacts.includes(contactUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already in your contacts'
      });
    }
    
    // Check if blocked
    if (user.blockedUsers.includes(contactUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have blocked this user'
      });
    }
    
    // Add to contacts
    user.contacts.push(contactUser._id);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Contact added successfully',
      contact: contactUser.getSafeUser()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove contact
// @route   DELETE /api/users/contacts/:id
// @access  Private
exports.removeContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Remove from contacts
    user.contacts = user.contacts.filter(
      contactId => contactId.toString() !== req.params.id
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Contact removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contacts
// @route   GET /api/users/contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('contacts', 'name username profilePic status lastSeen swargNumber')
      .populate('blockedUsers', 'name username');
    
    // Filter based on privacy settings
    const contacts = user.contacts.map(contact => {
      const contactData = contact.toObject();
      
      // Check if we can see status
      if (contact.privacy.status === 'everyone' || 
          (contact.privacy.status === 'contacts' && user.contacts.includes(contact._id))) {
        contactData.status = contact.status;
      } else {
        contactData.status = null;
      }
      
      // Check if we can see last seen
      if (contact.privacy.lastSeen === 'everyone' || 
          (contact.privacy.lastSeen === 'contacts' && user.contacts.includes(contact._id))) {
        contactData.lastSeen = contact.lastSeen;
        contactData.isOnline = contact.isOnline;
      } else {
        contactData.lastSeen = null;
        contactData.isOnline = null;
      }
      
      return contactData;
    });
    
    res.status(200).json({
      success: true,
      contacts,
      blockedUsers: user.blockedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block user
// @route   POST /api/users/block/:id
// @access  Private
exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userToBlock = await User.findById(req.params.id);
    
    if (!userToBlock) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already blocked
    if (user.blockedUsers.includes(userToBlock._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already blocked'
      });
    }
    
    // Add to blocked users
    user.blockedUsers.push(userToBlock._id);
    
    // Remove from contacts if exists
    user.contacts = user.contacts.filter(
      contactId => contactId.toString() !== userToBlock._id.toString()
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unblock user
// @route   POST /api/users/unblock/:id
// @access  Private
exports.unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Remove from blocked users
    user.blockedUsers = user.blockedUsers.filter(
      blockedId => blockedId.toString() !== req.params.id
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get online contacts
// @route   GET /api/users/contacts/online
// @access  Private
exports.getOnlineContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get contacts who were online in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineContacts = await User.find({
      _id: { $in: user.contacts },
      lastSeen: { $gt: fiveMinutesAgo }
    })
    .select('name username profilePic status lastSeen')
    .sort({ lastSeen: -1 });
    
    res.status(200).json({
      success: true,
      count: onlineContacts.length,
      contacts: onlineContacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/users/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['online', 'offline', 'away', 'busy'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        status,
        lastSeen: status === 'offline' ? new Date() : undefined
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      status: user.status,
      lastSeen: user.lastSeen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('contacts')
      .populate('groups');
    
    // Get message counts (you would implement this based on your Message model)
    // const messageCount = await Message.countDocuments({
    //   $or: [
    //     { sender: req.user.id },
    //     { receiverId: req.user.id, receiverType: 'user' }
    //   ]
    // });
    
    res.status(200).json({
      success: true,
      stats: {
        contacts: user.contacts.length,
        groups: user.groups.length,
        // messages: messageCount,
        accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate account
// @route   DELETE /api/users/deactivate
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
  try {
    const { confirm } = req.body;
    
    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: 'Please confirm account deactivation'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Mark as inactive
    user.isActive = false;
    user.status = 'offline';
    await user.save();
    
    // Clear token
    res.cookie('swarg_token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
