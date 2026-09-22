/**
 * WhatsApp Cloud API Configuration for PlaceAI
 * 
 * Free WhatsApp Verification is powered by Meta WhatsApp Cloud API.
 * Free tier includes 1,000 free conversations per month globally.
 * 
 * HOW TO GET YOUR META CREDENTIALS:
 * 1. Go to Meta for Developers: https://developers.facebook.com/
 * 2. Log in and click "My Apps" > "Create App".
 * 3. Select App Type: "Other" > Next > "Business".
 * 4. Name your app (e.g., "PlaceAI WhatsApp") and create it.
 * 5. In your App Dashboard, scroll to "Add products to your app" and click "Set up" on WhatsApp.
 * 6. Under "API Setup" in the left sidebar under WhatsApp:
 *    - Copy your "Phone number ID"
 *    - Copy your "Temporary Access Token" (or generate a permanent System User token)
 * 7. In Vercel (Project Settings > Environment Variables) or below, add:
 *    - WHATSAPP_ACCESS_TOKEN
 *    - WHATSAPP_PHONE_NUMBER_ID
 */

(function () {
  'use strict';

  // Client-side endpoint configuration
  const config = {
    sendEndpoint: '/api/whatsapp-otp/send',
    verifyEndpoint: '/api/whatsapp-otp/verify',
    // Fallback demo enabled when no backend API is reachable
    enableLocalDemoFallback: true
  };

  window.WHATSAPP_CONFIG = config;
})();
