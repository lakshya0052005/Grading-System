const axios = require('axios');

// Wait function to add delay between requests
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test the complete flow
async function testCompleteFlow() {
    console.log('Testing complete registration and login flow...\n');
    
    try {
        // Step 1: Register a new user
        console.log('Step 1: Registering a new user...');
        const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User Complete',
            email: 'complete-test@example.com',
            password: 'password123',
            role: 'student'
        });
        console.log('✓ Registration successful:', registerResponse.data);
        
        await wait(500); // Small delay to ensure data is saved
        
        // Step 2: Login with the same credentials
        console.log('\nStep 2: Logging in with registered credentials...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'complete-test@example.com',
            password: 'password123'
        });
        console.log('✓ Login successful:', { 
            user: loginResponse.data.user, 
            hasToken: !!loginResponse.data.token 
        });
        
        // Step 3: Test protected route with token
        console.log('\nStep 3: Testing protected route with token...');
        const token = loginResponse.data.token;
        const assignmentsResponse = await axios.get('http://localhost:5000/api/assignments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✓ Protected route access successful:', assignmentsResponse.data);
        
        console.log('\n🎉 All tests passed! The authentication flow is working correctly.');
        console.log('- Registration: ✓');
        console.log('- Login: ✓');
        console.log('- Token authentication: ✓');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testCompleteFlow();