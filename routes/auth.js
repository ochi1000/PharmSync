const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const validation = require('../middleware/validation');
const authValidation = require('../middleware/validators/auth');

router.route('/')
    .post(authValidation, validation, auth.handleLogin)

module.exports = router;
