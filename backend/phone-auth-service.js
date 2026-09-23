/**
 * Firebase Phone Authentication Service for PlaceAI
 * 
 * Provides:
 * - Invisible reCAPTCHA initialization
 * - Sending SMS OTP via Firebase
 * - Verifying OTP and completing mobile authentication
 */

(function () {
  'use strict';

  let recaptchaVerifier = null;
  let confirmationResult = null;
  let lastPhoneNumber = '';

  /**
   * Initialize Firebase application instance
   */
  function initFirebase() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded.');
      return false;
    }

    if (!firebase.apps.length) {
      if (!window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
        console.warn('Firebase configuration is using placeholder keys. Please update backend/firebase-config.js');
      }
      try {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        console.log('✅ Firebase initialized for Phone Auth');
        return true;
      } catch (err) {
        console.error('Error initializing Firebase:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Format phone number to standard international E.164 format (+[country_code][number])
   * Defaults to +91 (India) if 10 digits are provided without a country code.
   * @param {string} phone
   * @returns {string} E.164 formatted phone number
   */
  function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();

    if (cleaned.startsWith('+')) {
      return cleaned;
    }

    if (cleaned.startsWith('00')) {
      return '+' + cleaned.substring(2);
    }

    // If starts with 0 and 11 digits, assume Indian STD prefix
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return '+91' + cleaned.substring(1);
    }

    // Default to +91 for 10-digit mobile numbers
    if (/^\d{10}$/.test(cleaned)) {
      return '+91' + cleaned;
    }

    // Fallback: prepend + if missing
    return '+' + cleaned;
  }

  /**
   * Setup RecaptchaVerifier
   * @param {string} containerId - DOM ID where reCAPTCHA will attach (or button ID)
   * @param {string} size - 'invisible' or 'normal'
   */
  function setupRecaptcha(containerId = 'recaptcha-container', size = 'invisible') {
    if (!initFirebase()) {
      return null;
    }

    try {
      // If verifier already exists, reuse it
      if (recaptchaVerifier) {
        return recaptchaVerifier;
      }

      // Ensure fresh container exists in DOM (replaces old node to prevent "already rendered" error)
      let oldContainer = document.getElementById(containerId);
      let container = document.createElement('div');
      container.id = containerId;

      if (oldContainer && oldContainer.parentNode) {
        oldContainer.parentNode.replaceChild(container, oldContainer);
      } else {
        document.body.appendChild(container);
      }

      recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
        size: size,
        callback: function (response) {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': function () {
          console.warn('reCAPTCHA expired. Resetting...');
          resetRecaptcha();
        }
      });

      return recaptchaVerifier;
    } catch (error) {
      console.error('Error creating RecaptchaVerifier:', error);
      // Fallback: forcefully replace container and recreate
      try {
        let oldContainer = document.getElementById(containerId);
        if (oldContainer && oldContainer.parentNode) {
          let fresh = document.createElement('div');
          fresh.id = containerId;
          oldContainer.parentNode.replaceChild(fresh, oldContainer);
          recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, { size: size });
          return recaptchaVerifier;
        }
      } catch (innerErr) {
        console.error('Fallback container creation failed:', innerErr);
      }
      return null;
    }
  }

  /**
   * Reset reCAPTCHA widget safely
   */
  function resetRecaptcha() {
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.render().then(widgetId => {
          if (window.grecaptcha && typeof grecaptcha.reset === 'function') {
            grecaptcha.reset(widgetId);
          }
        }).catch(() => {
          recaptchaVerifier = null;
        });
      } catch (e) {
        recaptchaVerifier = null;
      }
    }
  }

  /**
   * Send SMS OTP to the provided phone number
   * @param {string} phoneNumber - Raw phone number
   * @param {string} containerId - Recaptcha container element ID
   * @returns {Promise<Object>} Result object { success: boolean, message?: string, error?: string }
   */
  async function sendPhoneOTP(phoneNumber, containerId = 'recaptcha-container') {
    if (!window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase is not configured yet! Please add your Firebase credentials in backend/firebase-config.js. (See instructions in that file)'
      };
    }

    if (!phoneNumber) {
      return { success: false, error: 'Please enter a valid mobile number.' };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!/^\+[1-9]\d{6,14}$/.test(formattedPhone)) {
      return {
        success: false,
        error: 'Invalid phone number format. Please provide a valid 10-digit mobile number or include country code (e.g. +91 9876543210).'
      };
    }

    try {
      if (!initFirebase()) {
        throw new Error('Failed to initialize Firebase Auth SDK.');
      }

      const verifier = setupRecaptcha(containerId);
      if (!verifier) {
        throw new Error('Failed to initialize reCAPTCHA verifier.');
      }

      console.log(`Sending SMS OTP to ${formattedPhone}...`);
      confirmationResult = await firebase.auth().signInWithPhoneNumber(formattedPhone, verifier);
      lastPhoneNumber = formattedPhone;

      console.log('✅ SMS OTP successfully dispatched.');
      return {
        success: true,
        formattedPhone: formattedPhone,
        message: `OTP sent successfully to ${formattedPhone}. Please check your SMS!`
      };
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      
      // Reset reCAPTCHA on failure
      resetRecaptcha();

      let errorMsg = error.message || 'Failed to send OTP.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMsg = 'Invalid phone number. Please check the country code and number.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many requests. Please wait a few moments before requesting another OTP.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMsg = 'SMS quota exceeded for today. Please try again later or use test credentials.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMsg = 'reCAPTCHA verification failed. Please try again.';
      }

      return {
        success: false,
        error: errorMsg,
        rawError: error
      };
    }
  }

  /**
   * Verify the 6-digit OTP code received by the user
   * @param {string} otpCode - 6-digit SMS verification code
   * @returns {Promise<Object>} Result object { success: boolean, user?: Object, error?: string }
   */
  async function verifyPhoneOTP(otpCode) {
    if (!confirmationResult) {
      return {
        success: false,
        error: 'No active OTP verification session found. Please request a new OTP first.'
      };
    }

    const cleanCode = (otpCode || '').toString().trim();
    if (!cleanCode || cleanCode.length !== 6) {
      return {
        success: false,
        error: 'Please enter the complete 6-digit verification code.'
      };
    }

    try {
      console.log('Verifying OTP code...');
      const userCredential = await confirmationResult.confirm(cleanCode);
      const user = userCredential.user;

      console.log('✅ Phone number verified successfully! Firebase UID:', user.uid);
      return {
        success: true,
        user: user,
        phoneNumber: lastPhoneNumber,
        message: 'Mobile number verified successfully!'
      };
    } catch (error) {
      console.error('Error verifying OTP code:', error);
      let errorMsg = 'Invalid verification code. Please check and try again.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMsg = 'The code you entered is incorrect. Please check your SMS and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMsg = 'This verification code has expired. Please request a new one.';
      }

      return {
        success: false,
        error: errorMsg,
        rawError: error
      };
    }
  }

  /**
   * Get the last successfully formatted phone number
   */
  function getLastPhoneNumber() {
    return lastPhoneNumber;
  }

  // Export to window object
  window.PhoneAuthService = {
    init: initFirebase,
    formatPhoneNumber: formatPhoneNumber,
    setupRecaptcha: setupRecaptcha,
    sendPhoneOTP: sendPhoneOTP,
    verifyPhoneOTP: verifyPhoneOTP,
    getLastPhoneNumber: getLastPhoneNumber,
    hasActiveSession: () => !!confirmationResult
  };

  // Auto-init when script is loaded if Firebase is available
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      initFirebase();
    });
  }
})();
