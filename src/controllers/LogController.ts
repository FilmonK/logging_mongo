import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Logs from "../modules/Logs";

const getAllLogs = async (req: Request, res: Response, next: NextFunction) => {
    const allLogs = await Logs.find()
        .then(logData => {
            console.log(logData)
            res.status(200).json({ logData })

        })
        .catch(error => {
            console.log(`Error retrieving all logs: ${error}`)
            res.status(500).json({ error })
        })
}


const createLog = async (req: Request, res: Response, next: NextFunction) => {
    const { name, priority, logtype, msg } = req.body
    console.log(name, priority, logtype, msg)

    const createNewLog = new Logs({
        _id: new mongoose.Types.ObjectId(),
        name, 
        priority, 
        logtype, 
        datetime: new Date(), 
        msg
    })

    try {
        await createNewLog.save().then(savedRecord => {
            console.log(savedRecord)
            res.status(201).json({createNewLog})
        })

    } catch (error) {
        console.log(`Error attempting to create new log record: ${error}`)
        res.status(500).json({ error })
    }
}


export default { getAllLogs, createLog }