const Groq = require('groq-sdk');
const db = require('../config/db');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

// Helper to handle Groq API calls with model fallback
const generateGroqContent = async (systemPrompt, userPrompt) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Server is missing GROQ_API_KEY configuration.');
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        console.log(`[Groq AI] Attempting with model: llama-3.3-70b-versatile`);
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2048
        });
        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('[Groq AI] Error with primary model:', error.message);
        console.log(`[Groq AI] Falling back to model: llama-3.1-8b-instant`);
        try {
            const fallbackCompletion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 2048
            });
            return fallbackCompletion.choices[0]?.message?.content || '';
        } catch (fallbackError) {
            console.error('[Groq AI] Error with fallback model:', fallbackError.message);
            throw new Error('Failed to generate content with Groq API.');
        }
    }
};

const generateRecommendations = async (interests, availableBooks) => {
    const booksContext = JSON.stringify(availableBooks, null, 2);

    const systemPrompt = `You are NexusLib AI, a helpful AI Librarian.
    
Below is the complete catalog of books currently available in the library:
${booksContext}

Recommend ONLY books from this catalog.
Never invent books.
Never invent authors.
Never recommend books outside this list.
If the library does not contain an exact match, recommend the closest available books and explain why they are useful.`;

    const userPrompt = `
A user has provided the following interests: "${interests}".
Please recommend 4 specific books from the catalog that match their interests.

Return ONLY a raw JSON array. Do not include markdown blocks like \`\`\`json. 
Each object in the array should have exactly these keys:
- "id" (number, the ID of the book in the catalog)
- "title" (string)
- "author" (string)
- "category" (string)
- "description" (string, a brief 1-2 sentence compelling summary)
- "reason" (string, explain why this book was recommended based on the user's interests)
- "availability" (string, e.g., "Available")
- "difficulty" (string, Beginner/Intermediate/Advanced based on your assessment of the book)
- "estimatedReadingTime" (string, e.g., "5 hours")
    `;

    const responseText = await generateGroqContent(systemPrompt, userPrompt);
    
    // Clean up response text in case the model ignored instructions and wrapped it in markdown
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }

    try {
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error('[Groq AI] Failed to parse JSON response:', cleanedText);
        throw new Error('Invalid JSON response from AI.');
    }
};

const generateStudyPlan = async (goal, duration, availableBooks) => {
    const booksContext = JSON.stringify(availableBooks, null, 2);

    const systemPrompt = `You are NexusLib AI, an expert AI Study Planner and Librarian.

Below is the complete catalog of books currently available in the library:
${booksContext}

Recommend ONLY books from this catalog.
Never invent books.
Never invent authors.
Never recommend books outside this list.

If the required topic is unavailable in the library, you must clearly state:
"This topic is not currently available in your library."
Then recommend the closest available books and explain why they are useful.`;

    const userPrompt = `
Generate a structured study plan for a user.
Goal: "${goal}"
Duration: ${duration} days

Return a markdown formatted study plan exactly following this structure:
# Study Plan

**Goal:** [Goal]  
**Duration:** [Duration] days

---

## Weekly Milestones
- **Week 1:** [Milestone]
[Add more weeks as needed]

---

## Daily Schedule
### Day 1
- **Focus:** [Topic]
- **Tasks:** [Specific tasks]
[Add more days up to the duration]

---

## Recommended Books (From Library)
- **[Book Title]** by [Author]
[Recommend 3 relevant books from the catalog. If topic is unavailable, include the required statement here and then closest matches.]

---

## Revision Strategy
- [Strategy point 1]
- [Strategy point 2]
- [Strategy point 3]

---

## Final Assessment
- [Assessment point 1]
- [Assessment point 2]

Do NOT return JSON. Return ONLY the markdown string exactly as requested, ready to be rendered on the frontend.
    `;

    const responseText = await generateGroqContent(systemPrompt, userPrompt);
    return responseText.trim();
};

module.exports = { generateRecommendations, generateStudyPlan };
