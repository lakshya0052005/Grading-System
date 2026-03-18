const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.uploadFile = upload.single('file');

exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, content } = req.body;

        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if assignment is overdue
        const isLate = new Date() > new Date(assignment.dueDate);

        const submission = new Submission({
            assignmentId,
            studentId: req.userId,
            content,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
            fileName: req.file ? req.file.originalname : null,
            lateSubmission: isLate
        });

        await submission.save();

        // Notify teacher about new submission
        try {
            await createNotification(
                assignment.createdBy,
                'new_submission',
                'New Submission Received',
                `A student has submitted for "${assignment.title}".`,
                '/teacher-dashboard',
                req.userId
            );
        } catch (notifError) {
            console.error('Failed to notify teacher:', notifError);
        }

        // Simulated AI Grading Assistant
        setTimeout(async () => {
            try {
                const aiGrade = Math.floor(Math.random() * (95 - 75 + 1)) + 75; // Random grade between 75-95
                const aiFeedback = `AI Assistant: Great work on this submission! Your content is well-structured and addresses the core requirements. Consider refining the conclusion for even better impact. (Simulated AI Analysis)`;

                await Submission.findByIdAndUpdate(submission._id, {
                    grade: aiGrade,
                    feedback: aiFeedback,
                    status: 'graded',
                    gradedAt: Date.now()
                    // In a real app, this would be marked as 'AI Graded' or similar
                });

                await createNotification(
                    req.userId,
                    'submission_graded',
                    'AI Grading Complete',
                    `Your submission for "${assignment.title}" has been analyzed by our AI assistant. Grade: ${aiGrade}%`,
                    '/student-dashboard',
                    null // System generated
                );
            } catch (aiError) {
                console.error('AI Grading simulation failed:', aiError);
            }
        }, 3000); // 3 second delay for "processing"

        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email')
            .populate('gradedBy', 'name');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback, rubricGrades } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                grade,
                feedback,
                rubricGrades,
                status: 'graded',
                gradedAt: Date.now(),
                gradedBy: req.userId
            },
            { new: true }
        ).populate('studentId', 'name email').populate('gradedBy', 'name');

        // Notify student of graded assignment
        try {
            const assignment = await Assignment.findById(submission.assignmentId);
            await createNotification(
                submission.studentId._id,
                'submission_graded',
                'Assignment Graded',
                `Your submission for "${assignment.title}" has been graded: ${grade}%`,
                '/student-dashboard',
                req.userId
            );
        } catch (notifError) {
            console.error('Failed to send grading notification:', notifError);
        }

        res.json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getStudentSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.userId })
            .populate('assignmentId', 'title description dueDate')
            .populate('gradedBy', 'name');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update submission (for revisions)
exports.updateSubmission = async (req, res) => {
    try {
        const { content } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                content,
                revisionCount: { $inc: 1 }
            },
            { new: true }
        );
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete submission
exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get submission by ID
exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('assignmentId', 'title description')
            .populate('studentId', 'name email')
            .populate('gradedBy', 'name');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get submissions by student
exports.getSubmissionsByStudent = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.params.studentId })
            .populate('assignmentId', 'title description')
            .populate('gradedBy', 'name');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return submission for revision
exports.returnSubmission = async (req, res) => {
    try {
        const { feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                status: 'returned',
                feedback: feedback || 'Returned for revision',
                gradedAt: null,
                gradedBy: null
            },
            { new: true }
        ).populate('studentId', 'name email').populate('gradedBy', 'name');
        res.json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};