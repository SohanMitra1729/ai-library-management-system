const db = require('../config/db');

const getStudentBooks = async (req, res) => {
    // req.user is set by the protect middleware
    const userId = req.user.id;
    const connection = await db.getConnection();
    
    try {
        const query = `
            SELECT 
                ib.id as issue_id, 
                b.title as book_title, 
                b.author, 
                b.category, 
                ib.issue_date, 
                ib.due_date, 
                ib.return_date, 
                CASE 
                    WHEN ib.status = 'issued' AND CURDATE() > ib.due_date THEN 'overdue'
                    ELSE ib.status
                END as status,
                CASE
                    WHEN ib.status = 'issued' AND CURDATE() > ib.due_date THEN DATEDIFF(CURDATE(), ib.due_date) * 50
                    ELSE COALESCE(SUM(f.amount), 0)
                END as fine_amount
            FROM issued_books ib
            JOIN books b ON ib.book_id = b.id
            LEFT JOIN fines f ON f.issued_book_id = ib.id
            WHERE ib.user_id = ?
            GROUP BY ib.id
            ORDER BY ib.issue_date DESC
        `;
        
        const [rows] = await connection.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching student books:', error);
        res.status(500).json({ message: 'Failed to fetch your books' });
    } finally {
        connection.release();
    }
};

module.exports = { getStudentBooks };
