const db = require('../config/db');

const generateStudyPlan = async (req, res) => {
    const { goal, duration } = req.body;

    if (!goal || !duration) {
        return res.status(400).json({ success: false, message: 'Goal and duration are required.' });
    }

    try {
        console.log(`[Local Study Planner] Generating plan for goal: "${goal}", duration: ${duration} days`);
        const goalLower = goal.toLowerCase();

        // 1. Topic Classification
        let topicType = 'Generic';
        let topicsList = [];
        let bookSearchKeyword = '';

        if (/dbms|database|sql/i.test(goalLower)) {
            topicType = 'Database Management Systems';
            bookSearchKeyword = 'Database';
            topicsList = [
                'Fundamentals & Architecture',
                'ER Models & Schema Design',
                'SQL Basics (Select, Join, Aggregate)',
                'Advanced SQL (Subqueries, Triggers)',
                'Normalization & Integrity',
                'Transactions & Concurrency Control',
                'Indexing & Hashing',
                'Revision & Mock Assessments'
            ];
        } else if (/dsa|data structure|algorithm/i.test(goalLower)) {
            topicType = 'Data Structures & Algorithms';
            bookSearchKeyword = 'Algorithm';
            topicsList = [
                'Time/Space Complexity & Arrays',
                'Linked Lists (Singly & Doubly)',
                'Stacks & Queues',
                'Trees (Binary, BST, AVL)',
                'Graphs (BFS, DFS, Shortest Path)',
                'Dynamic Programming',
                'Greedy Algorithms & Backtracking',
                'Revision & Competitive Coding Practice'
            ];
        } else if (/machine learning|ml|ai|artificial intelligence/i.test(goalLower)) {
            topicType = 'Machine Learning & AI';
            bookSearchKeyword = 'Machine Learning';
            topicsList = [
                'Python Basics & Setup',
                'Mathematics (Linear Algebra & Calculus)',
                'Statistics & Data Preprocessing',
                'Machine Learning Concepts & Validation',
                'Regression Techniques',
                'Classification Techniques',
                'Neural Networks & Deep Learning',
                'Projects & Revision'
            ];
        } else {
            topicType = goal; // Generic fallback
            bookSearchKeyword = goal;
            topicsList = [
                'Introduction & Basic Concepts',
                'Core Fundamentals',
                'Intermediate Concepts',
                'Practical Application',
                'Advanced Topics',
                'Project Building',
                'Troubleshooting & Edge Cases',
                'Final Revision & Summary'
            ];
        }

        // 2. Fetch Recommended Books from DB
        let recommendedBooksMd = '';
        try {
            // Find books matching the keyword
            const [books] = await db.query(
                `SELECT title, author FROM books 
                 WHERE category LIKE ? OR title LIKE ? 
                 LIMIT 3`, 
                [`%${bookSearchKeyword}%`, `%${bookSearchKeyword}%`]
            );

            if (books && books.length > 0) {
                recommendedBooksMd = books.map(b => `- **${b.title}** by ${b.author}`).join('\n');
            } else {
                recommendedBooksMd = `- *No exact matches in the library. Please check the catalog for related topics.*`;
            }
        } catch (dbErr) {
            console.error('[Local Study Planner] Failed to fetch books:', dbErr.message);
            recommendedBooksMd = `- *Library database is currently unavailable.*`;
        }

        // 3. Build Markdown
        // Distribute topics evenly across the days
        let scheduleMd = '';
        const topicsCount = topicsList.length;
        
        for (let i = 1; i <= duration; i++) {
            // Map day to a topic index
            const topicIndex = Math.floor(((i - 1) / duration) * topicsCount);
            scheduleMd += `### Day ${i}\n- **Focus:** ${topicsList[topicIndex]}\n- **Tasks:** Review concepts, take notes, and practice.\n\n`;
        }

        // Weekly milestones (roughly every 7 days)
        let milestonesMd = '';
        const weeks = Math.ceil(duration / 7);
        for (let w = 1; w <= weeks; w++) {
            milestonesMd += `- **Week ${w}:** Complete up to day ${Math.min(w * 7, duration)} modules.\n`;
        }

        const studyPlanMd = `
# Study Plan

**Goal:** ${goal}  
**Duration:** ${duration} days

---

## Weekly Milestones
${milestonesMd}

---

## Daily Schedule

${scheduleMd}

---

## Recommended Books (From Library)
${recommendedBooksMd}

---

## Revision Strategy
- Spend 15 minutes each day reviewing notes from the previous day.
- At the end of each week, attempt a small mock test or quiz.
- Dedicate the final 2 days strictly for complete syllabus revision.

---

## Final Assessment
- Complete a comprehensive end-to-end project or attempt a full-length mock exam.
- Self-evaluate weak areas and re-read recommended library materials.
`;

        res.json({
            success: true,
            studyPlan: studyPlanMd.trim()
        });
    } catch (error) {
        console.error('[Local Study Planner] Error generating plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate study plan.',
            error: error.message
        });
    }
};

module.exports = { generateStudyPlan };
