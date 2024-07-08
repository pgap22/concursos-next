import z from "zod"

export const usuarioSchema = z.object({
    usuario: z.string(),
    password: z.string(),
    nombre: z.string(),
})
export const usuarioUpdateSchema = z.object({
    usuario: z.string(),
    password: z.string().or(z.literal("")).optional(),
    nombre: z.string(),
})
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>
export type Usuario = z.infer<typeof usuarioSchema>