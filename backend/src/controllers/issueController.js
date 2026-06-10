const db = require('../config/db');

const issueBook = async (req, res) => {
    const { user_id, book_id, due_date } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Check if book has available copies
        const [books] = await connection.query('SELECT available_copies FROM books WHERE id = ? FOR UPDATE', [book_id]);
        if (books.length === 0) throw new Error('Book not found');
        if (books[0].available_copies <= 0) throw new Error('No copies available');

        // 2. Decrement available copies
        await connection.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [book_id]);

        // 3. Create issue record
        const issue_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const [result] = await connection.query(
            'INSERT INTO issued_books (user_id, book_id, issue_date, due_date, status) VALUES (?, ?, ?, ?, "issued")',
            [user_id, book_id, issue_date, due_date]
        );

        await connection.commit();
        res.status(201).json({ message: 'Book issued successfully', issue_id: result.insertId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

const returnBook = async (req, res) => {
    const { issue_id } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Get issue record
        const [issues] = await connection.query('SELECT * FROM issued_books WHERE id = ? FOR UPDATE', [issue_id]);
        if (issues.length === 0) throw new Error('Issue record not found');
        
        const issue = issues[0];
        if (issue.status === 'returned') throw new Error('Book is already returned');

        const return_date = new Date().toISOString().split('T')[0];

        // 2. Update issue record to returned
        await connection.query('UPDATE issued_books SET status = "returned", return_date = ? WHERE id = ?', [return_date, issue_id]);

        // 3. Increment book copies
        await connection.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', [issue.book_id]);

        // 4. Calculate fine if overdue (₹50 per day)
        let fineAmount = 0;
        const returnDateObj = new Date(return_date);
        const dueDateObj = new Date(issue.due_date);
        
        if (returnDateObj > dueDateObj) {
            const diffTime = Math.abs(returnDateObj - dueDateObj);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fineAmount = diffDays * 50;

            await connection.query(
                'INSERT INTO fines (issued_book_id, user_id, amount, status) VALUES (?, ?, ?, "unpaid")',
                [issue_id, issue.user_id, fineAmount]
            );
        }

        await connection.commit();
        res.json({ message: 'Book returned successfully', fine_incurred: fineAmount });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

const getIssueHistory = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT 
                ib.id as issue_id, 
                b.title as book_title, 
                u.name as student_name, 
                ib.issue_date, 
                ib.due_date, 
                ib.return_date, 
                CASE
                    WHEN ib.status = 'issued' AND CURDATE() > ib.due_date THEN DATEDIFF(CURDATE(), ib.due_date) * 50
                    ELSE COALESCE(SUM(f.amount), 0)
                END as fine_amount,
                CASE 
                    WHEN ib.status = 'issued' AND CURDATE() > ib.due_date THEN 'overdue'
                    ELSE ib.status
                END as dynamic_status
            FROM issued_books ib
            JOIN books b ON ib.book_id = b.id
            JOIN users u ON ib.user_id = u.id
            LEFT JOIN fines f ON f.issued_book_id = ib.id
            GROUP BY ib.id
            ORDER BY ib.issue_date DESC
        `;
        const [rows] = await connection.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching issue history:', error);
        res.status(500).json({ message: 'Failed to fetch issue history' });
    } finally {
        connection.release();
    }
};

module.exports = { issueBook, returnBook, getIssueHistory };
