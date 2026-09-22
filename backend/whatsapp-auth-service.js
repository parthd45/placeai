/**
 * WhatsApp OTP Authentication Service for PlaceAI
 * 
 * Interacts with /api/whatsapp-otp/send and /api/whatsapp-otp/verify
 */

(function () {
  'use strict';

  let currentPhone = '';
  let currentSessionToken = '';
  let localFallbackCode = '';

  /**
   * Format phone number to international E.164 format (+91 for India by default)
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
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return '+91' + cleaned.substring(1);
    }
    if (/^\d{10}$/.test(cleaned)) {
      return '+91' + cleaned;
    }
    return '+' + cleaned;
  }

  /**
   * Send WhatsApp OTP
   * @param {string} phoneNumber - User's mobile number
   * @returns {Promise<Object>} Result object
   */
  async function sendWhatsAppOTP(phoneNumber) {
    if (!phoneNumber) {
      return { success: false, error: 'Please enter a valid mobile number.' };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!/^\+[1-9]\d{6,14}$/.test(formattedPhone)) {
      return {
        success: false,
        error: 'Invalid mobile number. Please enter a valid 10-digit number.'
      };
    }

    currentPhone = formattedPhone;

    try {
      console.log(`Requesting WhatsApp OTP for ${formattedPhone}...`);

      const response = await fetch('/api/whatsapp-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to send WhatsApp OTP`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send WhatsApp message.');
      }

      currentSessionToken = data.sessionToken || '';

      if (data.isDemoMode && data.demoCode) {
        console.log(`%c[PlaceAI Demo] Your WhatsApp OTP is: ${data.demoCode}`, 'color: #25D366; font-size: 16px; font-weight: bold;');
      }

      return {
        success: true,
        formattedPhone: formattedPhone,
        isDemoMode: !!data.isDemoMode,
        demoCode: data.demoCode,
        message: data.message || `OTP sent to your WhatsApp at ${formattedPhone}!`
      };
    } catch (networkError) {
      console.warn('Backend API request error, checking local fallback:', networkError);

      // Local fallback for testing when running outside Vercel (e.g. file:// or basic live server)
      if (window.WHATSAPP_CONFIG?.enableLocalDemoFallback) {
        localFallbackCode = '123456';
        currentSessionToken = 'local_session_' + Date.now();
        console.log(`%c[Local Preview] Testing code is: 123456`, 'color: #25D366; font-size: 14px;');

        return {
          success: true,
          formattedPhone: formattedPhone,
          isDemoMode: true,
          demoCode: '123456',
          message: `[Preview Mode] WhatsApp OTP sent! (Use test code: 123456)`
        };
      }

      return {
        success: false,
        error: networkError.message || 'Unable to connect to WhatsApp OTP service.'
      };
    }
  }

  /**
   * Verify WhatsApp 6-digit OTP code
   * @param {string} otpCode - 6-digit code
   * @returns {Promise<Object>} Result object
   */
  async function verifyWhatsAppOTP(otpCode) {
    const cleanCode = (otpCode || '').toString().trim();

    if (cleanCode.length !== 6) {
      return { success: false, error: 'Please enter the complete 6-digit verification code.' };
    }

    if (!currentPhone) {
      return { success: false, error: 'No active session. Please request a new WhatsApp OTP first.' };
    }

    // Local fallback check
    if (localFallbackCode && cleanCode === localFallbackCode) {
      return {
        success: true,
        verified: true,
        phoneNumber: currentPhone,
        message: 'WhatsApp number verified successfully!'
      };
    }

    try {
      const response = await fetch('/api/whatsapp-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhone,
          otp: cleanCode,
          sessionToken: currentSessionToken
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired verification code.');
      }

      return {
        success: true,
        verified: true,
        phoneNumber: currentPhone,
        message: 'WhatsApp number verified successfully!'
      };
    } catch (error) {
      console.error('Error verifying WhatsApp OTP:', error);
      return {
        success: false,
        error: error.message || 'Invalid verification code.'
      };
    }
  }

  function getCurrentPhone() {
    return currentPhone;
  }

  // Export to window
  window.WhatsAppAuthService = {
    formatPhoneNumber,
    sendWhatsAppOTP,
    verifyWhatsAppOTP,
    getCurrentPhone
  };
})();
