const express = require('express');
const upload = require('../config/multer');
const Roles = require('../config/roles');
const router = express.Router();
const {getUsers, updateUser, getUser, deleteUser, sendVerifyEmail, verifyEmail} = require('../controllers/userController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyToken = require('../middleware/verifyToken');

router.route('/')
    .get(verifyToken, verifyRoles(Roles.Admin), getUsers)
    .put(verifyToken, upload.single('image'), updateUser)
    .delete(verifyToken, verifyRoles(Roles.Admin), deleteUser)
    
router.route('/verify')
    .get(verifyToken, sendVerifyEmail)
    .post(verifyToken, verifyEmail)
    
router.route('/:id')
    .get(verifyToken, getUser)


module.exports = router;
