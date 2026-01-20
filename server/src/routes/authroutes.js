// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifySwargNumber,
  checkUsername,
  generateEncryptionKeys,
  toggleTwoFactor
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/verifyswarg', verifySwargNumber);
router.post('/checkusername', checkUsername);

// Protected routes
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/generatekeys', protect, generateEncryptionKeys);
router.put('/twofactor', protect, toggleTwoFactor);

module.exports = router;
