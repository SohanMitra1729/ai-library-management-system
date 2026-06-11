const express = require('express');
const router = express.Router();
const { getAllBooks, addBook, updateBook, deleteBook, searchBooks } = require('../controllers/bookController');
const { protect, librarian } = require('../middlewares/authMiddleware');

router.get('/', getAllBooks);
router.get('/search', protect, librarian, searchBooks);
router.post('/', protect, librarian, addBook);
router.put('/:id', protect, librarian, updateBook);
router.delete('/:id', protect, librarian, deleteBook);

module.exports = router;
