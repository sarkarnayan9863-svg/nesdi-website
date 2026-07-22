const express = require('express');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? null : 'nesfghy#1');
const adminSessions = new Set();

// Set up database
const db = new DatabaseSync(path.join(__dirname, 'database.sqlite'));

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        subject TEXT,
        message TEXT,
        timestamp TEXT
    );
    CREATE TABLE IF NOT EXISTS collaborations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orgName TEXT,
        type TEXT,
        email TEXT,
        phone TEXT,
        message TEXT,
        timestamp TEXT
    );
    CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
app.get('/api/admin/data', adminAuth, (req, res) => {
    try {
        const messages = db.prepare('SELECT * FROM messages ORDER BY id ASC').all();
        const collaborations = db.prepare('SELECT * FROM collaborations ORDER BY id ASC').all();
        const feedbacks = db.prepare('SELECT * FROM feedbacks ORDER BY id ASC').all();
        
        res.json({ messages, collaborations, feedbacks });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- POST endpoints (Public) ---
app.post('/api/messages', (req, res) => {
    const { name, email, phone, subject, message, timestamp } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO messages (name, email, phone, subject, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(name, email, phone, subject, message, timestamp);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/collaborations', (req, res) => {
    const { orgName, type, email, phone, message, timestamp } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO collaborations (orgName, type, email, phone, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(orgName, type, email, phone, message, timestamp);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/feedbacks', (req, res) => {
    const { name, course, internship, duration, rating, text, drawbacks, avatar, timestamp } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO feedbacks (name, course, internship, duration, rating, text, drawbacks, avatar, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(name, course, internship, duration, rating, text, drawbacks, avatar, timestamp);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DELETE endpoints (Admin Only) ---
app.delete('/api/admin/messages/:id', adminAuth, (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
        stmt.run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/collaborations/:id', adminAuth, (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM collaborations WHERE id = ?');
        stmt.run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/feedbacks/:id', adminAuth, (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM feedbacks WHERE id = ?');
        stmt.run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Secure Server running on http://localhost:${port}`);
});
