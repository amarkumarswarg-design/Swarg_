// server/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateSwargNumber } = require('../utils/generateNumber');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Send JWT Response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode)
    .cookie('swarg_token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: user.getSafeUser()
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, username, password, email } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: email?.toLowerCase() }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username.toLowerCase() 
          ? 'Username already taken' 
          : 'Email already registered'
      });
    }
    
    // Generate Swarg number
    const swargNumber = generateSwargNumber();
    
    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email?.toLowerCase(),
      password,
      swargNumber
    });
    
    // Generate encryption keys for the user
    user.generateEncryptionKeys();
    await user.save();
    
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { swargNumber, username, password } = req.body;
    
    // Check if credentials are provided
    if (!password || (!swargNumber && !username)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide credentials'
      });
    }
    
    // Find user by Swarg number or username
    let user;
    if (swargNumber) {
      user = await User.findOne({ swargNumber }).select('+password');
    } else {
      user = await User.findOne({ username: username.toLowerCase() }).select('+password');
    }
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last seen
    await user.updateLastSeen();
    
    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('swarg_token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: user.getSafeUser()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const { name, email, bio, status } = req.body;
    
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (status) fieldsToUpdate.status = status;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      user: user.getSafeUser()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { swargNumber, email } = req.body;
    
    // Find user
    let user;
    if (swargNumber) {
      user = await User.findOne({ swargNumber });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide Swarg number or email'
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    
    // TODO: Send email with reset URL
    // For now, we'll return the token in development
    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
    
    // In production, you would send an email
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset token:', resetToken);
      console.log('Reset URL:', resetUrl);
    }
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      // Remove in production
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    // Clear reset token on error
    if (user) {
      user.clearResetToken();
      await user.save({ validateBeforeSave: false });
    }
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
    
    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Set new password
    user.password = req.body.password;
    user.clearResetToken();
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Swarg number
// @route   POST /api/auth/verifyswarg
// @access  Public
exports.verifySwargNumber = async (req, res, next) => {
  try {
    const { swargNumber } = req.body;
    
    const user = await User.findOne({ swargNumber });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Swarg number not found'
      });
    }
    
    // Return basic user info (without sensitive data)
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        profilePic: user.profilePic,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check username availability
// @route   POST /api/auth/checkusername
// @access  Public
exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    res.status(200).json({
      success: true,
      available: !existingUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate encryption keys
// @route   POST /api/auth/generatekeys
// @access  Private
exports.generateEncryptionKeys = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate new keys
    user.generateEncryptionKeys();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Encryption keys generated successfully',
      publicKey: user.encryptionKey.publicKey
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable/disable two-factor authentication
// @route   PUT /api/auth/twofactor
// @access  Private
exports.toggleTwoFactor = async (req, res, next) => {
  try {
    const { enable } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.twoFactorEnabled = enable === true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: enable ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    next(error);
  }
};
