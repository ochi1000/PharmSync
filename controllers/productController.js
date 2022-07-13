const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");
const asyncFn = require("../middleware/asynFunction");
const Product = require("../models/Product");
const cloudinary = require('../config/cloudinary');
const upload = require("../config/multer");

const createProduct = asyncFn( async(req, res) => {
    const {name, price, location, category, owner, quantity, description} = req.body;
    const files = req.files;
    // validate
    if(!name || !price || !category || !owner) return res.status(StatusCodes.BAD_REQUEST).json({"message":"Incomplete fields"});
    if(!req.files || !files.length) return res.status(StatusCodes.BAD_REQUEST).json({'message':'Image is required'});
    if(!isValidObjectId(category)) return res.status(StatusCodes.BAD_REQUEST).json({"message":"category ID is invalid"});    
    if(!isValidObjectId(owner)) return res.status(StatusCodes.BAD_REQUEST).json({"message":"owner ID is invalid"});    

    let images = [];
    for(const file of files ){
        const imagePath = await cloudinary.uploader.upload(file.path);
        images.push({
            "public_id": imagePath.public_id,
            "secure_url": imagePath.secure_url
        });
    }
    // return res.json(images);
    const newProduct = await Product.create({
        name,
        price,
        category,
        images,
        owner,
        "location": location || null,
        "quantity": quantity || 1,
        "description": description || null
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
    const {id, name, price, location, category, owner, quantity, description} = req.body;
    const files = req.files;    
    // validate
    if(!id ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is required"});
    if(!isValidObjectId(id) ) return res.status(StatusCodes.BAD_REQUEST).json({"message": "Product ID is invalid"});
    
    const product = await Product.findById(id).exec();
    if(!product) return res.status(StatusCodes.NOT_FOUND).json({"message":"Product not found"});

    if(name) product.name = name;
    if(price) product.price = price;
    if(location) product.location = location;
    if(category && isValidObjectId(category)) product.category = category;
    if(owner && isValidObjectId(owner)) product.owner = owner;
    if(quantity) product.quantity = quantity;
    if(description) product.description = description;
    if(files){
        let images = [];
        for(const file of files ){
            const imagePath = await cloudinary.uploader.upload(file.path);
            images.push({
                "public_id": imagePath.public_id,
                "secure_url": imagePath.secure_url
            });
        }
        product.images = [product.images, ...images]
    }
    
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

const expireProduct = asyncFn( async(req, res, next) => {
    // set product validity to false if current date is less than current date
    // remove next() when testing with route
    // we do not want product that have one day left from expiry, so we use previous day
    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)

    try {
        const expired  = await Product.updateMany(
            {'expiresIn': {'$lte': yesterday}}, 
            {'$set': {'valid': false}}
        )
        res.send(expired);
        // next();
    } catch (error) {
        // next()
    }
}) 

module.exports = {createProduct, getProducts, getProduct, updateProduct, deleteProduct, expireProduct};