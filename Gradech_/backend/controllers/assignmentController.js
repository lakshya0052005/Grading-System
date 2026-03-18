const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, rubric, maxPoints, type, instructions, attachments, notifications } = req.body;
        const assignment = new Assignment({
            title,
            description,
            dueDate,
            rubric,
            maxPoints,
            type,
            instructions,
            attachments,
            notifications,
            createdBy: req.userId
        });
        await assignment.save();

        // Notify all students
        try {
            const students = await User.find({ role: 'student' });
            const teacher = await User.findById(req.userId);

            for (const student of students) {
                await createNotification(
                    student._id,
                    'assignment_created',
                    'New Assignment Posted',
                    `${teacher.name} has posted a new assignment: ${title}`,
                    `/student-dashboard`,
                    req.userId
                );
            }
        } catch (notifError) {
            console.error('Failed to send broadcast notifications:', notifError);
        }

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('createdBy', 'name email');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name email');
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, rubric, maxPoints, type, instructions, attachments, notifications } = req.body;
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                dueDate,
                rubric,
                maxPoints,
                type,
                instructions,
                attachments,
                notifications,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assignments by creator
exports.getAssignmentsByCreator = async (req, res) => {
    try {
        const assignments = await Assignment.find({ createdBy: req.userId }).populate('createdBy', 'name email');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assignments by due date range
exports.getAssignmentsByDueDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const assignments = await Assignment.find({
            dueDate: { $gte: startDate, $lte: endDate }
        }).populate('createdBy', 'name email');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};