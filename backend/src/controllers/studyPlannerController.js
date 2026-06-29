const db = require('../config/db');
const aiService = require('../services/aiService');

const generateStudyPlan = async (req, res) => {
    const { goal, duration } = req.body;

    if (!goal || !duration) {
        return res.status(400).json({ success: false, message: 'Goal and duration are required.' });
    }

    try {
        console.log(`[AI Study Planner] Generating plan for goal: "${goal}", duration: ${duration} days`);
        
        // Fetch library books to provide as context
        const [availableBooks] = await db.query(
            `SELECT id, title, author, category, description, available_copies 
             FROM books 
             WHERE available_copies > 0`
        );

        if (availableBooks.length === 0) {
            return res.json({
                success: true,
                studyPlan: "No books are currently available in the library."
            });
        }

        // Keep tokens low by mapping only necessary fields
        const minimalBooksContext = availableBooks.map(book => ({
            title: book.title,
            author: book.author,
            category: book.category,
            description: book.description,
            availability: 'Available'
        }));

        const studyPlanMd = await aiService.generateStudyPlan(goal, duration, minimalBooksContext);

        res.json({
            success: true,
            studyPlan: studyPlanMd
        });
    } catch (error) {
        console.error('[AI Study Planner] Error generating plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate study plan.',
            error: error.message
        });
    }
};

module.exports = { generateStudyPlan };
