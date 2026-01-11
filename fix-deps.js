#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing dependency conflicts...');

try {
  // Remove node_modules and package-lock.json
  console.log('🗑️  Removing node_modules and package-lock.json...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }

  // Clear npm cache
  console.log('🧹 Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Install with legacy peer deps to avoid conflicts
  console.log('📦 Installing dependencies with legacy peer deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  console.log('✅ Dependencies fixed successfully!');
  console.log('🚀 You can now run: npm run build');

} catch (error) {
  console.error('❌ Error fixing dependencies:', error.message);
  console.log('\n💡 Try running these commands manually:');
  console.log('   rm -rf node_modules package-lock.json');
  console.log('   npm cache clean --force');
  console.log('   npm install --legacy-peer-deps');
  process.exit(1);
}