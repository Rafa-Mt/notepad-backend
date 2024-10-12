import { ObjectId, Document} from "mongoose";
import { z } from 'zod'
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type Priority = 0 | 1 | 2 | 3 | 4 | 5;

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    deleted: boolean;
}

export interface INote extends Document {
    title: string,
    content: string,
    categories: ObjectId[],
    owner: ObjectId,
    priority: Priority,
    favorite: boolean,
    deleted: boolean,
}

export interface ICategory extends Document {
    title: string,
    owner: ObjectId
}

export interface IPasswordResetToken extends Document {
    username: string,
    token : string,
    createdAt: Date
}

export interface Mail {
    to: string,
    subject: string,
    text?: string,
    html?: string,
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}