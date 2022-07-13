const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    price:{type: mongoose.Types.Decimal128, required: true },
    quantity:{type: Number, default: 1},
    description:{type: String, default: null},
    location:{ type: String, default: null},
    images:[ 
        {
            public_id:{type: String, default: null},
            secure_url:{type: String, default: null}
        }
    ],
    category:{type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    valid:{type: Boolean, default: true},
    expiresIn:{type: Date, default: null}
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema);  