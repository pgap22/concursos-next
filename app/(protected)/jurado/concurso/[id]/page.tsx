import Back from "@/components/Back";
import { Button } from "@/components/ui/button";
import { getconcursoById } from "@/lib/concursos";
import { LucideClipboardEdit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuTrophy } from "react-icons/lu";


export default async function ConcursPageJurado({ params }: { params: { id: string } }) {
    const concurso = await getconcursoById(params.id);
    if (!concurso) return redirect("/jurado");

    return (
        <div className="p-4">
            <Back href={"/jurado"} />
            <h1 className="text-2xl font-bold mb-4">{concurso.nombre}</h1>

            {concurso.estado === "evaluacion" && (
                <div className="mb-4">
                    <Link href={"/jurado/concurso/" + concurso.id + "/concursantes"}>
                        <div className="border p-4 rounded-md grid grid-cols-[max-content_1fr] gap-2 bg-yellow-50 text-yellow-800">
                            <LucideClipboardEdit size={32} />
                            <div>
                                <p className="font-bold text-xl">Evaluar concursantes</p>
                                <p>Evalua a los concursantes con su respectiva rubrica</p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
            {concurso.estado === "finalizado" && (
                <div>
                    <Link href={"/jurado/concurso/" + concurso.id + "/ranking"}>
                        <div className="border p-4 rounded-md grid grid-cols-[max-content_1fr] gap-2 bg-green-50 text-green-800">
                            <LuTrophy size={32} />
                            <div>
                                <p className="font-bold text-xl">Ranking del concurso</p>
                                <p>Observa las posiciones de los concursantes</p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
