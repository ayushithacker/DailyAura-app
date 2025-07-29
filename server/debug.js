#!/usr/bin/env node

// Debug script for Render deployment issues
console.log("🔍 DailyAura Backend Debug Script");
console.log("==================================");

// Check environment variables
console.log("\n📋 Environment Variables:");
console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("PORT:", process.env.PORT || "not set");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "not set");
console.log("BACKEND_URL:", process.env.BACKEND_URL || "not set");

// Check Node.js version
console.log("\n🟢 Node.js Version:", process.version);

// Check current directory
const fs = require('fs');
const path = require('path');

console.log("\n📁 Current Directory:", process.cwd());
console.log("📁 Directory Contents:");
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`  ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
  });
} catch (error) {
  console.log("❌ Error reading directory:", error.message);
}

// Check if dist folder exists
console.log("\n📦 Build Check:");
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log("✅ dist/ folder exists");
  const distFiles = fs.readdirSync(distPath);
  console.log("📄 dist/ contents:", distFiles);
} else {
  console.log("❌ dist/ folder missing - build may have failed");
}

// Check package.json
console.log("\n📦 Package.json Check:");
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log("✅ package.json is valid");
  console.log("📋 Scripts:", Object.keys(packageJson.scripts || {}));
  console.log("📋 Dependencies:", Object.keys(packageJson.dependencies || {}));
} catch (error) {
  console.log("❌ Error reading package.json:", error.message);
}

console.log("\n�� Debug complete!"); 