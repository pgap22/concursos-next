import { auth } from "@/auth";
import Back from "@/components/Back";
import { getResultadoByParticipacion } from "@/lib/concursos"
import { redirect } from "next/navigation";

export default async function ResultadosPage({ params }: { params: { id: string, id_participacion: string } }) {
    const session = await auth();
    const resultados = await getResultadoByParticipacion(params.id_participacion, session?.user.id as string);
    if (!resultados) return redirect("/jurado/concurso/" + params.id + "/concursantes");

    const puntosTotales = resultados.participacion.puntajes.reduce((acc, puntaje) => acc + (+puntaje.puntaje), 0)
    const criterios = Object.keys(resultados.agrupadosPorCriterio)

    console.log(resultados)
    return (
        <div className="p-4">
            <Back href={"/jurado/concurso/" + params.id + "/concursantes"} />

            <h2 className="font-bold text-2xl mb-4">Resultados de {resultados.participacion.concursante.nombre}</h2>
            <p className="font-bold border p-4 rounded-md w-fit mb-4">Puntaje Total: {puntosTotales}</p>
            <div className="space-y-4">
                {criterios.map(criterio_id => (
                    <div key={criterio_id} className="border bg-white p-4 rounded-md shadow-sm">
                        <h3 className="font-bold text-xl mb-2">{resultados.agrupadosPorCriterio[criterio_id].nombre_criterio}</h3>
                        <p className="text-gray-600 mb-4">{resultados.agrupadosPorCriterio[criterio_id].descripcion}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {resultados.agrupadosPorCriterio[criterio_id].puntajes.map(puntaje => (
                                <div key={puntaje.id} className="border p-4 flex flex-col items-center rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <p className="font-medium text-lg">{puntaje.criterioPonderacion.nombre}</p>
                                    <p className="text-gray-700">{puntaje.puntaje}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
