import { z } from 'zod'

export const noteSchema = z.object({
    title: z.string().max(30),
    content: z.string(),
    categories: z.array(z.string()),
    priority: z.number().min(0).max(5),
    favorite: z.boolean()
});

export const noteEditSchema = z.object({
    title: z.string().max(30).optional(),
    content: z.string().optional(),
    categories: z.array(z.string()).optional(),
    priority: z.number().min(0).max(5).optional(),
    favorite: z.boolean().optional()
})

export const categorySchema = z.object({
    title: z.string().max(20),
    emoji: z.string().emoji()
})