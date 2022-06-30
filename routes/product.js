const express = require('express');
const Roles = require('../config/roles');
const router = express.Router();
const {getProducts, createProduct, updateProduct, getProduct, deleteProduct} = require('../controllers/productController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyToken = require('../middleware/verifyToken');
const { route } = require('./category');

router.route('/')
    .get(getProducts)
    .post(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), createProduct)
    .put(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), updateProduct)
    .delete(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), deleteProduct)

router.route('/:id')
    .get(getProduct)
module.exports = router;
