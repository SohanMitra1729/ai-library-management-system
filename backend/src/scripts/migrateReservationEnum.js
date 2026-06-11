require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('✅ Connected to database. Running one-time migration...');

        await connection.query(`
            ALTER TABLE reservations 
            MODIFY COLUMN status ENUM('Active', 'Collected', 'Expired', 'Cancelled') DEFAULT 'Active'
        `);

        console.log('✅ Successfully added "Cancelled" to reservations status ENUM.');
        
        await connection.end();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    }
}

migrate();
