const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const admin = await Admin.getAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const passwordMatches = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { adminId: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h'}
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Login failed'});
    }
}
    
module.exports = { login };
