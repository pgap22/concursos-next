"use server"

import { updateRubrica } from "@/lib/rubricas";
import { RubricaSchema } from "@/schemas/rubrica";
import { revalidatePath } from "next/cache";

export async function editDatosGeneralesRubrica(id: string,data:RubricaSchema) {
    try {
       const rubrica =  await updateRubrica(id, data);
       revalidatePath("/admin/rubricas/editar/[id]", "page")
       return rubrica
    } catch (error) {
        throw {error : "Hubo un error en el servidor"}
    }
}