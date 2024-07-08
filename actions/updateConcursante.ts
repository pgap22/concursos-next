"use server"
import prisma from "@/lib/prisma"
import { Concursante } from "@/schemas/concursante"
import { concursante } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const updateConcursante = async (id: string ,data : Concursante) : Promise<concursante  | {error: string}>  => {
   try {
       const concursante =  await prisma.concursante.update({
            where: {
                id
            },
            data
        })
        revalidatePath("/admin/concursantes")
        return concursante
   } catch (error) {
 
        return {error: "Hubo un error en el servidor"}
   }
}