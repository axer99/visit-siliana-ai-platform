const Event = require('../models/Event');

async function getAll(req, res) {
  try {
    const events = await Event.getAllEvents();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

async function getOne(req, res) {
  try {
    const event = await Event.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found'});
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

async function create(req, res) {
    try {
        const event = await Event.createEvent(req.body);
        res.status(200).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create event' });
    }
}

async function update(req, res) {
    try {
        const event = await Event.updateEvent(req.params.id, req.body);
        if (!event) return res.status(404).json({error: 'Event not found'});
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update event' });
    }
}


async function remove(req, res) {
    try {
        const event = await Event.deleteEvent(req.params.id);
        if (!event) return res.status(404).json({error: 'Event not found'});
        res.json({message: 'Event deleted', event});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
}

module.exports = { getAll, getOne, create, update, remove };