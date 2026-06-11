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
const reservationRoutes = require('./routes/reservationRoutes');
const fineRoutes = require('./routes/fineRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const studentRoutes = require('./routes/studentRoutes');
const db = require('./config/db');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
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
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                expiry_date DATETIME NOT NULL,
                status ENUM('Active', 'Collected', 'Expired') DEFAULT 'Active',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Reservations table verified/created.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS fines (
                id INT PRIMARY KEY AUTO_INCREMENT,
                issued_book_id INT NOT NULL,
                user_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
                payment_date DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (issued_book_id) REFERENCES issued_books(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Fines table verified/created.');

        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed with the exact error:', error.message);
    }
})();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
