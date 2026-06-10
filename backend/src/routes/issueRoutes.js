const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getIssueHistory } = require('../controllers/issueController');
const { protect, librarian } = require('../middlewares/authMiddleware');

router.post('/issue', protect, librarian, issueBook);
router.post('/return', protect, librarian, returnBook);
router.get('/history', protect, librarian, getIssueHistory);

module.exports = router;
