// Test the login using the same approach as the frontend
const axios = require('axios');

// Create axios instance similar to frontend
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Test login
async function testFrontendLogin() {
    try {
        console.log('Testing login similar to frontend...');
        
        const response = await API.post('/auth/login', {
            email: 'frontend-test@example.com',
            password: 'password123'
        });
        
        console.log('Login successful:', response.data);
        
        // Check if token is in response
        if (response.data.token) {
            console.log('✓ Token received successfully');
            
            // Test that we can use the token for authentication
            API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            // Try to access a protected route
            try {
                const profileResponse = await API.get('/users/profile');
                console.log('✓ Protected route access successful:', profileResponse.data.name);
            } catch (profileError) {
                console.log('⚠ Could not test protected route:', profileError.response?.data?.message || profileError.message);
            }
        } else {
            console.log('⚠ No token in response');
        }
        
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
    }
}

testFrontendLogin();