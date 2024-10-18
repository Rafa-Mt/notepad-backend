import { z } from 'zod'
import { Schema } from 'mongoose'

export const noteSchema = z.object({
    title: z.string().max(30),
    content: z.string().max(250),
    categories: z.array(z.instanceof(Schema.Types.ObjectId)),
    priority: z.number().min(0).max(5),
    favorite: z.boolean()
});

export const categorySchema = z.object({
    title: z.string().max(20),
    emoji: z.string().emoji()
})