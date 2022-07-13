const express = require('express');
const Roles = require('../config/roles');
const router = express.Router();
const {getProducts, createProduct, updateProduct, getProduct, deleteProduct, expireProduct} = require('../controllers/productController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../config/multer');

router.route('/')
    .get(getProducts)
    .post(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), upload.array('image', 3), createProduct)
    .put(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), upload.array('image', 3), updateProduct)
    .delete(verifyToken, verifyRoles(Roles.Admin, Roles.Merchant), deleteProduct)

router.route('/expiry')
    .get(expireProduct);

router.route('/:id')
    .get(getProduct)
module.exports = router;
