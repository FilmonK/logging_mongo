import mongoose, { Document, Schema } from "mongoose";

export interface IToken {
    tokenString: string,
    date: Date
}

export interface IToken extends Document {}

const TokenSchema: Schema = new Schema(
    {
        tokenString: { type: String, required: true, min: 6, max: 255 },
        date: { type: Date, required: true },
},
{
    versionKey: false
}
)


//the third parameter ('reftokens') is referencing the specific collection in MongoDB Atlas
export default mongoose.model<IToken>('Tokens', TokenSchema, 'tokens');