const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCharts, exportBooks, exportUsers, exportTransactions } = require('../controllers/dashboardController');
const { protect, librarian } = require('../middlewares/authMiddleware');

router.get('/stats', protect, librarian, getDashboardStats);
router.get('/charts', protect, librarian, getDashboardCharts);
router.get('/export/books', protect, librarian, exportBooks);
router.get('/export/users', protect, librarian, exportUsers);
router.get('/export/transactions', protect, librarian, exportTransactions);

module.exports = router;
