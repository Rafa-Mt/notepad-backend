import { model, Schema, Types } from "mongoose";
import { INote } from "../types";

export const noteSchema = new Schema<INote>({
    title: { type: String, required: true },
    content: { type: String,  }, 
    categories: [{ type: String, }],
    owner: { type: Types.ObjectId, ref: 'user', required: true },
    priority: { type: Number, required: true },
    favorite: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
});

export const Note = model<INote>('note', noteSchema); 