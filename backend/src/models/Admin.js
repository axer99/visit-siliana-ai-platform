const pool = require("../config/db");

async function getAdminByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM admins WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

module.exports = { getAdminByEmail };