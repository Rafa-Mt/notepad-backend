import { z } from 'zod'

export const noteSchema = z.object({
    title: z.string().max(30),
    content: z.string(),
    categories: z.array(z.string()),
    priority: z.number().min(0).max(5),
    favorite: z.boolean()
});


export const categorySchema = z.object({
    title: z.string().max(20),
    emoji: z.string().emoji()
})