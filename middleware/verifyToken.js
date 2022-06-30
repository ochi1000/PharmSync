const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.status(StatusCodes.FORBIDDEN).json({"message":"Invalid token"});
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(StatusCodes.FORBIDDEN).json({"message":"Invalid token"});
            req.userId = decoded.userId;
            req.roles = decoded.roles;
            next();
        }
    )
}

module.exports = verifyToken;