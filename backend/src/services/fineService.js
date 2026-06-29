const db = require('../config/db');

const syncOverdueFines = async () => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Fetch all currently issued books that are overdue
        const [overdueIssues] = await connection.query(`
            SELECT id as issued_book_id, user_id, due_date
            FROM issued_books 
            WHERE status = 'issued' AND CURDATE() > due_date
        `);

        for (const issue of overdueIssues) {
            // Calculate fine: 50 rupees/units per day
            // Wait, we need to handle this strictly in DB to avoid timezone issues, or calculate it here.
            // Using DB datediff directly to be consistent.
            const [diffResult] = await connection.query(
                'SELECT DATEDIFF(CURDATE(), ?) as days', 
                [issue.due_date]
            );
            const daysOverdue = diffResult[0].days;
            const fineAmount = daysOverdue * 50;

            // 2. Check if a fine already exists for this issued book
            const [existingFines] = await connection.query(
                'SELECT id, status FROM fines WHERE issued_book_id = ?',
                [issue.issued_book_id]
            );

            if (existingFines.length === 0) {
                // Insert new unpaid fine
                await connection.query(
                    'INSERT INTO fines (issued_book_id, user_id, amount, status) VALUES (?, ?, ?, "unpaid")',
                    [issue.issued_book_id, issue.user_id, fineAmount]
                );
            } else {
                // Update existing unpaid fine to latest amount
                const fine = existingFines[0];
                if (fine.status === 'unpaid') {
                    await connection.query(
                        'UPDATE fines SET amount = ? WHERE id = ?',
                        [fineAmount, fine.id]
                    );
                }
            }
        }

        await connection.commit();
        console.log(`[Fine Service] Synchronized fines for ${overdueIssues.length} overdue books.`);
    } catch (error) {
        await connection.rollback();
        console.error('[Fine Service] Error synchronizing fines:', error);
    } finally {
        connection.release();
    }
};

module.exports = {
    syncOverdueFines
};
