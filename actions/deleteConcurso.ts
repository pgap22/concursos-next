"use server"

import { deleteconcurso } from "@/lib/concursos"
import { revalidatePath } from "next/cache";

export const deleteConcurso = async(id: string)=>{
    await deleteconcurso(id);
    revalidatePath("/admin/concursos", "page")
}