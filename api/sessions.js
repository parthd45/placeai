/**
 * Vercel Serverless Function: PlaceAI Multi-Device Session Management API
 * Provides unified cross-browser, cross-device session tracking and remote revocation.
 */

const CLOUD_REGISTRY_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a0f92d7a385b7e";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const email = (req.query.email || (req.body && req.body.email) || 'parth.deshmukh@mesimcc.edu.in').toLowerCase().trim();

  try {
    // 1. Fetch current cloud sessions
    let allSessions = [];
    try {
      const cloudRes = await fetch(CLOUD_REGISTRY_URL, { cache: 'no-store' });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json && json.data && Array.isArray(json.data.sessions)) {
          allSessions = json.data.sessions;
        }
      }
    } catch (fetchErr) {
      console.error('Error fetching cloud registry:', fetchErr);
    }

    // GET /api/sessions?email=...
    if (req.method === 'GET') {
      const userSessions = allSessions.filter(
        (s) => s.userEmail && s.userEmail.toLowerCase().trim() === email
      );
      return res.status(200).json({ sessions: userSessions });
    }

    // POST /api/sessions -> register or action
    if (req.method === 'POST') {
      const { action, session, sessionId } = req.body || {};

      if (action === 'register' && session) {
        // Upsert session
        const idx = allSessions.findIndex((s) => s.id === session.id);
        if (idx >= 0) {
          allSessions[idx] = { ...allSessions[idx], ...session, lastActiveAt: new Date().toISOString() };
        } else {
          allSessions.unshift({ ...session, status: 'active', lastActiveAt: new Date().toISOString() });
        }
      } else if (action === 'revoke' && sessionId) {
        const target = allSessions.find(
          (s) => s.id === sessionId && s.userEmail && s.userEmail.toLowerCase().trim() === email
        );
        if (target) {
          target.status = 'revoked';
          target.lastActiveAt = new Date().toISOString();
        }
      } else if (action === 'revoke_all_others' && sessionId) {
        for (const s of allSessions) {
          if (s.userEmail && s.userEmail.toLowerCase().trim() === email && s.id !== sessionId) {
            s.status = 'revoked';
            s.lastActiveAt = new Date().toISOString();
          }
        }
      }

      // Sync back to cloud
      await fetch(CLOUD_REGISTRY_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'PlaceAI_Universal_Sessions_Registry',
          data: {
            updated: new Date().toISOString(),
            sessions: allSessions,
          },
        }),
      });

      const userSessions = allSessions.filter(
        (s) => s.userEmail && s.userEmail.toLowerCase().trim() === email
      );
      return res.status(200).json({ success: true, sessions: userSessions });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal session error' });
  }
};
