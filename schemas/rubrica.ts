import z from "zod"

export const rubricaSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
})

export type RubricaSchema = z.infer<typeof rubricaSchema>