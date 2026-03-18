const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/users', require('./routes/admin')); // Using admin routes for user management for now

// Root route
app.get('/', (req, res) => {
    res.send('Online Homework Submission and Grading System API');
});

const PORT = process.env.PORT || 5000;

// For production, use real MongoDB; for development/testing, use in-memory MongoDB
async function startServer() {
    try {
        if (process.env.NODE_ENV === 'production') {
            // Connect to real MongoDB in production
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to MongoDB');
        } else {
            // Use in-memory MongoDB for development/testing
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('Connected to in-memory MongoDB');
        }
        
        // Only start listening if not being required as a module (optional but good practice)
        if (require.main === module || require.main.filename.endsWith('index.js')) {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

module.exports = app;