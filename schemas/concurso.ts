
import { z } from "zod";

export const concursoSchema = z.object({
  nombre: z.string().min(1), // nombre debe ser una cadena
  descripcion: z.string().min(1), // nombre debe ser una cadena
  fecha: z.date().or(z.string().min(1)), // fecha debe ser un objeto Date
  id_rubrica: z.string().min(1).or(z.literal("")), // id_rubrica puede ser una cadena o nulo
});

export type ConcursoRegister = z.infer<typeof concursoSchema>