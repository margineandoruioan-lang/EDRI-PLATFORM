
const express  = require('express');
const router   = express.Router();
const { calculateZScore } = require('../engine/zscore');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

router.post('/calculate', verifyToken, async (req, res) => {
  try {
    const { companyName, cui, year, financials } = req.body;

    if (!financials) {
      return res.status(400).json({ error: 'Câmpul "financials" este obligatoriu' });
    }

    const requiredFields = [
      'workingCapital', 'totalAssets', 'retainedEarnings',
      'ebit', 'marketValueEquity', 'totalLiabilities', 'revenue'
    ];

    const missing = requiredFields.filter(f => financials[f] === undefined || financials[f] === null);
    if (missing.length > 0) {
      return res.status(400).json({ error: 'Date financiare incomplete', missing });
    }

    const result = calculateZScore(financials);

    const { data: saved, error: dbError } = await supabase
      .from('zscore_results')
      .insert({
        user_id:      req.user.id,
        company_name: companyName || 'N/A',
        cui:          cui         || null,
        year:         year        || new Date().getFullYear(),
        financials,
        score:        result.score,
        zone:         result.zone,
        risk_level:   result.riskLevel,
        breakdown:    result.breakdown,
        weighted:     result.weighted,
      })
      .select()
      .single();

    if (dbError) {
      console.warn('[ZSCORE] DB save warning:', dbError.message);
    }

    res.status(200).json({
      success: true,
      id:      saved?.id || null,
      result,
      company: { name: companyName, cui, year },
    });

  } catch (err) {
    console.error('[ZSCORE] Calculation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('zscore_results')
      .select('id, company_name, cui, year, score, zone, risk_level, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('zscore_results')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Calculul nu a fost găsit' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
