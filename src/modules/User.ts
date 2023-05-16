import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    name: string,
    email: string,
    password: string

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