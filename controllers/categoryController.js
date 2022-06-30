const { StatusCodes } = require('http-status-codes');
const { isValidObjectId } = require('mongoose');
const asyncFn = require('../middleware/asynFunction');
const Category = require('../models/Category');

const createCategory = asyncFn( async(req, res) => {
    const {name} = req.body;
    // validation
    if(!name) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Category name is required'});
    const duplicate = await Category.findOne({name});
    if(duplicate) return res.status(StatusCodes.CONFLICT).json({'message':'Category already exists'});

    const newCategory = await Category.create({
        "name": name
    })
    res.status(StatusCodes.CREATED).json({data:newCategory});
});

const getCategories = asyncFn( async(req, res) =>{
    const categories = await Category.find().populate('products','name');
    // validate
    if(!categories) return res.status(StatusCodes.NOT_FOUND).json({'message':'No categories found'});
    
    res.status(StatusCodes.OK).json({data:categories});
});

const getCategory = asyncFn( async(req, res) => {
    const id = req.params.id;
    // validate
    if(!id) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Id is required'});
    if(!isValidObjectId(id)) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Id is invalid'});

    const category = await Category.findById(id).exec();
    if(!category) return res.status(StatusCodes.NOT_FOUND).json({'message':'Category does not exist'});

    res.status(StatusCodes.OK).json({'data':category, 'message':'Category Found'});
});

const updateCategories = asyncFn( async(req, res) => {
    const{id, name} = req.body;
    // validate
    if(!id || !name) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Incomplete fields'});
    if(!isValidObjectId(id)) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Id is invalid'});

    const category = await Category.findById(id).exec();
    if(!category) return res.status(StatusCodes.NOT_FOUND).json({'message':'Category does not exist'});

    category.name = name;
    const result = await category.save();
    res.status(StatusCodes.OK).json({"data":result,'message':'Category updated '});
})

const deleteCategory = asyncFn( async(req, res) => {
    const{id} = req.body
    // validate
    if(!id) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Id is required'});
    if(!isValidObjectId(id)) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Id is invalid'});

    const category = await Category.findOne({_id: id}).exec();
    if(!category) return res.status(StatusCodes.NOT_FOUND).json({'message':'Category not found'});
    const deleted = await Category.findByIdAndDelete(id);

    res.status(StatusCodes.NO_CONTENT).json({'message':'Category deleted '});
})

module.exports = {
    createCategory, 
    getCategories, 
    getCategory, 
    updateCategories, 
    deleteCategory
};