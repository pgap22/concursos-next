import participantes from "./participantes.json" with {type:"json"}

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const run = async () => {

    const promises = participantes.map(participante => {
        const data = {
            nombre: participante.nombre,
            institucion: participante.institucion,
            DatosGeneralesConcursante: {
                create: [
                    {
                        campo: "No. Participantes",
                        valor: participante["No Participantes"]
                    },
                    {
                        campo: "Responsable",
                        valor: participante.responsable
                    }
                ]
            },
            participaciones: {
                create: {
                    id_concurso: "67334d8c-041f-4b79-bab9-221af4a60de4"
                }
            }
        }
        return prisma.concursante.create({
            data
        })
    })

    await Promise.all(promises)

    console.log("added")

}

run();