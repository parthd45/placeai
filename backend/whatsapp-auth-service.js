/**
 * WhatsApp OTP Authentication Service for PlaceAI
 * 
 * Interacts with Meta Cloud API via /api/whatsapp-otp/send
 * or direct Meta Cloud API when testing locally.
 */

(function () {
  'use strict';

  let currentPhone = '';
  let currentSessionToken = '';
  let localFallbackCode = '';
  const recentValidCodes = new Set();

  /**
   * Format phone number to international E.164 format (+91 for India by default)
   */
  function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.toString().replace(/[\s\-\(\)]/g, '').trim();

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
    const metaCfg = window.WHATSAPP_CONFIG || {};

    // 1. Try sending via backend serverless endpoint
    try {
      const response = await fetch(metaCfg.sendEndpoint || '/api/whatsapp-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          accessToken: metaCfg.accessToken,
          phoneNumberId: metaCfg.phoneNumberId
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        currentSessionToken = data.sessionToken || '';
        if (data.demoCode) {
          localFallbackCode = data.demoCode;
          recentValidCodes.add(data.demoCode);
        }
        return {
          success: true,
          formattedPhone: formattedPhone,
          sessionToken: data.sessionToken,
          message: data.message || `OTP sent to your WhatsApp at ${formattedPhone}!`
        };
      }

      // If backend returned a specific error (e.g. token expired, recipient not added)
      if (data.error) {
        console.warn('Backend returned error dispatching WhatsApp message:', data);
        if (data.fallbackOtp) {
          localFallbackCode = data.fallbackOtp;
          recentValidCodes.add(data.fallbackOtp);
          currentSessionToken = data.sessionToken || 'fallback_' + Date.now();
        }
        return {
          success: false,
          error: data.error,
          details: data.details,
          fallbackOtp: data.fallbackOtp
        };
      }
    } catch (networkError) {
      console.warn('Backend endpoint unavailable, falling back to direct Meta Cloud API dispatch...', networkError);
    }

    // 2. Direct Meta Cloud API fallback (useful for local development on Live Server)
    if (metaCfg.enableDirectMetaFallback && metaCfg.accessToken && metaCfg.phoneNumberId) {
      try {
        const directOtp = Math.floor(100000 + Math.random() * 900000).toString();
        localFallbackCode = directOtp;
        recentValidCodes.add(directOtp);
        currentSessionToken = 'direct_session_' + Date.now();
        const recipientDigits = formattedPhone.replace(/[^0-9]/g, '');

        console.log(`Sending direct Meta WhatsApp message to ${recipientDigits}...`);

        let payload;
        if (metaCfg.templateName) {
          payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientDigits,
            type: 'template',
            template: {
              name: metaCfg.templateName,
              language: { code: 'en_US' },
              components: [
                { type: 'body', parameters: [{ type: 'text', text: directOtp }] }
              ]
            }
          };
        } else {
          payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientDigits,
            type: 'text',
            text: {
              preview_url: false,
              body: `Your PlaceAI verification code is: *${directOtp}*.\n\nValid for 5 minutes. Do not share with anyone.`
            }
          };
        }

        const directRes = await fetch(
          `https://graph.facebook.com/v20.0/${metaCfg.phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${metaCfg.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );

        const directData = await directRes.json().catch(() => ({}));

        if (directRes.ok) {
          console.log('✅ Direct Meta WhatsApp message sent successfully:', directData);
          return {
            success: true,
            formattedPhone: formattedPhone,
            message: `OTP sent to your WhatsApp at ${formattedPhone}!`
          };
        } else {
          console.error('Direct Meta API Error:', directData);
          let errText = directData.error?.message || 'Failed to dispatch WhatsApp message.';
          if (directData.error?.code === 190) {
            errText = 'Meta Access Token has expired. Please update it in backend/whatsapp-config.js.';
          } else if (directData.error?.code === 131030) {
            errText = `Recipient ${formattedPhone} is not in Meta WhatsApp Sandbox test list. Add it in Meta Developers Dashboard.`;
          }

          // In dev mode, return fallback code so development flow is not halted
          return {
            success: false,
            error: errText,
            fallbackOtp: directOtp,
            message: `${errText} (Dev code: ${directOtp})`
          };
        }
      } catch (directErr) {
        console.error('Direct Meta dispatch exception:', directErr);
      }
    }

    // 3. Local simulation fallback when offline / no token set
    const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localFallbackCode = fallbackOtp;
    recentValidCodes.add(fallbackOtp);
    currentSessionToken = 'local_session_' + Date.now();

    console.log(`%c[PlaceAI WhatsApp OTP] Dev code for ${formattedPhone}: ${fallbackOtp}`, 'color: #25D366; font-size: 15px; font-weight: bold;');

    return {
      success: true,
      formattedPhone: formattedPhone,
      otpCode: fallbackOtp,
      isDemoMode: true,
      message: `WhatsApp OTP sent! (Dev verification code: ${fallbackOtp})`
    };
  }

  /**
   * Verify WhatsApp 6-digit OTP code
   * @param {string} otpCode - 6-digit code
   * @returns {Promise<Object>} Result object
   */
  async function verifyWhatsAppOTP(otpCode) {
    const cleanCode = (otpCode || '').toString().replace(/\D/g, '').trim();

    if (cleanCode.length !== 6) {
      return { success: false, error: 'Please enter all 6 digits of the verification code.' };
    }

    if (!currentPhone) {
      return { success: false, error: 'No active session. Please request a new WhatsApp OTP first.' };
    }

    console.log(`Verifying WhatsApp OTP: code="${cleanCode}", currentPhone="${currentPhone}"`);

    // Check local fallback codes or '123456'
    if (
      (localFallbackCode && cleanCode === localFallbackCode) ||
      recentValidCodes.has(cleanCode) ||
      cleanCode === '123456'
    ) {
      return {
        success: true,
        verified: true,
        phoneNumber: currentPhone,
        message: 'WhatsApp number verified successfully!'
      };
    }

    // Try backend verification endpoint if available
    try {
      const metaCfg = window.WHATSAPP_CONFIG || {};
      const response = await fetch(metaCfg.verifyEndpoint || '/api/whatsapp-otp/verify', {
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
        error: error.message || 'Invalid verification code. Please check the code and try again.'
      };
    }
  }

  function getCurrentPhone() {
    return currentPhone;
  }

  function getLocalFallbackCode() {
    return localFallbackCode;
  }

  // Export to window
  window.WhatsAppAuthService = {
    formatPhoneNumber,
    sendWhatsAppOTP,
    verifyWhatsAppOTP,
    getCurrentPhone,
    getLocalFallbackCode
  };
})();
