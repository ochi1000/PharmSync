const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {StatusCodes} = require("http-status-codes");
const asyncFn = require('../middleware/asynFunction.js');

const handleLogin = asyncFn( async (req, res) =>{
        const{email, password} = req.body;
        return res.json({email, password});
        if(!email || !password) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({'message': 'Email and Password are required'});
        const foundUser = await User.findOne({email});
        if(!foundUser) return res.sendStatus(StatusCodes.UNAUTHORIZED); //Unauthorized
        const validPwd = await bcrypt.compare(password, foundUser.password);
        if(!validPwd) return res.sendStatus(StatusCodes.UNAUTHORIZED); //Unauthorized

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign({
                userId: foundUser._id,
                roles: roles
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn:'1d'}
        ); 
        foundUser.token = accessToken
        res.status(StatusCodes.OK).json(foundUser); //Access Granted
    })

module.exports = {
    handleLogin
}
