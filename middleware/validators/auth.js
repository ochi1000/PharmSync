const {check} = require('express-validator');

const authValidation = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email')
        .toLowerCase(),
    check('password')
        .trim()
        .not()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min:8, max:100})
        .withMessage('Password must not be less than 8 characters')
];

module.exports = authValidation;