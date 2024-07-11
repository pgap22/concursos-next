import Evaluacion from "@/components/forms/evaluacion";
import { alreadyEvaluted } from "@/lib/concursos";
import { getRubricaByConcursoId } from "@/lib/rubricas";
import { redirect } from "next/navigation";

export default async function ConcursPageJurado({ params }: { params: { id: string, id_participacion: string } }) {
    const rubrica = await getRubricaByConcursoId(params.id);
    const participacion = await alreadyEvaluted(params.id_participacion);
    
    if (!rubrica) return redirect("/jurado/concursos");
    if(participacion) return redirect("/jurado/concurso/"+params.id+"/concursantes")

    const { criterios } = rubrica;

    return (
      <Evaluacion criterios={criterios} id_participacion={params.id_participacion} />
    );
}

