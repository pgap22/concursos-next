import z from "zod"

export  const concursanteSchema = z.object({
    nombre: z.string(),
    institucion: z.string(),
})

export type Concursante = z.infer<typeof concursanteSchema>