const express = require('express');
const router = express.Router();
const { getStudentBooks } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/my-books', protect, getStudentBooks);

module.exports = router;
