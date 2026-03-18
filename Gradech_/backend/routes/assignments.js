const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { auth, authorize } = require('../middleware/auth');

// Get all assignments
router.get('/', auth, assignmentController.getAssignments);

// Get assignment by ID
router.get('/:id', auth, assignmentController.getAssignmentById);

// Create assignment
router.post('/', auth, authorize(['teacher']), assignmentController.createAssignment);

// Update assignment
router.put('/:id', auth, authorize(['teacher']), assignmentController.updateAssignment);

// Delete assignment
router.delete('/:id', auth, authorize(['teacher']), assignmentController.deleteAssignment);

// Get assignments by creator
router.get('/creator/:userId', auth, assignmentController.getAssignmentsByCreator);

// Get assignments by due date range
router.get('/due-date', auth, assignmentController.getAssignmentsByDueDate);

module.exports = router;