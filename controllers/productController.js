const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");
const asyncFn = require("../middleware/asynFunction");
const Product = require("../models/Product");

const createProduct = asyncFn( async(req, res) => {
    const {name, price, location, categoryId} = req.body;
    // validate
    if(!name || !price || !categoryId) return res.status(StatusCodes.BAD_REQUEST).json({"message":"Incomplete fields"});
    if(!isValidObjectId(categoryId)) return res.status(StatusCodes.BAD_REQUEST).json({"message":"category Id is invalid"});

    const newProduct = await Product.create({
        "name":name,
        "price":price,
        "location":location,
        "category": categoryId
    });
    res.status(StatusCodes.CREATED).json({"data":newProduct, "message":"New product created"})
})

const getProducts = asyncFn( async( req, res) => {
    const products = await Product.find();
    // validate
    if(!products) return res.status(StatusCodes.NOT_FOUND).json({"message": "No products found"});

    res.status(StatusCodes.OK).json({"data":products, "message":"Products Found"});
})

const getProduct = asyncFn( async(req, res) => {
    const {id} = req.params
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is invalid"});
    
    const product = await Product.findById(id).exec();
    if(!product) return res.status(StatusCodes.NOT_FOUND).json({"message":"Product not found"});
    
    res.status(StatusCodes.OK).json({"data":product,"message":"Product found"});

});

const updateProduct = asyncFn( async(req, res) => {
    const{id, name, price, category} = req.body;
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is invalid"});
    
    const product = await Product.findById(id).exec();
    if(!product) return res.status(StatusCodes.NOT_FOUND).json({"message":"Product not found"});

    if(name) product.name = name;
    if(price) product.price = price;
    if(category && isValidObjectId(category)) product.category = category;
    
    const updatedProduct = await product.save();

    res.status(StatusCodes.OK).json({"data":updatedProduct, "message":"Product updated"});

});

const deleteProduct = asyncFn( async( req, res) => {
    const {id} = req.body;
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is invalid"});
    
    const product = await Product.findById(id).exec();
    if(!product) return res.status(StatusCodes.NOT_FOUND).json({"message":"Product not found"});

    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({"message":"Product deleted"});
});

module.exports = {createProduct, getProducts, getProduct, updateProduct, deleteProduct};