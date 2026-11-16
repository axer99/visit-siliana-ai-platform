const Booking = require('../models/Booking');

async function create(req, res) {
    try {
        const bookings = await Booking.createBooking(req.body);
        res.status(201).json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
}

async function getAll(req, res) {
  try {
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

async function updateStatus(req, res) {
  try {
    const booking = await Booking.updateBookingStatus(req.params.id, req.body.status);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
}

async function remove(req, res) {
  try {
    const booking = await Booking.deleteBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
}

async function purgeOldCancelled(req, res) {
  try {
    const deleted = await Booking.deleteOldCancelledBookings(24);
    res.json({
      message: `${deleted.length} réservation(s) annulée(s) supprimée(s).`,
      deletedIds: deleted.map((r) => r.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to purge cancelled bookings' });
  }
}

module.exports = { create, getAll, updateStatus, remove, purgeOldCancelled };