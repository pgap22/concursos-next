"use server"
import { deleteRubrica } from "@/lib/rubricas";
import { revalidatePath } from "next/cache";

export async function deleteRubricaAction(id:string) {
    try {
        await deleteRubrica(id)
        revalidatePath("/admin/rubricas")
        return true
    } catch (error) {
        throw error
    }
}