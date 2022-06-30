const { hash } = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");
const jwt = require('jsonwebtoken');
const asyncFn = require("../middleware/asynFunction");
const User = require("../models/User");

const createUser = asyncFn( async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(StatusCodes.BAD_REQUEST).send('Email and Password are required');
    const foundUser = await User.findOne({email});
    if(foundUser) return res.status(StatusCodes.BAD_REQUEST).send('Email already used');

    const securePwd = await hash(password, 10);
    
    const newUser = await User.create({
        "email": email,
        "password": securePwd
    });
    newUser.token = jwt.sign(
        {email, password:securePwd},
        process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'}
    )
    res.status(StatusCodes.CREATED).json(newUser);

})

const getUsers = asyncFn( async( req, res) => {
    const users = await User.find();
    // validate
    if(!users) return res.status(StatusCodes.NOT_FOUND).json({"message": "No users found"});

    res.status(StatusCodes.OK).json({"data":users, "message":"Users Found"});
})

const getUser = asyncFn( async(req, res) => {
    const {id} = req.params
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is invalid"});
    
    const user = await User.findById(id).exec();
    if(!user) return res.status(StatusCodes.NOT_FOUND).json({"message":"User not found"});
    
    res.status(StatusCodes.OK).json({"data":user,"message":"User found"});
});

const updateUser = asyncFn( async(req, res) => {
    let{id, phone, roles, password} = req.body;
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is invalid"});
    
    const user = await User.findById(id).exec();
    if(!user) return res.status(StatusCodes.NOT_FOUND).json({"message":"User not found"});

    if(password) user.password = await hash(password, 10);
    if(phone) user.phone = phone;
    if(roles) user.roles = roles;
    roles = Object.values(user.roles);
    
    const updatedUser = await user.save();
    updatedUser.token = jwt.sign(
        {
            userId: user._id,
            roles: roles
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    
    res.status(StatusCodes.OK).json({"data":updatedUser, "message":"User updated"});
});

const deleteUser = asyncFn( async( req, res) => {
    const {id} = req.body;
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "User ID is invalid"});
    
    const user = await User.findById(id).exec();
    if(!user) return res.status(StatusCodes.NOT_FOUND).json({"message":"User not found"});

    const deletedUser = await User.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({"message":"User deleted"});
});

module.exports = {createUser, getUsers, getUser, updateUser, deleteUser};