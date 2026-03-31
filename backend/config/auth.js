const supabase = require('../config/supabase');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autentificare lipsă' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalid sau expirat' });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error('[AUTH] Token verification error:', err.message);
    res.status(401).json({ error: 'Eroare de autentificare' });
  }
}

module.exports = { verifyToken };