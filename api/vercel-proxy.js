/**
 * Vercel Serverless Function: Proxy Vercel API
 * Enables querying Vercel projects and deployments.
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
    const endpoint = req.query.endpoint || 'projects'; // 'user', 'projects', or 'deployments'
    
    if (!token) {
      return res.status(400).json({ error: 'Vercel access token required' });
    }

    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    let targetUrl = 'https://api.vercel.com/v9/projects';
    if (endpoint === 'user') targetUrl = 'https://api.vercel.com/v2/user';
    else if (endpoint === 'deployments') targetUrl = 'https://api.vercel.com/v6/deployments?limit=20';

    const apiRes = await fetch(targetUrl, {
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
