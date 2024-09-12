"use client"
import { cn } from "@/lib/utils";
import { concursante, Concurso, Prisma } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";

type ConcursanteInclude = Prisma.concursanteGetPayload<{
    include: {
        participaciones: {
            select: {
                concurso: {
                    select: {
                        id: true
                    }
                }
            }
        }
    }
}>
interface ListaConcursanteTodo {
    concursantes: ConcursanteInclude[],
    concursos: Concurso[]
}

export default function ListaConcursateTodo({ concursantes, concursos }: ListaConcursanteTodo) {
    const [concursosActive, setConcursosActive] = useState<string[]>([])
    const [showWithoutConcurso, setShowWithoutConcurso] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>('') // Search state

    const toggleConcursoBadge = (id: string) => {
        setShowWithoutConcurso(false); // Reset the "Sin Concurso" filter when a normal concurso is selected
        if (concursosActive.includes(id)) {
            setConcursosActive(concursos => concursos.filter(item => item !== id))
            return
        }
        setConcursosActive([...concursosActive, id])
    }

    const toggleWithoutConcursoBadge = () => {
        setConcursosActive([]); // Reset the active concursos when "Sin Concurso" is selected
        setShowWithoutConcurso(!showWithoutConcurso);
    }

    // Filter concursantes based on the search term and active filters
    const filteredConcursantes = concursantes.filter(concursante =>
        concursante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Match name with search term
    ).filter(concursante =>
        showWithoutConcurso
            ? concursante.participaciones.length === 0
            : concursosActive.length
                ? concursante.participaciones.some(concursoInscrito => concursosActive.includes(concursoInscrito.concurso.id))
                : true
    ).sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Listas de concursantes</h2>

            {/* Search Input */}
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Buscar concursante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 my-4 overflow-auto">
                <Badge
                    active={showWithoutConcurso}
                    key="sin-concurso"
                    toggleConcursoBadge={toggleWithoutConcursoBadge}
                    concurso={{ id: "sin-concurso", nombre: "Sin Concurso" } as Concurso}
                />
                {concursos.map(concurso => (
                    <Badge
                        active={concursosActive.includes(concurso.id)}
                        key={concurso.id}
                        toggleConcursoBadge={toggleConcursoBadge}
                        concurso={concurso}
                    />
                ))}
            </div>

            <section>
                {filteredConcursantes.length ? (
                    filteredConcursantes.map(concursante => (
                        <Concursante concursante={concursante} key={concursante.id} />
                    ))
                ) : (
                    <p>No se encontraron concursantes.</p>
                )}
            </section>
        </div>
    )
}

const Concursante = ({ concursante }: { concursante: ConcursanteInclude }) => {
    const hasNoParticipation = concursante.participaciones.length === 0;
    const userTest = concursante.prueba
    return (
        <Link href={`/admin/concursantes/editar/${concursante.id}`}>
            <div className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-200 rounded-lg mb-4 p-4 border border-gray-300 transition duration-300">
                <p className="text-sm md:text-lg text-gray-800">{concursante.nombre}</p>
                <div className="space-x-2 mt-2 md:mt-0">
                    {hasNoParticipation && (
                        <span className="md:ml-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Sin concurso
                        </span>
                    )}
                    {userTest && (
                        <span className="md:ml-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Prueba
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

const Badge = ({ active = false, concurso, toggleConcursoBadge }: { active?: boolean, concurso: Concurso, toggleConcursoBadge: (id: string) => void }) => {
    return (
        <div
            onClick={() => toggleConcursoBadge(concurso.id)}
            className={cn("border text-nowrap border-border py-2 px-4 rounded-full cursor-pointer", active && "border-blue-500 bg-blue-50")}
        >
            {concurso.nombre}
        </div>
    )
}
