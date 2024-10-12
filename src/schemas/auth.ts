import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().refine(s => !s.includes(' '), 'No Spaces!'),
    email: z.string().email(),
    password: z.string().min(8)
});

export const loginSchema = z.object({
    username: z.string().refine(s => !s.includes(' '), 'No Spaces!'),
    password: z.string().min(8)
})

export const passwordResetSchema = z.object({
    username: z.string().refine(s => !s.includes(' '), 'No Spaces!'),
    newPassword: z.string().min(8),
    token: z.string()
});

export const resetRequestSchema = z.object({
    email: z.string().email()
})