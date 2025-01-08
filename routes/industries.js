const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /industries: List all industries
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, industry FROM industries');
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// POST /industries: Add a new industry
router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const result = await db.query(
      'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry',
      [code, industry]
    );
    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /industries/:code/companies: Associate an industry with a company
router.post('/:code/companies', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { company_code } = req.body;
    const result = await db.query(
      'INSERT INTO company_industries (industry_code, company_code) VALUES ($1, $2) RETURNING industry_code, company_code',
      [code, company_code]
    );
    return res.status(201).json({ association: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// GET /industries/:code: List companies for an industry
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(
      `SELECT i.code, i.industry, c.code AS company_code, c.name AS company_name 
       FROM industries i
       LEFT JOIN company_industries ci ON i.code = ci.industry_code
       LEFT JOIN companies c ON ci.company_code = c.code
       WHERE i.code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Industry not found" });
    }

    const { industry } = result.rows[0];
    const companies = result.rows.map(r => ({ code: r.company_code, name: r.company_name }));
    return res.json({ industry: { code, industry, companies } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
