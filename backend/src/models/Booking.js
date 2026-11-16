const pool = require('../config/db');

async function getPriceForBooking({ activity_id, stay_id, event_id }) {
  if (activity_id) {
    const result = await pool.query('SELECT price FROM activities WHERE id = $1', [activity_id]);
    return result.rows[0]?.price;
  }
  if (stay_id) {
    const result = await pool.query('SELECT price_per_night FROM stays WHERE id = $1', [stay_id]);
    return result.rows[0]?.price_per_night;
  }
  if (event_id) {
    return 0; // events currently have no price column — treat as free or 0 default
  }
  return null;
}

async function createBooking({ activity_id = null, stay_id = null, event_id = null, full_name, email, phone, people_count, booking_date, total_price: passedTotalPrice }) {
  const unitPrice = await getPriceForBooking({ activity_id, stay_id, event_id });
  let total_price = passedTotalPrice;
  if (total_price == null || total_price === '') {
    total_price = unitPrice != null ? unitPrice * people_count : null;
  }

  const result = await pool.query(
    `INSERT INTO bookings (activity_id, stay_id, event_id, full_name, email, phone, people_count, booking_date, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [activity_id, stay_id, event_id, full_name, email, phone, people_count, booking_date, total_price]
  );
  return result.rows[0];
}

async function getAllBookings() {
  const result = await pool.query(`
    SELECT
      bookings.*,
      COALESCE(
        bookings.total_price,
        activities.price * bookings.people_count,
        stays.price_per_night * bookings.people_count
      ) AS calculated_total_price,
      activities.title AS activity_title,
      activities.price AS activity_price,
      stays.title AS stay_title,
      stays.price_per_night AS stay_price,
      events.title AS event_title
    FROM bookings
    LEFT JOIN activities ON bookings.activity_id = activities.id
    LEFT JOIN stays ON bookings.stay_id = stays.id
    LEFT JOIN events ON bookings.event_id = events.id
    ORDER BY bookings.created_at DESC
  `);
  return result.rows;
}

async function updateBookingStatus(id, status) {
  const result = await pool.query(
    'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

async function deleteBooking(id) {
  const result = await pool.query(
    'DELETE FROM bookings WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

// Delete cancelled bookings older than the given interval (default 24 hours)
async function deleteOldCancelledBookings(intervalHours = 24) {
  const result = await pool.query(
    `DELETE FROM bookings
     WHERE status = 'cancelled'
       AND created_at < NOW() - INTERVAL '${intervalHours} hours'
     RETURNING id`
  );
  return result.rows; // returns array of deleted IDs
}

module.exports = { createBooking, getAllBookings, updateBookingStatus, deleteBooking, deleteOldCancelledBookings };