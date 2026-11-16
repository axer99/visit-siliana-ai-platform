const pool = require('../config/db');

async function getAllEvents() {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date');
    return result.rows;
}

async function getEventById(id) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
}

async function createEvent({ title, description, event_date, location, image_url }) {
    const result = await pool.query(
        `INSERT INTO events (title, description, event_date, location, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [title, description, event_date, location, image_url]
    );
    return result.rows[0];
}

async function updateEvent(id, { title, description, event_date, location, image_url }) {
  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, event_date = $3, location = $4, image_url = $5
     WHERE id = $6
     RETURNING *`,
    [title, description, event_date, location, image_url, id]
  );
  return result.rows[0];
}

async function deleteEvent(id) {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      // Nullify the FK in bookings so the constraint doesn't block the delete
      await client.query('UPDATE bookings SET event_id = NULL WHERE event_id = $1', [id]);
      const result = await client.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
  } catch (err) {
      await client.query('ROLLBACK');
      throw err;
  } finally {
      client.release();
  }
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };