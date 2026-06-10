const express = require('express');
const router = express.Router();
const { getRecommendations, testGemini } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

// Route is protected, any logged-in user can ask for recommendations
router.post('/recommend', protect, getRecommendations);

// Public test route to verify Gemini configuration
router.get('/test', testGemini);

module.exports = router;
