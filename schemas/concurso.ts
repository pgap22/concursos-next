
import { z } from "zod";

export const concursoSchema = z.object({
  nombre: z.string(), // nombre debe ser una cadena
  descripcion: z.string(), // nombre debe ser una cadena
  fecha: z.date().or(z.string()), // fecha debe ser un objeto Date
  id_rubrica: z.string().nullable().optional().or(z.literal("")), // id_rubrica puede ser una cadena o nulo
});

export type ConcursoRegister = z.infer<typeof concursoSchema>