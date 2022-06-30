const express = require('express');
const Roles = require('../config/roles');
const router = express.Router();
const {getUsers, updateUser, getUser, deleteUser} = require('../controllers/userController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyToken = require('../middleware/verifyToken');

router.route('/')
    .get(verifyToken, verifyRoles(Roles.Admin), getUsers)
    .put(verifyToken, updateUser)
    .delete(verifyToken, verifyRoles(Roles.Admin), deleteUser)

router.route('/:id')
    .get(verifyToken, getUser)
module.exports = router;
