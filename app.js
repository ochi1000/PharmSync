const express = require('express');
const app = express();
const port = 5000;
const dbConnect = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const { sendVerifyEmail } = require('./controllers/userController');
const upload = multer();
const nodeCron = require('node-cron');
const { expireProduct } = require('./controllers/productController');

// connect DB
dbConnect.connect();

// cors middleware
app.use(cors());

// custom request logger
app.use(logger);

// for parsing multipart/form-data
// app.use(upload.any());
app.use(express.static('public'));


// built in middleware to handle urlencoded data in other words form data
// content type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// built in middleware for json
app.use(express.json());

// routes
app.get('/', (req, res) => res.send('Home Page'));
app.use('/auth', require('./routes/auth'));
app.use('/register', require('./routes/register'));
app.use('/user', require('./routes/user'));
// app.use('/verify', sendVerifyEmail);
app.use('/product', require('./routes/product'));
app.use('/category', require('./routes/category'));

// cron job to expire products
// nodeCron.schedule("*/10 * * * * *", expireProduct);

app.all('*', (req, res) =>{
    res.status(StatusCodes.NOT_FOUND).send('Not Found');
});

app.use(errorHandler);

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`This app runs on port ${port}!!`));
})
