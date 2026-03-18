const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { auth, authorize } = require('../middleware/auth');

// Submit assignment with file upload support
router.post('/', auth, authorize(['student']), submissionController.uploadFile, submissionController.submitAssignment);

// Get student's submissions
router.get('/student', auth, authorize(['student']), submissionController.getStudentSubmissions);

// Get submissions for a specific assignment (teacher only)
router.get('/assignment/:assignmentId', auth, authorize(['teacher']), submissionController.getSubmissionsByAssignment);

// Grade a submission
router.patch('/:id/grade', auth, authorize(['teacher']), submissionController.gradeSubmission);

// Update a submission (for revisions)
router.put('/:id', auth, authorize(['student']), submissionController.updateSubmission);

// Delete a submission
router.delete('/:id', auth, authorize(['student', 'teacher']), submissionController.deleteSubmission);

// Get submission by ID
router.get('/:id', auth, submissionController.getSubmissionById);

// Get submissions by student (teacher access)
router.get('/student/:studentId', auth, authorize(['teacher']), submissionController.getSubmissionsByStudent);

// Return submission for revision
router.patch('/:id/return', auth, authorize(['teacher']), submissionController.returnSubmission);

module.exports = router;