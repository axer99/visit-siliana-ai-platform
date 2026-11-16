const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const requireAuth = require('../middleware/auth.middleware');

router.get('/', requireAuth, bookingsController.getAll);
router.post('/', bookingsController.create);
router.put('/:id/status', requireAuth, bookingsController.updateStatus);
router.delete('/:id', requireAuth, bookingsController.remove);
router.post('/purge-cancelled', requireAuth, bookingsController.purgeOldCancelled);

module.exports = router;