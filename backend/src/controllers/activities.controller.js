const Activity = require('../models/Activity');

async function getAll(req, res) {
  try {
    const activities = await Activity.getAllActivities();
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
}

async function getOne(req, res) {
  try {
    const activity = await Activity.getActivityById(req.params.id);
    if (!activity) {
      return res.status(404).json({ error:'Activity not found'});
    }
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch activity'});
  }
}

async function create(req, res) {
  try {
    const activity = await Activity.createActivity(req.body);
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create activity' });
  }
}

async function update(req, res) {
  try {
    const activity = await Activity.updateActivity(req.params.id, req.body);
    if (!activity) return res.status(404).json({ error: 'Activity not found'});
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update activity' });
  }
}

async function remove(req, res) {
  try {
    const activity = await Activity.deleteActivity(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json({ message: 'Activity deleted', activity});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
}

module.exports = { getAll, getOne, create, update, remove };