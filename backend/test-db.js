require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('--- MySQL Connection Test ---');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('User:', process.env.DB_USER || 'root');
    console.log('Database:', process.env.DB_NAME || 'ai_library');
    console.log('Password Length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
    console.log('Port:', process.env.DB_PORT || 3306);
    console.log('-----------------------------');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'ai_library',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Connection SUCCESSFUL!');
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log('MySQL Version:', rows[0].version);
        
        await connection.end();
    } catch (error) {
        console.log('❌ Connection FAILED!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
    }
}

testConnection();
