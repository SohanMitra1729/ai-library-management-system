const express = require('express');
const router = express.Router();
const { reserveBook, getMyReservations, getActiveReservationsCount } = require('../controllers/reservationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/reserve', protect, reserveBook);
router.get('/my-reservations', protect, getMyReservations);
router.get('/active-count', protect, getActiveReservationsCount); // Optionally we could restrict this to librarian, but protect is fine

module.exports = router;
