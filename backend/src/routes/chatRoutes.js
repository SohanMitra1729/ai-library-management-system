const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// Route is protected, any logged-in user can access the assistant
router.post('/message', protect, handleChatMessage);

module.exports = router;
