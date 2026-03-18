// Test the password comparison
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

let mongoServer;

async function testPassword() {
    try {
        // Set up in-memory MongoDB for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        
        console.log('Testing password hashing and comparison...');
        
        // Create a user
        const user = new User({ 
            name: 'Test User',
            email: 'test@example.com', 
            password: 'password123',
            role: 'student'
        });
        
        await user.save();
        console.log('User created and password hashed');
        
        // Test password comparison
        const isCorrect = await user.comparePassword('password123');
        console.log('Password comparison (correct):', isCorrect);
        
        const isIncorrect = await user.comparePassword('wrongpassword');
        console.log('Password comparison (incorrect):', isIncorrect);
        
    } catch (error) {
        console.error('Error in password test:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (mongoServer) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    }
}

testPassword();