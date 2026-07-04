const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { zakatSchema } = require('../validators');


/**
 * POST /api/shariah/zakat
 * Calculates Zakat based on financial data with dynamic Nisab.
 */
router.post('/zakat', authMiddleware, validate(zakatSchema), async (req, res) => {
  const { savings, gold, silver, investments, liabilities, userId } = req.body;
  const totalAssets = Number(savings || 0) + Number(gold || 0) + Number(silver || 0) + Number(investments || 0);
  const netWealth = totalAssets - Number(liabilities || 0);

  let goldPricePerGram = 78.50;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch('https://api.metals.dev/v1/latest?base=USD&symbols=XAU', { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);
    if (response && response.ok) {
      const data = await response.json();
      if (data.rates && data.rates.XAU) goldPricePerGram = Number(data.rates.XAU) / 31.1035;
    }
  } catch (error) { /* Fallback used */ }

  const nisabThreshold = goldPricePerGram * 85;
  const eligible = netWealth >= nisabThreshold;
  const zakatDue = eligible ? netWealth * 0.025 : 0;

  if (userId) {
    try {
      await db.query(`INSERT INTO advice (user_id, advice_type, description) VALUES ($1, 'zakat', $2)`, [userId, `Zakat calculation: Net wealth = $${netWealth.toFixed(2)}, Zakat due = $${zakatDue.toFixed(2)}`]);
    } catch (error) {}
  }

  res.json({ success: true, eligible, netWealth, zakatDue, message: eligible ? `You are eligible for Zakat. Your estimated Zakat is $${zakatDue.toFixed(2)}.` : `Your net wealth is below the Nisab threshold. No Zakat is due.` });
});

router.get('/rules', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shariah_rules ORDER BY category, rule_id');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
