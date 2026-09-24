/**
 * Vercel Serverless Function: Proxy Supabase Management API
 * Enables secure fetching of a user's real Supabase projects without browser CORS restrictions.
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const token = req.headers.authorization || (req.body && req.body.token) || req.query.token;
    if (!token) {
      return res.status(400).json({ error: 'Supabase access token required' });
    }

    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    const apiRes = await fetch('https://api.supabase.com/v1/projects', {
      method: 'GET',
      headers: {
        'Authorization': cleanToken,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
};
