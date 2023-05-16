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
    const { type, priority, logtype, datetime, msg } = req.body

    try {

    } catch (error) {

    }
}


export default { getAllLogs }