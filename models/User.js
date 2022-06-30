const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    roles: {
        User:{
            type: Number,
            default: 2001
        },  
        Admin: Number,
        Merchant: Number,
    },
    password: {type: String, required: true},
    phone: {type: String, default: null},
    verified: {type:Boolean, default:false},
    token: {type: String, default: null}
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);