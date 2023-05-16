const jwt = require('jsonwebtoken');
import dotenv from 'dotenv'
dotenv.config()

//Functions to generate access and refresh tokens
const generateAccessToken = (user: any) => {
    return jwt.sign(
        { _id : user._id }, 
        process.env.TOKEN_SECRET,
        { expiresIn: "10m" }
    );
        
 }
 
const generateRefreshToken = (user: any) => {
    return jwt.sign(
        { _id : user._id }, 
        process.env.REFRESH_SECRET,
        { expiresIn: "10m" }
    );
 }


 export { generateAccessToken, generateRefreshToken }