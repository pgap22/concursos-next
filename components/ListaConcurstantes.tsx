"use client"
import { Prisma } from "@prisma/client"
import { Concursante } from "./participantes/Concursante"
import { useState } from "react"
import { Input } from "./ui/input"
export const ListaConcursante = ({ concursantes, concurso_id }: {
    concursantes: Prisma.concursanteGetPayload<{
        include: {
            participaciones: true
        }
    }>[],
    concurso_id: string
}) => {
    const [query, setQuery] = useState("");



    return (
        <div className="mb-4">
            <div className="my-2">
                <p className="font-bold">Buscar Concursante</p>
                <p className="text-yellow-600 text-sm my-2">Escribiendo <span className="font-bold">*</span> mostrara todos los concursantes</p>
                <Input onChange={e=> setQuery(e.target.value)} placeholder="Buscar" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {concursantes.filter(concursante => (!!query && concursante.nombre.toLowerCase().includes(query) || query=="*")).map(concursante => (
                    <Concursante key={concursante.id} concursante={concursante} concurso_id={concurso_id} />
                ))}
            </div>
        </div>
    )
}