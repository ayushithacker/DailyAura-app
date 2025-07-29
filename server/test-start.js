#!/usr/bin/env node

// Test script to verify server can start
console.log("🧪 Testing server startup...");

// Load environment variables
require('dotenv').config();

// Check required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

console.log("\n📋 Checking required environment variables:");
let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: missing`);
  } else {
    console.log(`✅ ${varName}: present`);
  }
});

if (missingVars.length > 0) {
  console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Test TypeScript compilation
console.log("\n🔨 Testing TypeScript compilation...");
const { execSync } = require('child_process');

try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log("✅ TypeScript compilation successful");
} catch (error) {
  console.log("❌ TypeScript compilation failed");
  process.exit(1);
}

// Test if we can require the main modules
console.log("\n📦 Testing module imports...");
try {
  require('./src/server.ts');
  console.log("✅ Server module can be imported");
} catch (error) {
  console.log("❌ Server module import failed:", error.message);
  process.exit(1);
}

console.log("\n✅ All tests passed! Server should start successfully."); 