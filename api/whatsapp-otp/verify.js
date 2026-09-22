/**
 * Vercel Serverless Function: Verify WhatsApp OTP
 * 
 * Verifies the submitted 6-digit code against the HMAC signature token.
 */

const crypto = require('crypto');

const OTP_SECRET = process.env.OTP_SECRET || 'placeai_whatsapp_otp_secret_key_2026';

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
    const { phone, otp, sessionToken } = req.body || {};

    if (!phone || !otp || !sessionToken) {
      return res.status(400).json({
        success: false,
        error: 'Phone number, OTP code, and session token are required.'
      });
    }

    const cleanCode = otp.toString().trim();
    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP length. Code must be 6 digits.'
      });
    }

    // Split sessionToken into encodedPayload and hash
    const parts = sessionToken.split('.');
    if (parts.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or malformed session token.'
      });
    }

    const [encodedPayload, providedHash] = parts;
    const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const [tokenPhone, expiresAtStr] = decodedPayload.split(':');
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiration
    if (Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new OTP.'
      });
    }

    // Recompute expected HMAC hash with the provided OTP
    const expectedPayload = `${tokenPhone}:${cleanCode}:${expiresAt}`;
    const expectedHash = crypto.createHmac('sha256', OTP_SECRET).update(expectedPayload).digest('hex');

    if (expectedHash !== providedHash) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect verification code. Please check your WhatsApp and try again.'
      });
    }

    console.log(`✅ WhatsApp OTP verified successfully for ${tokenPhone}`);

    return res.status(200).json({
      success: true,
      verified: true,
      phone: tokenPhone,
      message: 'WhatsApp number verified successfully!'
    });
  } catch (error) {
    console.error('Error verifying WhatsApp OTP:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error verifying OTP.'
    });
  }
};
