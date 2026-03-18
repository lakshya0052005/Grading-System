const axios = require('axios');

// Test the registration endpoint
async function testRegister() {
    try {
        console.log('Testing registration endpoint...');
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student'
        });
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
}

// Test the login endpoint
async function testLogin() {
    try {
        console.log('\nTesting login endpoint...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Login successful:', response.data);
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
    }
}

// Run tests
async function runTests() {
    await testRegister();
    const token = await testLogin();
    console.log('\nAPI tests completed.');
    if (token) {
        console.log('Successfully obtained token, authentication is working!');
    }
}

runTests();