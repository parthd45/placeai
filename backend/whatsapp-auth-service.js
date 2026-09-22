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
      console.warn('Backend endpoint /api/whatsapp-otp/send unavailable, trying direct Meta Cloud API...', networkError);

      const metaCfg = window.WHATSAPP_CONFIG || {};

      // Direct Meta Cloud API dispatch (useful for local development on Live Server)
      if (metaCfg.enableDirectMetaFallback && metaCfg.accessToken && metaCfg.phoneNumberId) {
        try {
          const directOtp = Math.floor(100000 + Math.random() * 900000).toString();
          localFallbackCode = directOtp;
          currentSessionToken = 'direct_session_' + Date.now();
          const recipientDigits = formattedPhone.replace(/[^0-9]/g, '');

          const directRes = await fetch(
            `https://graph.facebook.com/v20.0/${metaCfg.phoneNumberId}/messages`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${metaCfg.accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientDigits,
                type: 'text',
                text: {
                  preview_url: false,
                  body: `Your PlaceAI verification code is: *${directOtp}*.\n\nThis code expires in 5 minutes.`
                }
              })
            }
          );

          const directData = await directRes.json();

          if (directRes.ok) {
            console.log('✅ Direct Meta WhatsApp message accepted:', directData);
            return {
              success: true,
              formattedPhone: formattedPhone,
              message: `Verification code sent to your WhatsApp at ${formattedPhone}!`
            };
          } else {
            console.warn('Direct Meta API returned error:', directData);
            // Fallback for offline/local testing
            return {
              success: true,
              formattedPhone: formattedPhone,
              isDemoMode: true,
              demoCode: directOtp,
              message: `WhatsApp OTP generated: ${directOtp} (If not received, make sure to send 'Hi' to ${metaCfg.testSenderNumber || '+1 555 187-7419'} on WhatsApp first)`
            };
          }
        } catch (directErr) {
          console.error('Direct Meta dispatch error:', directErr);
        }
      }

      // Local preview fallback
      localFallbackCode = '123456';
      currentSessionToken = 'local_session_' + Date.now();
      return {
        success: true,
        formattedPhone: formattedPhone,
        isDemoMode: true,
        demoCode: '123456',
        message: `Verification code: 123456 (Preview mode)`
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
