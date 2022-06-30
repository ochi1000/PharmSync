const { StatusCodes } = require("http-status-codes")

const verifyRoles =  (...allowedRoles) =>{
    return (req, res, next) =>{
        if(!req?.roles) return res.status(StatusCodes.FORBIDDEN).json({"message":"Invalid user role"});
        const rolesArray = [...allowedRoles]; 
        const result = req.roles.map(
            role => rolesArray.includes(role)
        ).find(val => val === true);
        if(!result) return res.status(StatusCodes.FORBIDDEN).json({"message":"User does not have access"});
        next();
    }
}

module.exports = verifyRoles;