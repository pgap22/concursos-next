import z from "zod"

export const loginSchema = z.object({
    usuario: z.string(),
    password: z.string()
})

export type Login = z.infer<typeof loginSchema>