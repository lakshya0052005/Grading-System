const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }, // For now, simple text content or file link
    fileUrl: { type: String, default: null }, // URL to uploaded file
    fileName: { type: String, default: null }, // Original file name
    grade: { type: Number, default: null },
    feedback: { type: String, default: '' },
    rubricGrades: { type: Object, default: {} }, // Detailed rubric grades
    status: { type: String, enum: ['submitted', 'graded', 'returned'], default: 'submitted' },
    submittedAt: { type: Date, default: Date.now },
    gradedAt: { type: Date, default: null },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Teacher who graded
    lateSubmission: { type: Boolean, default: false }, // Whether submission was late
    revisionCount: { type: Number, default: 0 } // Number of revisions
});

module.exports = mongoose.model('Submission', submissionSchema);