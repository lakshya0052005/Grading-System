// Test the auth controller directly
const { register } = require('./controllers/authController');
const User = require('./models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function testController() {
    try {
        // Set up in-memory MongoDB for testing
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        
        // Mock request and response objects
        const mockReq = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            }
        };
        
        let responseSent = false;
        let responseData = null;
        let responseStatus = null;
        
        const mockRes = {
            status: function(code) {
                responseStatus = code;
                return this;
            },
            json: function(data) {
                responseSent = true;
                responseData = data;
                console.log('Response sent:', data);
            }
        };
        
        console.log('Testing register controller function...');
        await register(mockReq, mockRes);
        
        if (responseSent) {
            console.log('Success: Controller responded properly');
            console.log('Status:', responseStatus);
            console.log('Data:', responseData);
        } else {
            console.log('Error: Controller did not send response');
        }
    } catch (error) {
        console.error('Error in controller test:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (mongoServer) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    }
}

testController();