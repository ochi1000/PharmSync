require('dotenv').config();
const mongoose = require('mongoose');

const {DATABASE_URL} = process.env;

const connect = async () =>{
    await mongoose
    .connect(DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error(`Database connection failed: ${err}`)
    })
}

module.exports = {connect};