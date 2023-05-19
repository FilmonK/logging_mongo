//Middlware to verify access to private route
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authtoken');
    let users = req.body.user;
    console.log(users)
    if (!token) return res.status(401).send('Access Denied');
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
        // req.user = verified;
        let person = verified;
        console.log("person person person")
        console.log(person)
        next();
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}

export default verifyToken