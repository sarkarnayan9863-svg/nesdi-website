require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? null : 'nesfghy#1');
const adminSessions = new Set();

// Set up PostgreSQL database connection
// process.env.DATABASE_URL should look like postgres://user:password@host/database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize tables asynchronously
async function initDB() {
    if (!process.env.DATABASE_URL) {
        console.warn("WARNING: No DATABASE_URL found in .env! Database connection will fail.");
        return;
    }
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                phone TEXT,
                subject TEXT,
                message TEXT,
                timestamp TEXT
            );
            CREATE TABLE IF NOT EXISTS collaborations (
                id SERIAL PRIMARY KEY,
                orgName TEXT,
                type TEXT,
                email TEXT,
                phone TEXT,
                message TEXT,
                timestamp TEXT
            );
            CREATE TABLE IF NOT EXISTS feedbacks (
                id SERIAL PRIMARY KEY,
                name TEXT,
                course TEXT,
                internship TEXT,
                duration TEXT,
                rating TEXT,
                text TEXT,
                drawbacks TEXT,
                avatar TEXT,
                timestamp TEXT
            );
        `);
        console.log("PostgreSQL tables initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize PostgreSQL tables. Please check your DATABASE_URL.", err.message);
    }
}
initDB();

app.use(cors());
app.use(express.json());
// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Middleware for Admin Auth
const adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : '';
    if (token && adminSessions.has(token)) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });
    }
};

app.post('/api/admin/login', (req, res) => {
    if (!adminPassword) {
        return res.status(503).json({ error: 'Admin password is not configured.' });
    }

    const { password } = req.body;
    if (!password || password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid admin password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    adminSessions.add(token);
    res.json({ token });
});

// --- GET endpoints ---
// Admin Dashboard endpoints
app.get('/api/admin/data', adminAuth, async (req, res) => {
    try {
        const messagesResult = await pool.query('SELECT * FROM messages ORDER BY id ASC');
        const collaborationsResult = await pool.query('SELECT * FROM collaborations ORDER BY id ASC');
        const feedbacksResult = await pool.query('SELECT * FROM feedbacks ORDER BY id ASC');
        
        res.json({ 
            messages: messagesResult.rows, 
            collaborations: collaborationsResult.rows, 
            feedbacks: feedbacksResult.rows 
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- POST endpoints (Public) ---
app.post('/api/messages', async (req, res) => {
    const { name, email, phone, subject, message, timestamp } = req.body;
    try {
        await pool.query(
            'INSERT INTO messages (name, email, phone, subject, message, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, email, phone, subject, message, timestamp]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/collaborations', async (req, res) => {
    const { orgName, type, email, phone, message, timestamp } = req.body;
    try {
        await pool.query(
            'INSERT INTO collaborations (orgName, type, email, phone, message, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
            [orgName, type, email, phone, message, timestamp]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/feedbacks', async (req, res) => {
    const { name, course, internship, duration, rating, text, drawbacks, avatar, timestamp } = req.body;
    try {
        await pool.query(
            'INSERT INTO feedbacks (name, course, internship, duration, rating, text, drawbacks, avatar, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, course, internship, duration, rating, text, drawbacks, avatar, timestamp]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DELETE endpoints (Admin Only) ---
app.delete('/api/admin/messages/:id', adminAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/collaborations/:id', adminAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM collaborations WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/feedbacks/:id', adminAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM feedbacks WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Secure Server running on port ${port}`);
});
