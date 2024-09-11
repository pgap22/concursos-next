import Back from "@/components/Back";
import { getRankingConcurso } from "@/lib/concursos"
import Link from "next/link";

export default async function RankingConcurso({ params }: { params: { id: string } }) {

    const ranking = await getRankingConcurso(params.id);

    console.log(ranking)

    return (
        <>
            <Back href={"/admin/concursos/" + params.id + "/editar"} />

            <h2 className="font-bold text-2xl mb-4">Ranking</h2>
            <div className="space-y-4">
                {ranking?.map(persona => (<div className="border p-4 bg-white rounded-md">
                    <p>{persona.nombre}: <span className="font-bold">{persona.puntajeAcumulado}</span></p>
                    <div className="border p-2 mt-2 rounded-md">
                        <h3 className="text-sm">Datos Generales</h3>
                        {
                            persona.datosGenerales.map(dato => {
                                return <p className="text-xs"><span className="font-bold">{dato.campo}</span> {dato.valor}</p>
                            })
                        }
                    </div>
                </div>))}
            </div>
        </>
    )
}