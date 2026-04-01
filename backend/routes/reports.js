const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('id, title, type, status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, type, content, zscore_result_id } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id:          req.user.id,
        title:            title || 'Raport EDRI',
        type:             type  || 'zscore',
        content,
        zscore_result_id: zscore_result_id || null,
        status:           'generated',
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
