/**
 * WhatsApp Cloud API Configuration for PlaceAI
 * 
 * Free WhatsApp Verification is powered by Meta WhatsApp Cloud API.
 * Free tier includes 1,000 free service conversations per month globally.
 * 
 * -------------------------------------------------------------
 * HOW TO GET A PERMANENT SYSTEM USER TOKEN (DOES NOT EXPIRE):
 * -------------------------------------------------------------
 * 1. Go to Meta Business Suite / Business Manager: https://business.facebook.com/settings/system-users
 * 2. Select your Business Account.
 * 3. Under "Users" > "System Users", click "Add".
 * 4. Name it (e.g. "PlaceAI-WhatsApp-Bot") and set Role to "Admin".
 * 5. Click "Generate New Token", select your WhatsApp App.
 * 6. Set Token Expiration to "Never" (Permanent).
 * 7. Check permissions: `whatsapp_business_messaging` and `whatsapp_business_management`.
 * 8. Copy the generated permanent token and paste it below into `accessToken`.
 * 
 * -------------------------------------------------------------
 * FOR FAST 24-HOUR TESTING TOKEN:
 * -------------------------------------------------------------
 * 1. Meta Developers: https://developers.facebook.com/apps/
 * 2. Click your App > WhatsApp > API Setup.
 * 3. Copy "Temporary access token" and "Phone number ID".
 * 4. Paste below into `accessToken` and `phoneNumberId`.
 */

(function () {
  'use strict';

  // Check if credentials are stored in localStorage for quick developer override
  const localSavedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('PLACEAI_WA_ACCESS_TOKEN') : null;
  const localSavedPhoneId = typeof localStorage !== 'undefined' ? localStorage.getItem('PLACEAI_WA_PHONE_ID') : null;

  const config = {
    // Endpoints for Vercel Serverless Function deployment
    sendEndpoint: '/api/whatsapp-otp/send',
    verifyEndpoint: '/api/whatsapp-otp/verify',

    // Meta WhatsApp Cloud API Credentials
    // Update accessToken with your fresh token from developers.facebook.com or System User token
    phoneNumberId: localSavedPhoneId || '1386808957839795',
    accessToken: localSavedToken || 'EABDMDZCECsSwBSto663VDrhFGdZBzqFIZCQCUJB4aa5VRcyK15IZAIzt2AQjZA2eARKqQyvWpQ8nfxKkyuomWJCeVX9o3QvonPCbxKd9vRXtFwfwCI1tyEDHkjqXMxNrV8ue9EHApVtZBJ10B7eLhA1xGNnZAZABAdMNWDoLVCrrZCtekTR8Nc3duwTSrQXpfPnpuKsETGNYkpLZC5QJ92bMY1yAiLddyWT0lYfpAS23O2qgCFmmHzRjznZACfuBL2byJddT9ZCMBLkTOh2jHj8PDxEsce5pVAZDZD',

    // Optional pre-approved template name (leave empty to send direct text message)
    templateName: '',

    // Test Sandbox sender details
    testSenderNumber: '+1 (555) 187-7419',
    activateChatUrl: 'https://wa.me/15551877419?text=Hi',

    // Enable direct client-side Meta Graph API calls when running locally (e.g. Live Server)
    enableDirectMetaFallback: true
  };

  // Global helper to quickly set a new token at runtime in browser console:
  // e.g. PlaceAI_SetWhatsAppToken('EAAB...')
  window.PlaceAI_SetWhatsAppToken = function(newToken, newPhoneId) {
    if (newToken) {
      localStorage.setItem('PLACEAI_WA_ACCESS_TOKEN', newToken.trim());
      config.accessToken = newToken.trim();
      console.log('✅ WhatsApp Access Token updated in localStorage.');
    }
    if (newPhoneId) {
      localStorage.setItem('PLACEAI_WA_PHONE_ID', newPhoneId.trim());
      config.phoneNumberId = newPhoneId.trim();
      console.log('✅ WhatsApp Phone Number ID updated in localStorage.');
    }
    return 'Token configured successfully! Ready to send OTP.';
  };

  window.WHATSAPP_CONFIG = config;
})();
