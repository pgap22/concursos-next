import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const ponderacionSchema = z.object({
    id: z.string().uuid().default(uuidv4()),
  nombre: z.string(), // nombre debe ser una cadena
  tipo: z.enum(['personalizado', 'escalaUnoCinco', 'Si_No']), // nombre debe ser una cadena
});

export type PonderacionSchema = z.infer<typeof ponderacionSchema>