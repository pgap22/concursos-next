import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { getConcursosByAuth } from "@/lib/concursos";
import { getStatusProperties } from "@/lib/estadoConcurso";
import { cn } from "@/lib/utils";
import { Concurso } from "@prisma/client";
import Link from "next/link";

export default async function JuradoPage() {
    const concursos = await getConcursosByAuth();
    console.log(concursos)
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Concursos a evaluar</h2>
            <div className="grid grid-cols-1 gap-4">
                {
                    concursos.map(concurso => {
                        return <ConcursoItem key={concurso.id} concurso={concurso} />
                    })
                }
            </div>
        </>
    )
}

const ConcursoItem = ({ concurso }: { concurso: Concurso }) => {
    const { colorClass } = getStatusProperties(concurso.estado);
    if (concurso.estado == "inscripcion") return (
        <div className="border p-4 rounded-md bg-white shadow-md">
            <p className="text-lg font-semibold">{concurso.nombre}</p>
            <div className={cn("border p-2 w-fit rounded", colorClass)}>
                {concurso.estado}
            </div>
        </div>
    )
    return (
        <Link href={"/jurado/concurso/" + concurso.id}>
            <div className="border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow">
                <p className="text-lg font-semibold">{concurso.nombre}</p>
                <div className={cn("border p-2 w-fit rounded", colorClass)}>
                    {concurso.estado}
                </div>
            </div>
        </Link>
    )
}
