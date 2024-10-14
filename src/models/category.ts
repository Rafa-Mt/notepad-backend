import { model, Schema } from "mongoose";
import { ICategory } from "../types";

export const categorySchema = new Schema<ICategory>({
    title: { type: String, required: true },
    owner: { type: String, required: true },
    emoji: { type: String, required: true },
});

export const Category = model<ICategory>('category', categorySchema);