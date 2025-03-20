import readline from 'readline';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Add input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

async function getToken() {
  console.log('Getting token...');
  try {
    // https://openapi.logto.io/authentication
    const tokenResponse = await fetch(`${process.env.LOGTO_ENDPOINT}oidc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.LOGTO_API_APP_ID}:${process.env.LOGTO_API_APP_SECRET}`).toString('base64')}`
      },
      body: `grant_type=client_credentials&resource=${encodeURIComponent(process.env.LOGTO_RESOURCE)}&scope=${encodeURIComponent(process.env.LOGTO_SCOPE)}`
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get token: ${tokenResponse.statusText}`);
    }

    
    const tokenData = await tokenResponse.json();
    console.log('Token received:', tokenData);
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting token:', error.message);
    throw error;
  }
}

async function createUser() {
  try {
    console.log('Creating new user...\n');

    // Get and validate user input
    const username = await new Promise(resolve => {
      rl.question('Enter username (minimum 3 characters, alphanumeric, underscore, hyphen): ', resolve);
    });

    if (!validateUsername(username)) {
      throw new Error('Invalid username format');
    }

    const name = await new Promise(resolve => {
      rl.question('Enter name (minimum 2 characters): ', resolve);
    });

    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    const email = await new Promise(resolve => {
      rl.question('Enter email: ', resolve);
    });

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const password = await new Promise(resolve => {
      rl.question('Enter password (minimum 8 characters): ', resolve);
    });

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    const confirmPassword = await new Promise(resolve => {
      rl.question('Confirm password: ', resolve);
    });

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const phone = await new Promise(resolve => {
      rl.question('Enter phone number (with country code, e.g., +1234567890): ', resolve);
    });

    if (!validatePhone(phone)) {
      throw new Error('Invalid phone number format');
    }

    console.log('\nValidating credentials...');
    const accessToken = await getToken();

    console.log('Creating user account...');
    // https://openapi.logto.io/operation/operation-createuser
    const response = await fetch(`${process.env.LOGTO_ENDPOINT}api/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        username,
        primaryEmail: email,
        primaryPhone: phone,
        password,
        customData: {
          role: 'admin'
        },
        applicationId: process.env.LOGTO_APP_ID
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create user: ${errorData.message || response.statusText}`);
    }

    const userData = await response.json();
    console.log('\n✅ User created successfully!');
    console.log('User ID:', userData.id);
    console.log('Email:', userData.primaryEmail);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

createUser(); 