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
const studyPlannerRoutes = require('./routes/studyPlannerRoutes');
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
app.use('/api/study-planner', studyPlannerRoutes);

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

        const requiredTables = ['users', 'books', 'issued_books', 'reservations', 'fines'];
        console.log('\n--- Database Schema Audit ---');

        // Define schema creation queries in strict dependency order
        const schemaQueries = {
            users: `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    role ENUM('student', 'faculty', 'librarian') DEFAULT 'student' NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `,
            books: `
                CREATE TABLE IF NOT EXISTS books (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    author VARCHAR(255) NOT NULL,
                    isbn VARCHAR(20) UNIQUE,
                    description TEXT,
                    category VARCHAR(100),
                    total_copies INT NOT NULL DEFAULT 1,
                    available_copies INT NOT NULL DEFAULT 1,
                    ai_summary TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    CONSTRAINT chk_copies CHECK (available_copies <= total_copies)
                )
            `,
            issued_books: `
                CREATE TABLE IF NOT EXISTS issued_books (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    book_id INT NOT NULL,
                    issue_date DATE NOT NULL,
                    due_date DATE NOT NULL,
                    return_date DATE NULL,
                    status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued' NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
                    CONSTRAINT chk_dates CHECK (due_date >= issue_date)
                )
            `,
            reservations: `
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
            `,
            fines: `
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
            `
        };

        // 1. Sequentially create tables
        for (const tableName of requiredTables) {
            try {
                await connection.query(schemaQueries[tableName]);
                console.log(`✅ Table '${tableName}' verified/created successfully.`);
            } catch (err) {
                console.error(`❌ Failed to create table '${tableName}'!`);
                console.error(`   Reason: Failed foreign key reference or syntax error.`);
                console.error(`   Exact Error: ${err.message}`);
            }
        }

        // 2. Audit existing tables
        const [tables] = await connection.query('SHOW TABLES');
        const dbNameKey = Object.keys(tables[0] || {})[0];
        const existingTables = tables.map(row => row[dbNameKey]);

        console.log('\n--- Final Schema Results ---');
        console.log(`📊 Tables found in database: [ ${existingTables.join(', ')} ]`);

        const missingTables = requiredTables.filter(t => !existingTables.includes(t));
        if (missingTables.length > 0) {
            console.error(`⚠️ Missing tables: [ ${missingTables.join(', ')} ]`);
        } else {
            console.log('✅ All required tables are present in the database!');
        }
        console.log('----------------------------\n');

        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed with the exact error:', error.message);
    }
})();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
