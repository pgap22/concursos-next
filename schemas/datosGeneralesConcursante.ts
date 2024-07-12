
import { z } from "zod";

export const datosGenralesConcursanteSchema = z.object({
  campo: z.string().min(1), // nombre debe ser una cadena
  valor: z.string().min(1), // nombre debe ser una cadena
});

export type DatosGenralesConcursanteSchema = z.infer<typeof datosGenralesConcursanteSchema>