const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

// Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getRecommendations = async (req, res) => {
    const { interests } = req.body;

    if (!interests) {
        return res.status(400).json({ message: 'Interests are required for recommendations.' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Server is missing GEMINI_API_KEY configuration.' });
    }

    try {
        const modelName = 'gemini-2.0-flash';
        console.log(`[AI Recommendations] Initializing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
            You are a helpful AI Librarian. A user has provided the following interests: "${interests}".
            Please recommend 4 specific books that match their interests.
            
            Return ONLY a raw JSON array. Do not include markdown blocks like \`\`\`json. 
            Each object in the array should have exactly these keys:
            - "title" (string)
            - "author" (string)
            - "category" (string)
            - "description" (string, a brief 1-2 sentence compelling summary)
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up response text in case the model ignored instructions and wrapped it in markdown
        let cleanedText = responseText.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.substring(7);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.substring(0, cleanedText.length - 3);
        }

        const recommendations = JSON.parse(cleanedText);

        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching AI recommendations:', error);
        
        try {
            // Intelligent Fallback to Database
            const [allBooks] = await db.query('SELECT title, author, category, description FROM books');
            
            const rawQuery = interests.toLowerCase();
            
            // 1. Keyword Expansion Mappings
            const expansionMap = {
                'cybersecurity': ['cyber security', 'security', 'information security', 'ethical hacking', 'network security', 'penetration testing', 'malware', 'forensics', 'cybersecurity', 'hacker'],
                'machine learning': ['machine learning', 'artificial intelligence', 'deep learning', 'neural networks', 'data science', 'ml', 'ai'],
                'database': ['database', 'dbms', 'sql', 'nosql', 'data modeling', 'databases'],
                'operating systems': ['operating systems', 'os', 'linux', 'kernel', 'windows'],
                'networking': ['networking', 'network', 'tcp/ip', 'internet', 'protocols'],
                'software engineering': ['software engineering', 'design patterns', 'clean code', 'system design']
            };

            // Tokenize query and remove common stop words
            const stopWords = ['i','want','to','learn','about','and','the','a','an','of','in','for','with','on','how','is','what','best','books','book','some'];
            const queryWords = (rawQuery.match(/\b\w+\b/g) || []).filter(w => !stopWords.includes(w) && w.length > 2);
            
            // Expand keywords
            let searchTerms = [...queryWords];
            
            // Check for expanded categories in the raw query
            Object.keys(expansionMap).forEach(key => {
                if (rawQuery.includes(key)) {
                    searchTerms = [...searchTerms, ...expansionMap[key]];
                }
            });

            // Remove duplicates
            searchTerms = [...new Set(searchTerms)];
            
            // 2. Score books based on expanded keyword matches
            const scoredBooks = allBooks.map(book => {
                let score = 0;
                const titleStr = book.title.toLowerCase();
                const categoryStr = book.category.toLowerCase();
                const descStr = (book.description || '').toLowerCase();
                const authorStr = book.author.toLowerCase();
                
                searchTerms.forEach(term => {
                    if (titleStr.includes(term)) score += 10;
                    if (categoryStr.includes(term)) score += 8;
                    if (descStr.includes(term)) score += 5;
                    if (authorStr.includes(term)) score += 3;
                });
                
                return { ...book, score };
            });
            
            // 3. Sort by score descending
            scoredBooks.sort((a, b) => b.score - a.score);
            
            // 4. Log matching scores
            console.log(`\n[AI Fallback] Keyword scoring results for query: "${interests}"`);
            scoredBooks.slice(0, 5).forEach(b => {
                console.log(`- ${b.title} -> score ${b.score}`);
            });
            
            // 5. Filter relevant books and prepare Intro Card
            let matchedBooks = scoredBooks.filter(b => b.score > 0);
            let introCard;
            
            if (matchedBooks.length === 0) {
                introCard = {
                    title: "Popular books from the library",
                    author: "NexusLib System",
                    category: "Knowledge Base",
                    description: "We couldn't find exact matches for your interests, but here are some popular selections from our library."
                };
                matchedBooks = allBooks.slice(0, 4); // Pick top 4 default
            } else {
                introCard = {
                    title: "Smart Library Recommendations",
                    author: "NexusLib System",
                    category: "Knowledge Base",
                    description: "Recommendations generated using our library knowledge base."
                };
            }

            // Clean up the score property before sending to client
            const finalBooks = matchedBooks.slice(0, 4).map(b => {
                const { score, ...rest } = b;
                return rest;
            });

            // Return Intro card + top 4 books
            return res.json([introCard, ...finalBooks]);
        } catch (dbError) {
            console.error('Database fallback failed:', dbError);
            return res.status(500).json({ message: 'Failed to generate recommendations from AI and database fallback also failed.' });
        }
    }
};

const testGemini = async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        console.error('[AI Test] Server is missing GEMINI_API_KEY');
        return res.status(500).json({ message: 'Server is missing GEMINI_API_KEY configuration.' });
    }

    try {
        const modelName = 'gemini-2.0-flash';
        console.log(`[AI Test] Initializing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Recommend one book for learning machine learning.";
        console.log(`[AI Test] Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log('[AI Test] Successfully received response from Gemini.');

        res.json({
            success: true,
            prompt: prompt,
            response: responseText
        });
    } catch (error) {
        console.error('[AI Test] Error communicating with Gemini API:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to communicate with Gemini API.',
            error: error.message
        });
    }
};

module.exports = { getRecommendations, testGemini };
