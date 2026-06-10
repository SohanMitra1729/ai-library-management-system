const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AI Library API' });
});

// Database Connection Test Endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await require('./config/db').query('SELECT COUNT(*) as count FROM books');
        res.json({ success: true, bookCount: rows[0].count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const issueRoutes = require('./routes/issueRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const studentRoutes = require('./routes/studentRoutes');
const db = require('./config/db');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/student', studentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start the server
const PORT = process.env.PORT || 5000;
(async () => {
    try {
        const connection = await db.getConnection();
        const [result] = await connection.query('SELECT 1 AS test');
        console.log('✅ Database connected successfully. Test query returned:', result[0].test);
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed with the exact error:', error.message);
    }
})();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
