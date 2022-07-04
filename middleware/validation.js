const{validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncFn = require('./asynFunction');

const validation = asyncFn (async (req, res, next) =>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    validationErrors = [];
    errors.array().map(err =>
        validationErrors.push({[err.param]: err.msg})
    )
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: errors.array()[0].msg, 
        errors: validationErrors
    });
})

module.exports = validation;