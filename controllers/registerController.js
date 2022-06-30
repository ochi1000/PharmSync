const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {StatusCodes} = require("http-status-codes");
const asyncFn = require('../middleware/asynFunction.js');

const register = asyncFn( async (req, res) =>{
        const {username, password} = req.body;
        if(!username || !password) return res.status(StatusCodes.UNAUTHORIZED).send('Username and Password are required');
        const foundUser = await User.findOne({username});
        if(foundUser) return res.status(StatusCodes.UNAUTHORIZED).send('Username already taken');

        const securePwd = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            "username": username,
            "password": securePwd
        });
        newUser.token = jwt.sign(
            {username, password:securePwd},
            process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'}
        )
        res.status(StatusCodes.CREATED).json(newUser);

    })

module.exports = {register}

