import mongoose, { Document, Schema } from "mongoose";

export interface IToken {
    tokenString: string,
    date: Date
}

export interface IToken extends Document { }

const TokenSchema: Schema = new Schema(
    {
        tokenString: { type: String, required: true, min: 6, max: 255 },
        date: { type: Date, required: true },
    },
    {
        versionKey: false
    }
)

const RefreshTokenSchema: Schema = new Schema(
    {
        refreshTokenString: { type: String, required: true, min: 6, max: 255 },
        date: { type: Date, required: true },
    },
    {
        versionKey: false
    }
)

export const tokenModel = mongoose.model<IToken>('Tokens', TokenSchema, 'tokens');
export const refreshTokenModel = mongoose.model<IToken>('RefreshToken', RefreshTokenSchema, 'refreshtokens');
