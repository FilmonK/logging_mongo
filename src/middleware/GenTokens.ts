const jwt = require('jsonwebtoken');

//Functions to generate access and refresh tokens
export const generateAccessToken = (user: any) => {
    return jwt.sign(
        { _id : user._id }, 
        process.env.TOKEN_SECRET,
        { expiresIn: "10m" }
    );
        
 }
 
export const generateRefreshToken = (user: any) => {
    return jwt.sign(
        { _id : user._id }, 
        process.env.REFRESH_SECRET,
        { expiresIn: "10m" }
    );
 }