const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('👀 PlaceAI Auto-Sync Watcher Started...');
console.log('Any time you save code, the Android app will auto-update!');

let debounceTimer = null;

function syncToAndroid() {
  console.log('🔄 Change detected! Syncing assets to Android...');
  try {
    // 1. Rebundle www directory
    require('./scratch/build_www_bundle.js');
    // 2. Sync to Android
    execSync('npx cap sync android', { stdio: 'inherit' });
    console.log('✅ Android App updated automatically!\n');
  } catch (err) {
    console.error('❌ Error during auto-sync:', err.message);
  }
}

function triggerSync() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    syncToAndroid();
  }, 400);
}

// Watch key files and folders
const rootDir = __dirname;
const watchTargets = [
  'dashboard.html',
  'index.html',
  'login.html',
  'register.html',
  'code-practice.html',
  'resume-analyzer.html',
  'mock-interview.html',
  'css',
  'js',
  'backend'
];

watchTargets.forEach(target => {
  const p = path.join(rootDir, target);
  if (fs.existsSync(p)) {
    fs.watch(p, { recursive: true }, (eventType, filename) => {
      if (filename && !filename.includes('node_modules') && !filename.includes('.git') && !filename.includes('www')) {
        console.log(`📝 File modified: ${target}/${filename}`);
        triggerSync();
      }
    });
  }
});

console.log('🚀 Watching for code updates. Press Ctrl+C to stop.\n');
