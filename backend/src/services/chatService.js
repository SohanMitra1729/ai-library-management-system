const Groq = require('groq-sdk');
const db = require('../config/db');
const fineService = require('./fineService');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

const callGroq = async (messages, model = 'llama-3.3-70b-versatile', max_tokens = 1024) => {
    try {
        const completion = await groq.chat.completions.create({
            messages,
            model,
            temperature: 0.7,
            max_tokens,
        });
        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error(`[Chat Service] Error with Groq model ${model}:`, error.message);
        if (model === 'llama-3.3-70b-versatile') {
            console.log('[Chat Service] Falling back to llama-3.1-8b-instant');
            const fallback = await groq.chat.completions.create({
                messages,
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens,
            });
            return fallback.choices[0]?.message?.content || '';
        }
        throw new Error('Failed to communicate with AI provider.');
    }
};

const classifyIntent = async (message) => {
    const prompt = 'Classify the user\'s intent into exactly ONE of these categories:\n' +
        '- LIBRARY_SEARCH (e.g. asking about books, catalog, do you have a book)\n' +
        '- MY_BOOKS (e.g. what books have I borrowed, issued books)\n' +
        '- MY_FINES (e.g. do I have fines, how much do I owe)\n' +
        '- MY_RESERVATIONS (e.g. my reservations, did I reserve)\n' +
        '- ACCOUNT_INFO (e.g. my account, who am I, my role)\n' +
        '- POLICIES (e.g. library rules, return policy, how many days)\n' +
        '- RECOMMENDATIONS (e.g. recommend me a book, what should I read)\n' +
        '- STUDY_PLAN (e.g. make a study plan, learning schedule)\n' +
        '- GENERAL_CS (e.g. what is python, explain machine learning, write code)\n' +
        '- OTHER (anything else, greetings)\n\n' +
        'User Message: "' + message + '"\n' +
        'Return ONLY the exact category name. Nothing else.';

    const response = await callGroq([{ role: 'user', content: prompt }], 'llama-3.1-8b-instant', 10);
    return response.trim().toUpperCase();
};

const handleChat = async (userId, message, history = []) => {
    let intent = 'OTHER';
    try {
        intent = await classifyIntent(message);
    } catch (err) {
        console.error('[Chat Service] Intent classification failed, defaulting to OTHER');
    }
    console.log('[Chat Service] Detected intent:', intent);

    // Ensure all overdue fines are synced globally before reading context
    try {
        await fineService.syncOverdueFines();
    } catch (syncErr) {
        console.error('[Chat Service] Fine sync failed:', syncErr);
    }

    let contextData = '';
    
    try {
        if (intent === 'LIBRARY_SEARCH' || intent === 'RECOMMENDATIONS' || intent === 'STUDY_PLAN') {
            const [books] = await db.query('SELECT title, author, category, available_copies FROM books WHERE available_copies > 0');
            contextData = 'Available Books Catalog:\n' + JSON.stringify(books);
        } else if (intent === 'MY_BOOKS') {
            const [issued] = await db.query(
                'SELECT b.title, b.author, ib.issue_date, ib.due_date, ib.status ' +
                'FROM issued_books ib ' +
                'JOIN books b ON ib.book_id = b.id ' +
                'WHERE ib.user_id = ? AND ib.status != \'returned\'', 
                [userId]
            );
            contextData = 'User\'s Currently Borrowed Books:\n' + JSON.stringify(issued);
        } else if (intent === 'MY_FINES') {
            const [fines] = await db.query(
                'SELECT amount, status, created_at FROM fines WHERE user_id = ? AND status = \'unpaid\'',
                [userId]
            );
            contextData = 'User\'s Unpaid Fines:\n' + JSON.stringify(fines);
        } else if (intent === 'MY_RESERVATIONS') {
            const [reservations] = await db.query(
                'SELECT b.title, r.reservation_date, r.expiry_date, r.status ' +
                'FROM reservations r ' +
                'JOIN books b ON r.book_id = b.id ' +
                'WHERE r.user_id = ? AND r.status = \'Active\'',
                [userId]
            );
            contextData = 'User\'s Active Reservations:\n' + JSON.stringify(reservations);
        } else if (intent === 'ACCOUNT_INFO') {
            const [users] = await db.query('SELECT name, email, role, created_at FROM users WHERE id = ?', [userId]);
            contextData = 'User\'s Account Information:\n' + JSON.stringify(users[0] || {});
        } else if (intent === 'POLICIES') {
            contextData = 'NexusLib Policies:\n' +
                '- Students can borrow up to 3 books at a time.\n' +
                '- Standard borrowing period is 14 days.\n' +
                '- Overdue books incur a fine of $1 per day.\n' +
                '- Reservations expire after 48 hours if not collected.\n' +
                '- Librarians can manage books, issues, returns, and view dashboards.';
        }
    } catch (dbErr) {
        console.error('[Chat Service] DB context fetch error:', dbErr);
    }

    const systemPrompt = 'You are the NexusLib AI Assistant, a helpful and polite chatbot for a library management system.\n' +
        'You help users with their library accounts, books, study planning, and general computer science questions.\n\n' +
        'IMPORTANT RULES:\n' +
        '1. NEVER invent library data (books, fines, reservations). ONLY use the provided DB context.\n' +
        '2. If the user asks about their account/books/fines and the context shows empty/none, politely tell them they have no books/fines/etc.\n' +
        '3. If the user asks for book recommendations, suggest books strictly from the "Available Books Catalog" context.\n' +
        '4. Format your responses beautifully using Markdown. Use bolding, lists, and clear paragraphs.\n' +
        '5. Keep responses concise but helpful.\n\n' +
        'CONTEXT DATA FROM DATABASE:\n' +
        (contextData || 'No specific database context needed or found for this query.');

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-5).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message }
    ];

    const finalResponse = await callGroq(messages, 'llama-3.3-70b-versatile', 1024);
    return finalResponse;
};

module.exports = { handleChat };
