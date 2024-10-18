import { ObjectId, Document} from "mongoose";
import { z } from 'zod'
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    deleted: boolean;
}

export interface INote extends Document {
    title: string,
    content: string,
    categories: string[] | ObjectId[],
    owner: string | ObjectId,
    priority: number,
    favorite: boolean,
    deleted: boolean,
}

export interface ICategory extends Document {
    title: string,
    owner: string | ObjectId,
    emoji: string
}

export interface IPasswordResetToken extends Document {
    username: string,
    token : string,
    createdAt: Date
}

export interface Mail {
    to: string,
    subject: string,
    html: string,
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}