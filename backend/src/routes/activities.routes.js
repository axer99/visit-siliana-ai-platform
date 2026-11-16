const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities.controller');
const requireAuth = require('../middleware/auth.middleware');

router.get("/", activitiesController.getAll);
router.get("/:id", activitiesController.getOne);
router.post("/", requireAuth, activitiesController.create);
router.put('/:id', requireAuth, activitiesController.update);
router.delete('/:id', requireAuth, activitiesController.remove);

module.exports = router;