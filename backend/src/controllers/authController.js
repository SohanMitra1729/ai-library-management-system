const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    console.log("Register request:", req.body);
    const { name, email, password, role } = req.body;

    try {
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Validate role against enum
        const userRole = ['student', 'faculty', 'librarian'].includes(role) ? role : 'student';

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            role: userRole,
            token: generateToken(result.insertId, userRole),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    console.log("\n--- [DEBUG] Login Request Started ---");
    console.log("Email received:", req.body.email);
    const { email, password } = req.body;

    try {
        console.log(`Executing SQL: SELECT * FROM users WHERE email = '${email}'`);
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.log("❌ Reason: User not found in database for email:", email);
            console.log("---------------------------------------\n");
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        console.log("✅ User found in database:", user.email);
        console.log("Password Hash from DB:", user.password_hash ? "[EXISTS]" : "[MISSING]");
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log("Password comparison (bcrypt.compare) result:", isMatch);

        if (isMatch) {
            console.log("✅ Login successful for:", user.email);
            console.log("---------------------------------------\n");
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            console.log("❌ Reason: Password mismatch (bcrypt.compare returned false)");
            console.log("---------------------------------------\n");
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getMe };
