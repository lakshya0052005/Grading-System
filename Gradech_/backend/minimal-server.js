const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Only register auth route for testing
app.use('/api/auth', require('./routes/auth'));

// Root route
app.get('/', (req, res) => {
    res.send('Minimal API for testing');
});

const PORT = process.env.PORT || 5000;

// For testing with in-memory MongoDB
let mongoServer;

async function startServer() {
    try {
        // Use in-memory MongoDB for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log('Connected to in-memory MongoDB');
        
        app.listen(PORT, () => console.log(`Minimal server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
    process.exit(0);
});