import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from "../modules/User";
// import { generateAccessToken, generateRefreshToken } from "middleware/GenTokens";


// Register new user
const newUser = async (req: Request, res: Response, next: NextFunction) => {
    //check if body of request follows necessary schema
    //  const {error} = registerValidation(req.body)
    //  if (error) return res.status(400).send(error.details[0].message);

    //check if email already exists in mongoDB 
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.send("Email is already in use, please use another...")

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        await user.save().then((userData) => {
            console.log(userData)
            res.status(201).json({ userData })
        })

    } catch (error) {
        console.log(`Registering new user error: ${error}`);
        res.status(400).json({ error });
    }
}


export default { newUser }