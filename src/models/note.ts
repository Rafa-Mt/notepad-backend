import { model, Schema, Types } from "mongoose";
import { INote } from "../types";

export const noteSchema = new Schema<INote>({
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true }, 
    categories: [{ type: String, required: true }],
    owner: { type: Types.ObjectId, ref: 'user', required: true },
    priority: { type: Number, required: true },
    favorite: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true }
});

export const Note = model<INote>('note', noteSchema); 