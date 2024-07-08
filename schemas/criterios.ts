import { z } from "zod";
import { ponderacionSchema } from "./ponderacion";
import { v4 as uuidv4 } from "uuid";

export const criteriosSchema = z.object({
  id: z.string().min(1).uuid().optional(),
  nombre: z.string().min(1), // nombre debe ser una cadena
  descripcion: z.string().min(1), // nombre debe ser una cadena
  ponderaciones: z.array(ponderacionSchema).default([])
});

export type CriteriosSchema = z.infer<typeof criteriosSchema>