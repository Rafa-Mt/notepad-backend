import { z } from 'zod'
import { Schema } from 'mongoose'

export const registerSchema = z.object({
    username: z.string().refine(s => !s.includes(' '), 'No Spaces!'),
    email: z.string().email(),
    password: z.string().min(8)
});

export const loginSchema = z.object({
    username: z.string().refine(s => !s.includes(' '), 'No Spaces!'),
    password: z.string().min(8)
})

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