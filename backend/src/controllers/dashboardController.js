const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [
            [totalBooks],
            [totalUsers],
            [activeIssues],
            [availableBooks],
            [overdueBooks],
            [returnedToday],
            [unpaidFines],
            [dynamicFines]
        ] = await Promise.all([
            connection.query("SELECT COUNT(*) as total FROM books"),
            connection.query("SELECT COUNT(*) as total FROM users"),
            connection.query("SELECT COUNT(*) as active FROM issued_books WHERE status = 'issued'"),
            connection.query("SELECT SUM(available_copies) as available FROM books"),
            connection.query("SELECT COUNT(*) as overdue FROM issued_books WHERE status = 'issued' AND due_date < CURDATE()"),
            connection.query("SELECT COUNT(*) as returned FROM issued_books WHERE status = 'returned' AND return_date = CURDATE()"),
            connection.query("SELECT SUM(amount) as total FROM fines WHERE status = 'unpaid'"),
            connection.query("SELECT SUM(DATEDIFF(CURDATE(), due_date) * 50) as dynamic_total FROM issued_books WHERE status = 'issued' AND due_date < CURDATE()")
        ]);

        console.log('[Dashboard Stats] Query Results:');
        console.log('Books:', totalBooks[0]);
        console.log('Users:', totalUsers[0]);
        console.log('Active:', activeIssues[0]);
        console.log('Available:', availableBooks[0]);
        console.log('Overdue:', overdueBooks[0]);
        console.log('Returned:', returnedToday[0]);
        console.log('Fines:', unpaidFines[0]);

        const totalUnpaid = parseFloat(unpaidFines[0]?.total || 0);
        const dynamicUnpaid = parseFloat(dynamicFines[0]?.dynamic_total || 0);
        const grandTotalFines = totalUnpaid + dynamicUnpaid;

        const responseJson = {
            total_books: totalBooks[0]?.total || 0,
            available_books: availableBooks[0]?.available || 0,
            active_issues: activeIssues[0]?.active || 0,
            total_users: totalUsers[0]?.total || 0,
            overdue_books: overdueBooks[0]?.overdue || 0,
            returned_today: returnedToday[0]?.returned || 0,
            total_unpaid_fines: grandTotalFines
        };

        console.log('[Dashboard Stats] Response JSON:', responseJson);

        res.json(responseJson);
    } catch (error) {
        console.error('[Dashboard Stats Error]:', error);
        res.status(500).json({ message: 'Server error retrieving dashboard stats', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

const getDashboardCharts = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [booksByCategory] = await connection.query(`
            SELECT category as name, COUNT(*) as value
            FROM books
            GROUP BY category
        `);

        const [monthlyActivity] = await connection.query(`
            SELECT DATE_FORMAT(issue_date, '%b') as name, COUNT(*) as issues
            FROM issued_books
            WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY name
            ORDER BY MIN(issue_date)
        `);

        const [topIssuedBooks] = await connection.query(`
            SELECT b.title, COUNT(*) AS issue_count 
            FROM issued_books ib 
            JOIN books b ON ib.book_id = b.id 
            GROUP BY b.id 
            ORDER BY issue_count DESC 
            LIMIT 5
        `);

        const [recentActivity] = await connection.query(`
            SELECT 
                u.name as user_name, 
                b.title as book_title, 
                ib.issue_date, 
                ib.return_date, 
                ib.status 
            FROM issued_books ib 
            JOIN users u ON ib.user_id = u.id 
            JOIN books b ON ib.book_id = b.id 
            ORDER BY ib.issue_date DESC, ib.id DESC 
            LIMIT 5
        `);

        const responseJson = {
            booksByCategory: booksByCategory || [],
            monthlyActivity: monthlyActivity || [],
            topIssuedBooks: topIssuedBooks || [],
            recentActivity: recentActivity || []
        };
        console.log('[Dashboard Charts] Response JSON:', responseJson);

        res.json(responseJson);
    } catch (error) {
        console.error('[Dashboard Charts Error]:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

const exportBooks = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [books] = await connection.query("SELECT title, author, category, isbn, total_copies, available_copies FROM books");
        const header = "Title,Author,Category,ISBN,Total Copies,Available Copies\n";
        const csv = books.map(b => `"${(b.title || '').replace(/"/g, '""')}","${(b.author || '').replace(/"/g, '""')}","${(b.category || '').replace(/"/g, '""')}","${b.isbn}",${b.total_copies},${b.available_copies}`).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.attachment('books_export.csv');
        res.send(header + csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Export failed' });
    } finally {
        if (connection) connection.release();
    }
};

const exportUsers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [users] = await connection.query("SELECT name, email, role FROM users");
        const header = "Name,Email,Role\n";
        const csv = users.map(u => `"${(u.name || '').replace(/"/g, '""')}","${(u.email || '').replace(/"/g, '""')}","${(u.role || '').replace(/"/g, '""')}"`).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.attachment('users_export.csv');
        res.send(header + csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Export failed' });
    } finally {
        if (connection) connection.release();
    }
};

const exportTransactions = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [transactions] = await connection.query(`
            SELECT 
                b.title as book, 
                u.name as user, 
                ib.issue_date, 
                ib.due_date, 
                ib.return_date, 
                ib.status,
                CASE
                    WHEN ib.status = 'issued' AND CURDATE() > ib.due_date THEN DATEDIFF(CURDATE(), ib.due_date) * 50
                    ELSE COALESCE((SELECT SUM(amount) FROM fines f WHERE f.issued_book_id = ib.id), 0)
                END as fine
            FROM issued_books ib
            JOIN books b ON ib.book_id = b.id
            JOIN users u ON ib.user_id = u.id
        `);
        const header = "Book,User,Issue Date,Due Date,Return Date,Fine,Status\n";
        const csv = transactions.map(t => {
            const returnDateStr = t.return_date ? new Date(t.return_date).toLocaleDateString() : '';
            return `"${(t.book || '').replace(/"/g, '""')}","${(t.user || '').replace(/"/g, '""')}","${new Date(t.issue_date).toLocaleDateString()}","${new Date(t.due_date).toLocaleDateString()}","${returnDateStr}",${t.fine},"${t.status}"`;
        }).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.attachment('transactions_export.csv');
        res.send(header + csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Export failed' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getDashboardStats, getDashboardCharts, exportBooks, exportUsers, exportTransactions };
