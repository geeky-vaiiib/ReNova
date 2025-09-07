#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://renova.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://renova-api.onrender.com';

console.log('🔍 Verifying ReNova deployment...\n');

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    }).on('error', reject);
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing API health check...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ Health check passed:', data.message);
      return true;
    } else {
      console.log('❌ Health check failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('🌐 Testing frontend...');
  try {
    const response = await makeRequest(FRONTEND_URL);
    if (response.statusCode === 200) {
      console.log('✅ Frontend is accessible');
      return true;
    } else {
      console.log('❌ Frontend failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend error:', error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('🔌 Testing API endpoints...');
  
  const endpoints = [
    '/api/products',
    '/api/auth/me'
  ];
  
  let passed = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint}`);
      if (response.statusCode < 500) {
        console.log(`✅ ${endpoint} - Status: ${response.statusCode}`);
        passed++;
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  return passed === endpoints.length;
}

// Main verification function
async function verifyDeployment() {
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Backend URL: ${BACKEND_URL}\n`);
  
  const results = {
    health: await testHealthCheck(),
    frontend: await testFrontend(),
    api: await testAPIEndpoints()
  };
  
  console.log('\n📊 Verification Results:');
  console.log('========================');
  console.log(`Health Check: ${results.health ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${results.api ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 Overall Status:');
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED - Deployment is successful! 🎉');
    console.log('\n🔗 Access your application:');
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend: ${BACKEND_URL}`);
    console.log('\n👤 Demo credentials:');
    console.log('Email: demo@renova.com');
    console.log('Password: demo1234');
  } else {
    console.log('❌ SOME TESTS FAILED - Check deployment configuration');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check environment variables');
    console.log('2. Verify database connection');
    console.log('3. Check service logs');
    console.log('4. Ensure CORS is configured correctly');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run verification
verifyDeployment().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
