import { auth } from "@/auth";
import Back from "@/components/Back";
import { Button } from "@/components/ui/button";
import { getParticipantesConcursoById } from "@/lib/concursos";
import { concursante, Prisma } from "@prisma/client";
import Link from "next/link";

export default async function ConcursantesEvaluacion({ params }: { params: { id: string } }) {
    const session = await auth();
    const participantes = await getParticipantesConcursoById(params.id);
    return (
        <div className="p-4">
            <Back href={"/jurado/concurso/" + params.id} />

            <div className="mb-6">
                <h1 className="text-xl font-bold mb-2">Lista de concursantes a evaluar:</h1>
                <div className="flex flex-col gap-3">
                    {participantes.filter(p => !p.participaciones[0].puntajes.some(puntaje => puntaje.id_jurado == session?.user.id)).map(p => (
                        <ParticipanteItem key={p.id} participante={p} id_concurso={params.id} />
                    ))}
                </div>
            </div>
            <div>
                <h1 className="text-xl font-bold mb-2">Concursantes Evaluados:</h1>
                <div className="flex flex-col gap-3">
                    {participantes.filter(p => p.participaciones[0].puntajes.some(puntaje => puntaje.id_jurado == session?.user.id)).map(p => (
                        <ParticipanteItem key={p.id} participante={p} id_concurso={params.id} evaluado />
                    ))}
                </div>
            </div>
        </div>
    );
}

const ParticipanteItem = ({ participante, id_concurso, evaluado = false }: {
    participante: Prisma.concursanteGetPayload<{
        include: {
            participaciones: {
                include: {
                    puntajes: true,
                }
            }
        }
    }>, id_concurso: string, evaluado?: boolean
}) => {
    return (
        <Button variant={evaluado ? 'outline' : 'default'} className="w-full text-wrap text-left py-2" asChild>
            <Link href={"/jurado/concurso/" + id_concurso + `/${evaluado ? 'resultado' : 'evaluar'}/` + participante.participaciones[0].id}>
                {participante.nombre}
            </Link>
        </Button>
    );
}
