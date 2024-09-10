"use server"

import { deleteconcursante } from "@/lib/concursantes"
import { revalidatePath } from "next/cache";

export async function deleteConcursante(id:string) {
    await deleteconcursante(id);
    revalidatePath("/admin/concursante", "page")
}