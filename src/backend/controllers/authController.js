// controllers/authController.js
const bcrypt = require('bcrypt');
const db = require('../db');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  checkSession: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const [users] = await db.query(
        'SELECT UUID, username, email FROM users WHERE UUID = ?',
        [req.session.userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(users[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      req.session.userId = user.UUID;
      const { password: _, ...userData } = user;
      
      res.json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const [existing] = await db.query('SELECT UUID FROM users WHERE email = ?', [email]);
      
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email already existss' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      await db.query(
        `INSERT INTO user_settings (UUID, theme_table_id, user_type) VALUES (?, 0, 0)`,
        [result.insertId]
      )
      await db.query(
        `INSERT INTO user_warnings (UUID) VALUES (?)`,
        [result.insertId]
      )
      
      res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('sessionId');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  },

  getDashboardData: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Add your actual dashboard data query here
      const dashboardData = {
        message: "Welcome to your dashboard",
        stats: { visits: 150, revenue: 4500 },
        recentActivity: ["Login", "Profile Update"]
      };
      
      res.json(dashboardData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  },
  googleAuth: async (req, res) => {
    const { token } = req.body;
    
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;

      // Check if user exists
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      
      if (users.length === 0) {
        // Create new user if doesn't exist
        const randomPassword = Math.random().toString(36).slice(-10); // Generate random password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        const [result] = await db.query(
          'INSERT INTO users (username, email, password, is_google_user) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, 1]
        );
        
        // Initialize user settings
        await db.query(
          `INSERT INTO user_settings (UUID, theme_table_id, user_type) VALUES (?, 0, 0)`,
          [result.insertId]
        );

        req.session.userId = result.insertId;
        res.json({ id: result.insertId, name, email });
      } else {
        // Login existing user
        const user = users[0];
        req.session.userId = user.UUID;
        const { password, ...userData } = user;
        res.json(userData);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(401).json({ error: 'Google authentication failed' });
    }
  }
};
