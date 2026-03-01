require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Neon database connection
const sql = neon(process.env.DATABASE_URL);

// ── Pricing ──
const PRICING = {
  day: 15,     // ฿15 per day
  month: 299,    // ฿299 per month
  year: 2999    // ฿2,999 per year
};

// Initialize database
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        duration INTEGER NOT NULL DEFAULT 1,
        price_paid DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL DEFAULT CURRENT_DATE,
        end_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        membership_id INTEGER REFERENCES memberships(id),
        amount DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(20) NOT NULL DEFAULT 'subscription',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✅ Database initialized — all tables ready');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
}

// ──────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql`
      INSERT INTO users (first_name, last_name, email, phone, address, password)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${hashedPassword})
    `;

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ──────────────────────────────────────────────
// Membership Routes
// ──────────────────────────────────────────────

// POST /api/membership — Apply for a membership
app.post('/api/membership', async (req, res) => {
  try {
    const { userId, type, duration } = req.body;

    if (!userId || !type || !duration) {
      return res.status(400).json({ error: 'userId, type, and duration are required.' });
    }

    if (!['day', 'month', 'year'].includes(type)) {
      return res.status(400).json({ error: 'Type must be day, month, or year.' });
    }

    if (duration < 1 || !Number.isInteger(Number(duration))) {
      return res.status(400).json({ error: 'Duration must be a positive integer.' });
    }

    // Check for existing active membership
    const existing = await sql`
      SELECT id FROM memberships
      WHERE user_id = ${userId} AND status = 'active' AND end_date >= CURRENT_DATE
    `;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'You already have an active membership.' });
    }

    // Calculate price and end date
    const unitPrice = PRICING[type];
    const totalPrice = unitPrice * Number(duration);

    let endDateExpr;
    if (type === 'day') {
      endDateExpr = `CURRENT_DATE + INTERVAL '${Number(duration)} days'`;
    } else if (type === 'month') {
      endDateExpr = `CURRENT_DATE + INTERVAL '${Number(duration)} months'`;
    } else {
      endDateExpr = `CURRENT_DATE + INTERVAL '${Number(duration)} years'`;
    }

    // Insert membership
    const membership = await sql`
      INSERT INTO memberships (user_id, type, duration, price_paid, end_date)
      VALUES (${userId}, ${type}, ${Number(duration)}, ${totalPrice},
              CURRENT_DATE + ${type === 'day' ? sql`CAST(${Number(duration)} || ' days' AS INTERVAL)` :
        type === 'month' ? sql`CAST(${Number(duration)} || ' months' AS INTERVAL)` :
          sql`CAST(${Number(duration)} || ' years' AS INTERVAL)`})
      RETURNING *
    `;

    // Record the payment
    await sql`
      INSERT INTO payments (user_id, membership_id, amount, payment_type)
      VALUES (${userId}, ${membership[0].id}, ${totalPrice}, 'subscription')
    `;

    res.status(201).json({
      message: 'Membership activated successfully!',
      membership: membership[0]
    });
  } catch (err) {
    console.error('Membership error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/membership/:userId — Get user's active membership + payments
app.get('/api/membership/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get active membership
    const memberships = await sql`
      SELECT * FROM memberships
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    // Get payment history
    const payments = await sql`
      SELECT * FROM payments
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({
      membership: memberships.length > 0 ? memberships[0] : null,
      payments
    });
  } catch (err) {
    console.error('Get membership error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/payment — Make a deposit
app.post('/api/payment', async (req, res) => {
  try {
    const { userId, membershipId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount are required.' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    const payment = await sql`
      INSERT INTO payments (user_id, membership_id, amount, payment_type)
      VALUES (${userId}, ${membershipId || null}, ${Number(amount)}, 'deposit')
      RETURNING *
    `;

    res.status(201).json({
      message: 'Payment recorded successfully!',
      payment: payment[0]
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/pricing — Return pricing info
app.get('/api/pricing', (req, res) => {
  res.json(PRICING);
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
