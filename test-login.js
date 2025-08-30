import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@kickskart.local',
        password: 'User@123'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const result = await response.text();
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
