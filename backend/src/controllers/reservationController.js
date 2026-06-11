const db = require('../config/db');

// Reserve a book
const reserveBook = async (req, res) => {
    const { book_id } = req.body;
    const user_id = req.user.id;

    try {
        // 1. Check if the book exists and is available
        const [books] = await db.execute('SELECT * FROM books WHERE id = ?', [book_id]);
        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        const book = books[0];
        if (book.available_copies <= 0) {
            return res.status(400).json({ message: 'No copies available for reservation' });
        }

        // 2. Check for existing active reservation for the same user and book
        const [existing] = await db.execute(
            'SELECT * FROM reservations WHERE user_id = ? AND book_id = ? AND status = ?',
            [user_id, book_id, 'Active']
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You already have an active reservation for this book' });
        }

        // 3. Create reservation (expires in 48 hours)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 48);

        await db.execute(
            'INSERT INTO reservations (user_id, book_id, reservation_date, expiry_date, status) VALUES (?, ?, NOW(), ?, ?)',
            [user_id, book_id, expiryDate, 'Active']
        );

        // 4. Decrement available copies
        await db.execute(
            'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
            [book_id]
        );

        res.status(201).json({ message: 'Book reserved successfully' });

    } catch (error) {
        console.error('Reserve book error:', error);
        res.status(500).json({ message: 'Server error while reserving book' });
    }
};

// Get My Reservations
const getMyReservations = async (req, res) => {
    const user_id = req.user.id;
    try {
        const query = `
            SELECT r.*, b.title, b.author, b.category, b.isbn
            FROM reservations r
            JOIN books b ON r.book_id = b.id
            WHERE r.user_id = ?
            ORDER BY r.reservation_date DESC
        `;
        const [reservations] = await db.execute(query, [user_id]);
        res.json(reservations);
    } catch (error) {
        console.error('Get my reservations error:', error);
        res.status(500).json({ message: 'Server error while fetching reservations' });
    }
};

// Get Active Reservations Count (for dashboard)
const getActiveReservationsCount = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT COUNT(*) as count FROM reservations WHERE status = 'Active'");
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error('Get active reservations count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    reserveBook,
    getMyReservations,
    getActiveReservationsCount
};
