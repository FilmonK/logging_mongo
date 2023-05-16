import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from "../modules/User";
import Tokens from "../modules/Tokens"
import { generateAccessToken, generateRefreshToken } from "../middleware/GenTokens";
import { registerValidation, loginValidation } from "../middleware/Joi";



// Register new user
const newUser = async (req: Request, res: Response, next: NextFunction) => {
    //check if body of request follows necessary schema
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // check if email already exists in mongoDB 
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.send("Email is already in use, please use another...")

    // hash password and create new user account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

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


// Login existing user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //check if body of request follows necessary schema
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //check if email exist
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send("Invalid email or password");

        //check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send("Invalid email or password");

        const accessToken = generateAccessToken(user);

        //new refresh token to save in mongoDB with Tokens model
        const refreshToken = new Tokens({
            tokenString: generateRefreshToken(user),
            date: new Date()
        });

        try {
            await refreshToken.save()
                .then((tokenData) => {
                    res.status(201).json({
                        tokenData
                    })
                })
        } catch (error) {
            console.log(`Saving token error: ${error}`);
            res.status(500).json({ error })
        }
    } catch (err) {
        console.log(`Login token error: ${err}`);
    }
}


export default { newUser, loginUser }