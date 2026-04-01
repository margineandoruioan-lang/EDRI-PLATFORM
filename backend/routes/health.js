const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'EDRI Backend',
    supabase: 'unknown',
  };
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    status.supabase = error ? 'error' : 'connected';
  } catch (e) {
    status.supabase = 'error';
  }
  res.status(200).json(status);
});

module.exports = router;
