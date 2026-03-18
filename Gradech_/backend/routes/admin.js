const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', auth, authorize(['teacher', 'admin']), userController.getAllUsers);

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, userController.updateProfile);

// Delete user (Admin only)
router.delete('/:id', auth, authorize(['admin']), userController.deleteUser);

module.exports = router;
