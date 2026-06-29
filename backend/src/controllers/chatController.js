const chatService = require('../services/chatService');

const handleChatMessage = async (req, res) => {
    const { message, history } = req.body;
    const userId = req.user.id;

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    try {
        const responseText = await chatService.handleChat(userId, message, history || []);
        
        res.json({
            success: true,
            response: responseText
        });
    } catch (error) {
        console.error('[Chat Controller] Error handling chat message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message.',
            error: error.message
        });
    }
};

module.exports = { handleChatMessage };
