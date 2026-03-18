const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rubric: { type: Object, default: {} }, // Rubric for grading
    maxPoints: { type: Number, default: 100 }, // Maximum points for the assignment
    type: { type: String, enum: ['homework', 'quiz', 'project', 'exam'], default: 'homework' },
    instructions: { type: String, default: '' }, // Additional instructions
    attachments: [{ type: String }], // URLs to attachment files
    notifications: { // Notification settings
        dueDateReminder: { type: Boolean, default: true },
        submissionNotification: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);