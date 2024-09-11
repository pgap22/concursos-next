import z from "zod"

export const usuarioSchema = z.object({
    usuario: z.string().min(1, {message: "Usuario es requerido: Se sugiere usar el nombre"}),
    password: z.string().min(1),
    nombre: z.string().min(1),
})
export const usuarioUpdateSchema = z.object({
    usuario: z.string(),
    password: z.string().or(z.literal("")).optional(),
    nombre: z.string(),
})
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>
export type Usuario = z.infer<typeof usuarioSchema>