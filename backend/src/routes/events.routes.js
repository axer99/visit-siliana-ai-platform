const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const requireAuth = require('../middleware/auth.middleware');

router.get('/', eventsController.getAll);
router.get('/:id', eventsController.getOne);
router.post("/", requireAuth, eventsController.create);
router.put('/:id', requireAuth, eventsController.update);
router.delete('/:id', requireAuth, eventsController.remove);

module.exports = router;