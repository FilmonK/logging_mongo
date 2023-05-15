import mongoose, { Document, Schema } from "mongoose";

export interface ILogs {
    name: String,
    priority: Number,
    logtype: Number,
    datetime: Date,
    msg: String
}

export interface ILogs extends Document { }

const LogsSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        priority: { type: Number, required: true},
        logtype: { type: Number, required: true},
        datetime: { type: Date, required: true},
        msg: { type: String, required: true}
    },
    {
        versionKey: true
    }
)


export default mongoose.model<ILogs>('Author', LogsSchema, "loginfo")