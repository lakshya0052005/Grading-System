// Test with stack trace
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

let mongoServer;

async function testUserCreation() {
    try {
        // Set up in-memory MongoDB for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        
        console.log('Testing user creation directly...');
        
        // Create a user without using the controller to isolate the issue
        const user = new User({ 
            name: 'Test User',
            email: 'test@example.com', 
            password: 'password123',
            role: 'student'
        });
        
        console.log('About to save user...');
        await user.save();
        console.log('User saved successfully:', user);
        
    } catch (error) {
        console.error('Error in user creation test:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (mongoServer) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    }
}

testUserCreation();