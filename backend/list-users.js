require('dotenv').config();
const mysql = require('mysql2/promise');

async function listUsers() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('✅ Connected to Railway Database');

        const [users] = await connection.execute('SELECT id, name, email, role, password_hash FROM users');
        console.log(`\n--- Found ${users.length} Users in Database ---`);
        users.forEach(u => {
            console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role}`);
            console.log(`Password Hash: ${u.password_hash.substring(0, 15)}...`);
        });
        console.log('--------------------------------------\n');
        
        await connection.end();
    } catch (error) {
        console.error('❌ Error fetching users:', error.message);
    }
}

listUsers();
