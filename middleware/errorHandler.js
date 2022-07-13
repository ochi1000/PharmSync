const { StatusCodes } = require("http-status-codes");
const {logEvents} = require("./logEvents");

const errorHandler = function (err, req, res, next){
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`${err.name}: ${err.stack}`);
}

// const errorHandler = (error, request, response, next) => {
//     console.log( `error ${error.message}`) 
//     // next(error) // calling next middleware
//   }

module.exports = errorHandler;