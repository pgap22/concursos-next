import z from "zod"

export  const concursanteSchema = z.object({
    nombre: z.string().min(1),
    institucion: z.string().min(1),
})

export type Concursante = z.infer<typeof concursanteSchema>