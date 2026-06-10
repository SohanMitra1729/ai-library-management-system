const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });

        const [result] = await pool.query('SELECT 1 AS test');
        console.log('✅ Database connected successfully. Test query returned:', result[0].test);
        
        // Also verify access to all tables
        const [books] = await pool.query('SELECT COUNT(*) as c FROM books');
        const [users] = await pool.query('SELECT COUNT(*) as c FROM users');
        const [issued] = await pool.query('SELECT COUNT(*) as c FROM issued_books');
        const [fines] = await pool.query('SELECT COUNT(*) as c FROM fines');
        
        console.log(`✅ Accessed tables successfully. Counts - Books: ${books[0].c}, Users: ${users[0].c}, Issued: ${issued[0].c}, Fines: ${fines[0].c}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed with exact error:', error.message);
        process.exit(1);
    }
})();
