const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function run() {
    const email = 'your-email@example.com';
    const plainPassword = 'yourChosenPassword123';

    const hash = await bcrypt.hash(plainPassword, 10);
    await pool.query(
        'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
        [email, hash],
    );
    console.log("Admin created:" , email);
    pool.end();
}

run();