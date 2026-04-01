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
  