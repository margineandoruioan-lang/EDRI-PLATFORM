const express = require('express');
const router  = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const status = {
    status:    'ok',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
    service:   'EDRI Backend',
    supabase:  'unknown',
  };

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    status.supabase = error ? `error: ${error.message}` : 'connected';
  } catch (e) {
    status.supabase = `error: ${e.message}`;
  }

  const httpStatus = status.supabase.startsWith('error') ? 503 : 200;
  res.status(httpStatus).json(status);
});

module.exports = router;