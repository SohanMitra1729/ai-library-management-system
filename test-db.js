const db = require('./backend/src/config/db');

async function testStats() {
    const connection = await db.getConnection();
    try {
        console.log("Connected to DB...");
        
        const results = await Promise.all([
            connection.query('SELECT COUNT(*) as total FROM books'),
            connection.query('SELECT COUNT(*) as total FROM users'),
            connection.query('SELECT COUNT(*) as active FROM issued_books WHERE status = "issued"'),
            connection.query('SELECT SUM(available_copies) as available FROM books'),
            connection.query('SELECT COUNT(*) as overdue FROM issued_books WHERE status = "issued" AND due_date < CURDATE()'),
            connection.query('SELECT COUNT(*) as returned FROM issued_books WHERE status = "returned" AND return_date = CURDATE()'),
            connection.query('SELECT SUM(amount) as total FROM fines WHERE status = "unpaid"')
        ]);
        
        const [
            [totalBooks],
            [totalUsers],
            [activeIssues],
            [availableBooks],
            [overdueBooks],
            [returnedToday],
            [unpaidFines]
        ] = results;

        console.log({
            total_books: totalBooks[0].total || 0,
            available_books: availableBooks[0].available || 0,
            active_issues: activeIssues[0].active || 0,
            total_users: totalUsers[0].total || 0,
            overdue_books: overdueBooks[0].overdue || 0,
            returned_today: returnedToday[0].returned || 0,
            total_unpaid_fines: unpaidFines[0].total || 0
        });

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        connection.release();
        process.exit(0);
    }
}

testStats();
