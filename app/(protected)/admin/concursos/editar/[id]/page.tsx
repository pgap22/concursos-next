import ConcursoForm from "@/components/forms/concurso";
import { getconcursoById } from "@/lib/concursos";
import { redirect } from "next/navigation";

export default async function EditarConcurso({params} : {params: {id: string}}) {
    const concurso = await getconcursoById(params.id)

    if(!concurso) return redirect("/admin/concursos")

    return (
        <>
            <ConcursoForm type="edit" concurso={concurso} />
        </>
    )
}