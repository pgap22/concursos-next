"use server"
import prisma from "@/lib/prisma"
import { Concursante } from "@/schemas/concursante"
import { concursante } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createConcursante = async (data : Concursante) : Promise<concursante | {error: string}>=> {
   try {
        const concursante = await prisma.concursante.create({
            data
        })
        revalidatePath("/admin/concursantes")
        return concursante
   } catch (error) {
        console.log(error)
        return {error: "Hubo un error en el servidor"}
   }
}