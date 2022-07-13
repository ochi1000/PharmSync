const cloudinary = require('cloudinary');
require('dotenv').config();

const{CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env

cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET 
});

exports.uploads = (file, folder) => {
    return new Promise(resolve=>{
        cloudinary.uploader.upload(file,(result)=>{
            resolve({
                url:result.url,
                id:result.public_id
            })
        },{
            resource_type:"auto",
            folder:folder
        })
    }) 
}

module.exports = cloudinary;