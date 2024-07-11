import { getRankingConcurso } from "@/lib/concursos"
import Link from "next/link";

export default async function RankingConcurso({ params }: { params: { id: string } }) {

    const ranking = await getRankingConcurso(params.id);

    console.log(ranking)

    return (
        <>
            <Link href={"/jurado/concurso/" + params.id}>
                <p className="my-2">Volver</p>
            </Link>
            <h2 className="font-bold text-2xl mb-4">Ranking</h2>
            <div className="space-y-4">
                {ranking?.map(persona => (<div className="border p-4 rounded-md">
                    <p>{persona.nombre}: <span className="font-bold">{persona.puntajeAcumulado}</span></p>
                </div>))}
            </div>
        </>
    )
}