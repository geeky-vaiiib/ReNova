#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating secure secrets for ReNova deployment...\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const refreshSecret = crypto.randomBytes(32).toString('hex');

console.log('Copy these values to your environment variables:\n');
console.log('JWT_SECRET=' + jwtSecret);
console.log('REFRESH_TOKEN_SECRET=' + refreshSecret);
console.log('\n✅ Secrets generated successfully!');
console.log('\n⚠️  Keep these secrets secure and never commit them to version control.');
