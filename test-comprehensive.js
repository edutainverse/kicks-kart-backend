import fetch from 'node-fetch';

async function testHealthAndLogin() {
  console.log('=== Testing Health Endpoint ===');
  try {
    const healthResponse = await fetch('http://localhost:4000/health');
    console.log('Health Status:', healthResponse.status);
    const healthData = await healthResponse.text();
    console.log('Health Response:', healthData);
  } catch (error) {
    console.error('Health Error:', error.message);
  }

  console.log('\n=== Testing Login Endpoint ===');
  try {
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@kickskart.local',
        password: 'User@123'
      })
    });

    console.log('Login Status:', loginResponse.status);
    console.log('Login Content-Type:', loginResponse.headers.get('content-type'));
    
    const loginText = await loginResponse.text();
    console.log('Login Response:', loginText);
    
  } catch (error) {
    console.error('Login Error:', error.message);
  }

  console.log('\n=== Testing with invalid JSON ===');
  try {
    const invalidResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });

    console.log('Invalid JSON Status:', invalidResponse.status);
    const invalidText = await invalidResponse.text();
    console.log('Invalid JSON Response:', invalidText);
    
  } catch (error) {
    console.error('Invalid JSON Error:', error.message);
  }
}

testHealthAndLogin();
