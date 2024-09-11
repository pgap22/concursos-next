import Back from "@/components/Back";
import { ListaConcursante } from "@/components/ListaConcurstantes";
import ParticiapanteItemList from "@/components/ParticipanteItemList";
import { Concursante } from "@/components/participantes/Concursante";
import { Button } from "@/components/ui/button";
import { getAllconcursantes, getAllconcursantesWithParticipaciones } from "@/lib/concursantes"
import { getconcursoByIdWithParticipantes } from "@/lib/concursos"
import Link from "next/link";
import { redirect } from "next/navigation"

export default async function ParticipantesConcursos({ params }: { params: { id: string } }) {

    const concurso = await getconcursoByIdWithParticipantes(params.id)
    const concursantes = await getAllconcursantesWithParticipaciones();

    if (!concurso) return redirect("/admin/concursos")

    const { participantes } = concurso


    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <Back href={"/admin/concursos/" + concurso.id + "/editar"}/>

            <h2 className="text-xl font-bold mb-4">Participantes</h2>

            {/* Sección para agregar participantes */}
            <ListaConcursante concursantes={concursantes} concurso_id={concurso.id} />

            {/* Sección de lista de participantes */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Lista de participantes:</h3>
                {participantes.length === 0 ? (
                    <p className="text-sm text-gray-600">No hay participantes.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {participantes.map(participante => (
                            <ParticiapanteItemList participante={participante} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

}

