require('dotenv').config();
const express = require('express');
cors = require('cors');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const serveStatic = require('serve-static');


// 1. Enhanced Session Store Configuration [1,3](@ref)
const sessionStore = new MySQLStore({
  createDatabaseTable: true,         // Auto-create sessions table
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  },
  expiration: 24 * 60 * 60 * 1000,  // 1 day
  checkExpirationInterval: 900000     // Cleanup every 15 mins
}, db);

// 2. Proper CORS Configuration [6,8](@ref)
const corsOptions = {
  origin: true, //isProduction 
    //? process.env.FRONTEND_PROD_URL 
    //: process.env.FRONTEND_DEV_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions)); // Apply CORS middleware

app.use(express.json());
app.set('trust proxy', 1);
// 3. Session Middleware with Security Enhancements [3,5](@ref)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_strong_secret', // Mandatory [7,8,10](@ref)
  resave: false, // Recommended to avoid unnecessary writes [7,8](@ref)
  saveUninitialized: true, // Recommended for new sessions [7,8](@ref)
  store: sessionStore, // Your existing MySQLStore
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    https: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction
      ? 'none'
      : 'lax'
  }
}));

async function initializeDatabase() {
  try {
    // Test database connection
    const [rows] = await db.query('SELECT 1');
    console.log('✅ Connected to MySQL database');
    
    // Check for existing nodes
    const [results] = await db.query('SELECT COUNT(*) AS count FROM nodes');
    const nodeCount = results[0].count;
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
}

// 4. Add Session Debugging Endpoint
app.get('/session-info', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    userId: req.session.userId,
    cookie: req.session.cookie
  });
});

// Initialize and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.use('/api', apiRoutes);
    if (isProduction) {
      app.use(serveStatic(path.join(__dirname, '../algorithm-app/build')));
      
      // Handle React routing, return all requests to React app
      app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(__dirname, '../algorithm-app/build', 'index.html'));
      });
    }
    

    // 5. Error Handling Middleware
    app.use((err, req, res, next) => {
      console.error('⛔ Server Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔒 Session storage: MySQL `);
    });
  } catch (err) {
    console.error('⛔ Failed to initialize application:', err.message);
    process.exit(1);
  }
}

const testConnection = async () => {
  try {
    const [result] = await db.query('SHOW STATUS LIKE "Threads_connected"');
    console.log('✅ Connection successful. Active threads:', result[0].Value);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.code === 'ETIMEDOUT') {
      console.log('Check security groups/VPC settings [12,4](@ref)');
    }
  }
};

testConnection();
startServer();