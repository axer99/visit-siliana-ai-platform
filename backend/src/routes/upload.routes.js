const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const requireAuth = require('../middleware/auth.middleware');
const uploadController = require('../controllers/upload.controller');

router.post('/', requireAuth, upload.single('image'), uploadController.uploadImage);

module.exports = router;