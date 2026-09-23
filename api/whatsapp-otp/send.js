/**
 * Vercel Serverless Function: Send WhatsApp OTP via Meta Cloud API
 * 
 * Generates a 6-digit OTP and dispatches it via WhatsApp Cloud API.
 * Uses an HMAC signature token so OTP verification is stateless and secure.
 */

const crypto = require('crypto');

// Secret key for signing OTP tokens
const OTP_SECRET = process.env.OTP_SECRET || 'placeai_whatsapp_otp_secret_key_2026';

// Meta WhatsApp Cloud API credentials (set in Vercel Environment Variables or fallback to active credentials)
const DEFAULT_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || 'EABDMDZCECsSwBSto663VDrhFGdZBzqFIZCQCUJB4aa5VRcyK15IZAIzt2AQjZA2eARKqQyvWpQ8nfxKkyuomWJCeVX9o3QvonPCbxKd9vRXtFwfwCI1tyEDHkjqXMxNrV8ue9EHApVtZBJ10B7eLhA1xGNnZAZABAdMNWDoLVCrrZCtekTR8Nc3duwTSrQXpfPnpuKsETGNYkpLZC5QJ92bMY1yAiLddyWT0lYfpAS23O2qgCFmmHzRjznZACfuBL2byJddT9ZCMBLkTOh2jHj8PDxEsce5pVAZDZD';
const DEFAULT_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1386808957839795';
const WHATSAPP_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || '';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { phone, accessToken: clientToken, phoneNumberId: clientPhoneId } = req.body || {};

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    // Clean and normalize phone number (e.g. +917028030836)
    let cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, '').trim();
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10) {
        cleanPhone = '+91' + cleanPhone;
      } else {
        cleanPhone = '+' + cleanPhone;
      }
    }

    // Format for WhatsApp API: digits only with country code (e.g. 917028030836)
    const waRecipient = cleanPhone.replace(/[^0-9]/g, '');

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // Create HMAC signature (phone + otp + expiresAt)
    const payload = `${cleanPhone}:${otp}:${expiresAt}`;
    const hash = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
    const sessionToken = `${Buffer.from(`${cleanPhone}:${expiresAt}`).toString('base64')}.${hash}`;

    const activeToken = clientToken !== undefined ? clientToken : DEFAULT_ACCESS_TOKEN;
    const activePhoneId = clientPhoneId !== undefined ? clientPhoneId : DEFAULT_PHONE_NUMBER_ID;

    const isExplicitDemo = activeToken === 'demo' || activeToken === 'DEMO' || !activeToken;

    if (!isExplicitDemo && activeToken && activePhoneId) {
      console.log(`Sending WhatsApp OTP to ${cleanPhone} via Meta Cloud API...`);

      let messagePayload;
      if (WHATSAPP_TEMPLATE_NAME) {
        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: waRecipient,
          type: 'template',
          template: {
            name: WHATSAPP_TEMPLATE_NAME,
            language: { code: 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }]
              }
            ]
          }
        };
      } else {
        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: waRecipient,
          type: 'text',
          text: {
            preview_url: false,
            body: `Your PlaceAI verification code is: *${otp}*.\n\nValid for 5 minutes. Please do not share this code with anyone.`
          }
        };
      }

      const metaResponse = await fetch(
        `https://graph.facebook.com/v20.0/${activePhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messagePayload)
        }
      );

      const metaData = await metaResponse.json();

      if (!metaResponse.ok) {
        console.error('Meta Cloud API Error:', metaData);
        let errorMsg = metaData.error?.message || 'Failed to send WhatsApp message via Meta Cloud API.';
        
        // Provide user-friendly guidance for known Meta error codes
        if (metaData.error?.code === 190) {
          errorMsg = 'Meta WhatsApp Access Token has expired. Please update your token in whatsapp-config.js or Vercel.';
        } else if (metaData.error?.code === 131030) {
          errorMsg = `Recipient number (${cleanPhone}) is not registered in the Meta WhatsApp Sandbox test list. Please add it to "To" numbers in Meta App Dashboard > WhatsApp > API Setup.`;
        }

        return res.status(metaResponse.status).json({
          success: false,
          error: errorMsg,
          details: metaData.error,
          sessionToken: sessionToken,
          fallbackOtp: otp
        });
      }

      console.log('✅ WhatsApp message dispatched successfully via Meta Cloud API:', metaData);

      return res.status(200).json({
        success: true,
        formattedPhone: cleanPhone,
        sessionToken: sessionToken,
        message: `Verification code sent to your WhatsApp at ${cleanPhone}!`
      });
    } else {
      console.log(`[TEST MODE] WhatsApp OTP generated for ${cleanPhone}: ${otp}`);

      return res.status(200).json({
        success: true,
        isDemoMode: true,
        formattedPhone: cleanPhone,
        sessionToken: sessionToken,
        demoCode: otp,
        message: `OTP sent to WhatsApp! Use verification code: ${otp}`
      });
    }
  } catch (error) {
    console.error('Server error sending WhatsApp OTP:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error sending WhatsApp OTP.'
    });
  }
};
