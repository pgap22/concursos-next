"use client"
import { Prisma } from "@prisma/client"
import { useState } from "react"
import { Input } from "./ui/input"
import { JuradoConcurso } from "./participantes/Jurados"
export const ListaJurado = ({ jurados, concurso_id }: {
    jurados: Prisma.usuarioGetPayload<{
        include: {
            JuradosConcursos: true
        }
    }>[], concurso_id: string
}) => {
    const [query, setQuery] = useState("");

    return (
        <div className="mb-4">
            <div className="my-2">
                <p className="font-bold">Buscar Concursante</p>
                <Input onChange={e=> setQuery(e.target.value)} placeholder="Buscar" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {jurados.filter(concursante => (!!query && concursante.nombre.toLowerCase().includes(query) || query=="*")).map(concursante => (
                    <JuradoConcurso key={concursante.id} jurado={concursante} concurso_id={concurso_id} />
                ))}
            </div>
        </div>
    )
}