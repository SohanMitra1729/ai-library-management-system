const db = require('../config/db');

async function createTable() {
    try {
        console.log('Creating reservations table...');
        const createReservationsTableQuery = `
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
        `;
        await db.query(createReservationsTableQuery);
        console.log('✅ Reservations table created successfully.');
    } catch (error) {
        console.error('❌ Error creating reservations table:', error.message);
    } finally {
        process.exit();
    }
}

createTable();
