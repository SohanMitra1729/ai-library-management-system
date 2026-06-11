const db = require('../config/db');

// Get all fines (Librarian)
const getAllFines = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.id, f.amount, f.status, f.payment_date, f.created_at,
                u.name as student_name, u.email as student_email,
                b.title as book_title,
                ib.issue_date, ib.return_date, ib.due_date
            FROM fines f
            JOIN users u ON f.user_id = u.id
            JOIN issued_books ib ON f.issued_book_id = ib.id
            JOIN books b ON ib.book_id = b.id
            ORDER BY f.created_at DESC
        `;
        const [fines] = await db.query(query);
        res.json(fines);
    } catch (error) {
        console.error('Error fetching all fines:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my fines (Student)
const getMyFines = async (req, res) => {
    const user_id = req.user.id;
    try {
        const query = `
            SELECT 
                f.id, f.amount, f.status, f.payment_date, f.created_at,
                b.title as book_title, b.category, b.isbn,
                ib.issue_date, ib.return_date, ib.due_date
            FROM fines f
            JOIN issued_books ib ON f.issued_book_id = ib.id
            JOIN books b ON ib.book_id = b.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        `;
        const [fines] = await db.query(query, [user_id]);
        res.json(fines);
    } catch (error) {
        console.error('Error fetching my fines:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Pay fine (Librarian)
const payFine = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE fines SET status = "paid", payment_date = NOW() WHERE id = ? AND status = "unpaid"',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fine not found or already paid' });
        }

        res.json({ message: 'Fine marked as paid successfully' });
    } catch (error) {
        console.error('Error paying fine:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllFines,
    getMyFines,
    payFine
};
