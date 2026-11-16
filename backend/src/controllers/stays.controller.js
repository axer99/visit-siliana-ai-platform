const Stay = require('../models/Stay');

async function getAll(req, res) {
    try {
        const stays = await Stay.getAllStays();
        res.json(stays);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stays' });
    }
}

async function getOne(req, res) {
    try {
        const stay = await Stay.getStaysById(req.params.id);
        if(!stay) {
            return res.status(404).json({ error: 'Stays not found'});
        }
        res.json(stay);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stay'});
    }
}

async function create(req, res) {
    try {
        const stay = await Stay.createStay(req.body);
        res.status(201).json(stay);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create stay' });
    }
}

async function update(req, res) {
    try {
        const stay = await Stay.updateStay(req.params.id, req.body);
        if(!stay) return res.status(404).json({ error: 'Stay not found'});
        res.json(stay);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update stay' });
    }
}

async function remove(req, res) {
  try {
    const stay = await Stay.deleteStay(req.params.id);
    if (!stay) return res.status(404).json({ error: 'Stay not found' });
    res.json({ message: 'Stay deleted', stay });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Impossible de supprimer cet hébergement : des réservations existantes y sont encore associées.'
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete stay' });
  }
}

module.exports = { getAll, getOne, create, update, remove };

