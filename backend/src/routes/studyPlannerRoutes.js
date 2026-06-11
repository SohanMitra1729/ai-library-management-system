const express = require('express');
const router = express.Router();
const { generateStudyPlan } = require('../controllers/studyPlannerController');

router.post('/generate', generateStudyPlan);

module.exports = router;
