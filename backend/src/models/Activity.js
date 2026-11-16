const pool = require('../config/db');

async function getAllActivities() {
    const result = await pool.query('SELECT * FROM activities ORDER BY id');
    return result.rows;
}

async function getActivityById(id) {
    const result = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
    return result.rows[0];
}

async function createActivity({ title, type, difficulty, duration_hours, price, description, image_url }) {
    const result = await pool.query(
        `INSERT INTO activities (title, type, difficulty, duration_hours, price, description, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [title, type, difficulty, duration_hours, price, description, image_url]
    );
    return result.rows[0];
}

async function updateActivity(id, { title, type, difficulty, duration_hours, price, description, image_url }) {
    const result = await pool.query(
        `UPDATE activities
        SET title = $1, type = $2, difficulty = $3, duration_hours = $4, price = $5, description = $6, image_url = $7
        WHERE id = $8
        RETURNING *`,
        [title, type, difficulty, duration_hours, price, description,image_url , id]
    );
    return result.rows[0];
}

async function deleteActivity(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Nullify the FK in bookings so the constraint doesn't block the delete
        await client.query('UPDATE bookings SET activity_id = NULL WHERE activity_id = $1', [id]);
        const result = await client.query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { getAllActivities, getActivityById, createActivity, updateActivity, deleteActivity };