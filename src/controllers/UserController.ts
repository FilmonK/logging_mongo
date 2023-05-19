import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import * as mongoDB from "mongodb";
import { config } from '../config/config';
import bcrypt from 'bcryptjs';
import User from "../modules/User";
// import Tokens from "../modules/Tokens"
import { tokenModel, refreshTokenModel } from "../modules/Tokens";
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../middleware/GenTokens";
import { registerValidation, loginValidation } from "../middleware/Joi";

import dotenv from 'dotenv'
dotenv.config()


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

        // generate access and refresh tokens to save in mongoDB
        const accessToken = new tokenModel({
            tokenString: generateAccessToken(user),
            date: new Date()
        })

        const newRefreshToken = new refreshTokenModel({
            refreshTokenString: generateRefreshToken(user),
            date: new Date()
        });

        try {
            await accessToken.save()
            await newRefreshToken.save()

            res.status(201).json({
                accessToken,
                newRefreshToken
            })
        } catch (error) {
            console.log(`Error saving tokens during login: ${error}`);
            res.status(500).json({ error })
        }
    } catch (err) {
        console.log(`Login token error: ${err}`);
    }
}


// Refresh token for session
const assignRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    //confirm there is a refresh token in the body of the request
    const refreshToken = req.body.rtoken
    //   console.log(refreshToken)
    if (!refreshToken) {
        res.status(400).send("Token could not be generated")
    }

    let tokenCollection = process.env.TOKENS_COLLECTION as string

    let clientConn = new mongoDB.MongoClient(config.mongo.url)
    const dbConnection = clientConn.db(process.env.DB).collection(tokenCollection)

    // 'tokenString' is the parameter from the Tokens mongoDB model
    let query = { tokenString: refreshToken }
    console.log("query check")
    console.log(query)

    //verify refresh token exists, remove refresh token from mongoDB, then proceed to issue a new auth and refresh token
    try {
        let foundAuthToken = await dbConnection.findOne(query)
        console.log(`Looking for token...`)
        console.log(foundAuthToken)

        if (foundAuthToken) {
            jwt.verify(foundAuthToken.tokenString, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
                console.log("verifying token stuff")
                if (err) {
                    console.log(`Found auth token but couldn't verify it: ${err}`)
                }
                // req.user = user;
                // next();
                console.log("Found token for user")
                console.log(user)

                console.log('foundtoken')
                console.log(foundAuthToken)

                if (foundAuthToken) {
                    //remove old refresh token from mongoDB

                    let removeRefreshToken = await dbConnection.deleteOne(foundAuthToken)
                    console.log("removeing old token")
                }

                // generate refresh token to save in mongoDB
                const newRefreshToken = new refreshTokenModel({
                    refreshTokenString: generateRefreshToken(user),
                    date: new Date()
                });

                try {
                    await newRefreshToken.save()

                    res.status(201).json({
                        newRefreshToken
                    })
                } catch (error) {
                    console.log(`Error saving tokens while generating refresh token: ${error}`);
                    res.status(500).json({ error })
                }
            })
        }
    } catch (error) {
        console.log(`Failed to locate refresh token: ${error}`)
    }

}


// Logout user
const logOutUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.body.token;
    // console.log(refreshToken);
    // remove refresh
    let clientConn = new mongoDB.MongoClient(config.mongo.url);
    let tokenCollection = process.env.TOKENS_COLLECTION as string
    const dbRef = clientConn.db(process.env.DB).collection(tokenCollection);

    let query = { token: accessToken };
    console.log("querying refresh token...")
    console.log(query);

    try {
        let res = await dbRef.findOne(query)
        console.log(res);
        if (res) {
            let delResult = await dbRef.deleteOne(query);
            console.log(`Deleted token...${delResult}`);
            console.log("You've been logged out")
        }
    } catch (error) {
        console.log(error);

    } finally {
        clientConn.close();
    }
}


export default { newUser, loginUser, assignRefreshToken, logOutUser }