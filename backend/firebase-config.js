/**
 * Firebase Configuration for PlaceAI
 * 
 * Free Mobile OTP Authentication is powered by Firebase Authentication (Phone Auth).
 * Free tier includes up to 10,000 phone verifications / month globally.
 * 
 * HOW TO GET YOUR CREDENTIALS:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project (or select an existing one).
 * 3. In the left sidebar, click "Build" > "Authentication" > "Get started".
 * 4. In the "Sign-in method" tab, click "Phone", toggle "Enable", and click "Save".
 * 5. (Optional but recommended for testing): In the "Phone" provider settings,
 *    expand "Phone numbers for testing" and add a test number (e.g. +91 9999999999 with code 123456).
 *    Test numbers are 100% free and don't consume any quota.
 * 6. Go to "Project Settings" (gear icon) > "General" > "Your apps" > click the Web (</>) icon.
 * 7. Register your app and copy the `firebaseConfig` object into the placeholders below.
 */

(function () {
  'use strict';

  // Your actual Firebase Web App credentials
  const firebaseConfig = {
    apiKey: "AIzaSyAYXSXdudJgvGoBIZMvKtmhBC-liFwDk1o",
    authDomain: "placewise-57c0b.firebaseapp.com",
    projectId: "placewise-57c0b",
    storageBucket: "placewise-57c0b.firebasestorage.app",
    messagingSenderId: "114941779271",
    appId: "1:114941779271:web:5b7c8b39ec7a257dba8062",
    measurementId: "G-K68X7K1DYG"
  };

  /**
   * Helper to verify if user has replaced placeholder credentials
   */
  function isFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           !firebaseConfig.apiKey.includes('YOUR_API_KEY') && 
           firebaseConfig.projectId && 
           !firebaseConfig.projectId.includes('your-project-id');
  }

  // Export to window
  window.FIREBASE_CONFIG = firebaseConfig;
  window.isFirebaseConfigured = isFirebaseConfigured;
})();
