const express = require('express');
const router = express.Router();
const { reserveBook, getMyReservations, getActiveReservationsCount, getAllReservations, issueReservedBook, cancelReservation } = require('../controllers/reservationController');
const { protect, librarian } = require('../middlewares/authMiddleware');

router.post('/reserve', protect, reserveBook);
router.get('/my-reservations', protect, getMyReservations);
router.get('/active-count', protect, getActiveReservationsCount); // Optionally we could restrict this to librarian, but protect is fine

// Librarian routes
router.get('/all', protect, librarian, getAllReservations);
router.post('/:id/issue', protect, librarian, issueReservedBook);
router.post('/:id/cancel', protect, librarian, cancelReservation);

module.exports = router;
