/**
 * Vercel Serverless Function: Send WhatsApp OTP via Meta Cloud API
 * 
 * Generates a 6-digit OTP and dispatches it via WhatsApp Cloud API.
 * Uses an HMAC signature token so OTP verification is stateless and secure.
 */

const crypto = require('crypto');

// Secret key for signing OTP tokens (set in Vercel Environment Variables or defaults to fallback)
const OTP_SECRET = process.env.OTP_SECRET || 'placeai_whatsapp_otp_secret_key_2026';

// Meta WhatsApp Cloud API credentials (set in Vercel Environment Variables or fallback to config)
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
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
    const { phone } = req.body || {};

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    // Clean and normalize phone number (e.g. +917028030836)
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '').trim();
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10) {
        cleanPhone = '+91' + cleanPhone;
      } else {
        cleanPhone = '+' + cleanPhone;
      }
    }

    // Format for WhatsApp API: digits only with country code (no + sign, e.g. 917028030836)
    const waRecipient = cleanPhone.replace(/[^0-9]/g, '');

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // Create HMAC signature (phone + otp + expiresAt)
    const payload = `${cleanPhone}:${otp}:${expiresAt}`;
    const hash = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
    const sessionToken = `${Buffer.from(`${cleanPhone}:${expiresAt}`).toString('base64')}.${hash}`;

    // Check if Meta WhatsApp Cloud API credentials are provided
    const isConfigured = WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID;

    if (isConfigured) {
      console.log(`Sending WhatsApp OTP to ${cleanPhone} via Meta Cloud API...`);

      // Payload for Meta WhatsApp Cloud API
      // If template is specified, use template message; otherwise use session text message
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
        // Standard interactive text message
        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: waRecipient,
          type: 'text',
          text: {
            preview_url: false,
            body: `Your PlaceAI verification code is: *${otp}*.\n\nThis code will expire in 5 minutes. Do not share this code with anyone.`
          }
        };
      }

      const metaResponse = await fetch(
        `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messagePayload)
        }
      );

      const metaData = await metaResponse.json();

      if (!metaResponse.ok) {
        console.error('Meta Cloud API Error:', metaData);
        let errorMsg = metaData.error?.message || 'Failed to send WhatsApp message via Meta Cloud API.';
        return res.status(metaResponse.status).json({
          success: false,
          error: errorMsg,
          details: metaData.error
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
      // Demo / Test Mode: When credentials are not yet configured in environment
      console.log(`[DEMO MODE] WhatsApp OTP generated for ${cleanPhone}: ${otp}`);

      return res.status(200).json({
        success: true,
        isDemoMode: true,
        formattedPhone: cleanPhone,
        sessionToken: sessionToken,
        demoCode: otp, // Provided in demo mode for instant testing before setting Meta keys
        message: `[Demo Mode] OTP sent to WhatsApp! Use verification code: ${otp}`
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
