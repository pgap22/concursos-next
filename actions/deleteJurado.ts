"use server"

import { deleteUsuario } from "@/lib/usuario"
import { revalidatePath } from "next/cache"

export async function deleteJurado(id:string) {
    await deleteUsuario(id)
    revalidatePath("/admin/jurados", "page")
}