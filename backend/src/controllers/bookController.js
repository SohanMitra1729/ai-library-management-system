const db = require('../config/db');

const getAllBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addBook = async (req, res) => {
    const { title, author, isbn, description, category, total_copies } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO books (title, author, isbn, description, category, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, author, isbn, description, category, total_copies, total_copies]
        );
        res.status(201).json({ id: result.insertId, message: 'Book added successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, description, category, total_copies, available_copies } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE books SET title=?, author=?, isbn=?, description=?, category=?, total_copies=?, available_copies=? WHERE id=?',
            [title, author, isbn, description, category, total_copies, available_copies, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM books WHERE id=?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllBooks, addBook, updateBook, deleteBook };
