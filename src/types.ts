import { ObjectId, Document} from "mongoose";
import { z } from 'zod'

export type Email = `${string}@${string}.${string}`;
export type Priority = 0 | 1 | 2 | 3 | 4 | 5;

export interface IUser extends Document {
    username: string;
    email: Email;
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

export interface Mail {
    to: Email,
    subject: string,
    text?: string,
    html?: string,
}