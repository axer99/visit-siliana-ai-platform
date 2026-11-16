const express = require('express');
const router = express.Router();
const staysController = require('../controllers/stays.controller');
const requireAuth = require('../middleware/auth.middleware');


router.get("/", staysController.getAll);
router.get("/:id", staysController.getOne);
router.post("/", requireAuth, staysController.create);
router.put("/:id", requireAuth, staysController.update);
router.delete("/:id", requireAuth, staysController.remove);

module.exports = router;