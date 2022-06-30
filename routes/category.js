const express = require('express');
const Roles = require('../config/roles');
const {createCategory, getCategories, updateCategories, getCategory, deleteCategory} = require('../controllers/categoryController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.route('/')
        .get(getCategories)
        .post(verifyToken, verifyRoles(Roles.Admin), createCategory)
        .put(verifyToken, verifyRoles(Roles.Admin), updateCategories)
        .delete(verifyToken, verifyRoles(Roles.Admin), deleteCategory)
        
router.route('/:id')
        .get(getCategory)
     
module.exports = router;