// Step 0: Setup
const express = require('express');
const app = express();
const { Client } = require('pg');
const slugify = require('slugify'); // Added for slugifying company names

// Middleware to parse JSON
app.use(express.json());

// Step 1: Database Setup
const db = new Client({
  connectionString: "postgresql://localhost/biztime"
});

db.connect();

// Step 2: Add Company Routes
const companiesRouter = require('./routes/companies');
app.use('/companies', companiesRouter);

// Step 3: Add Invoice Routes
const invoicesRouter = require('./routes/invoices');
app.use('/invoices', invoicesRouter);

// Step 4: Add Industry Routes (Future Study Expansion)
const industriesRouter = require('./routes/industries');
app.use('/industries', industriesRouter);

// Error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message });
});

// routes/industries.js

const industriesRouter = require('./routes/industries');
app.use('/industries', industriesRouter);


// GET /industries: List all industries
industriesRouter.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, industry FROM industries');
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// POST /industries: Add a new industry
industriesRouter.post('/', async (req, res, next) => {
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

// POST /industries/:code/companies: Associate an industry to a company
industriesRouter.post('/:code/companies', async (req, res, next) => {
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
industriesRouter.get('/:code', async (req, res, next) => {
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

module.exports = industriesRouter;

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
