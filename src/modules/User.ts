import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    name: String,
    email: String,
    password: String

}

export interface IUser extends Document { }

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String },
        password: { type: String }
    },
    {
        versionKey: false
    }
)

export default mongoose.model<IUser>('User', UserSchema, 'user')