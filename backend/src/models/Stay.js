const pool = require('../config/db');

async function getAllStays() {
    const result  = await pool.query('SELECT * FROM stays ORDER BY id');
    return result.rows;
}

async function getStaysById(id) {
    const result = await pool.query('SELECT * FROM stays WHERE id = $1', [id]);
    return result.rows[0];
}

async function createStay({ title, type, capacity, price_per_night, description, image_url }) {
    const result = await pool.query(
        `INSERT INTO stays (title, type, capacity, price_per_night, description, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [title, type, capacity, price_per_night, description, image_url]
    );
    return result.rows[0];
}

async function updateStay(id, { title, type, capacity, price_per_night, description, image_url }) {
    const result = await pool.query(
        `UPDATE stays
        SET title = $1, type = $2, capacity = $3, price_per_night = $4, description = $5, image_url = $6
        WHERE id = $7
        RETURNING *`,
        [title, type, capacity, price_per_night, description, image_url, id]
    );
    return result.rows[0];
}

async function deleteStay(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Nullify the FK in bookings so the constraint doesn't block the delete
        await client.query('UPDATE bookings SET stay_id = NULL WHERE stay_id = $1', [id]);
        const result = await client.query('DELETE FROM stays WHERE id = $1 RETURNING *', [id]);
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { getAllStays, getStaysById, createStay, updateStay, deleteStay };