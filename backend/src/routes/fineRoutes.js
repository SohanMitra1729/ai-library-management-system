const express = require('express');
const router = express.Router();
const { getAllFines, getMyFines, payFine } = require('../controllers/fineController');
const { protect } = require('../middlewares/authMiddleware');

// Student route
router.get('/my-fines', protect, getMyFines);

// Librarian routes
router.get('/', protect, getAllFines);
router.put('/:id/pay', protect, payFine);

module.exports = router;
