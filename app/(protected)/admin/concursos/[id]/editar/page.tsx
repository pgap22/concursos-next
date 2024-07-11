import ConcursoForm from "@/components/forms/concurso";
import { getconcursoById } from "@/lib/concursos";
import { getAllRubricas } from "@/lib/rubricas";
import { redirect } from "next/navigation";

export default async function EditarConcurso({params} : {params: {id: string}}) {
    const concurso = await getconcursoById(params.id)
    const rubricas = await getAllRubricas();
    if(!concurso) return redirect("/admin/concursos")

    return (
        <>
            <ConcursoForm type="edit" concurso={concurso} rubricas={rubricas} />
        </>
    )
}