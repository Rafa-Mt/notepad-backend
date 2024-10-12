import { z } from 'zod'
import { Schema } from 'mongoose'

export const noteSchema = z.object({
    title: z.string(),
    content: z.string().max(250),
    categories: z.array(z.instanceof(Schema.Types.ObjectId)),
    owner: z.instanceof(Schema.Types.ObjectId),
    priority: z.number().min(0).max(5),
    favorite: z.boolean()
})

export const categorySchema = z.object({
    title: z.string(),
    owner: z.instanceof(Schema.Types.ObjectId)
})