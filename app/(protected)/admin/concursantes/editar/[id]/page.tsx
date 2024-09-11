import ConcursanteForm from "@/components/forms/concursante";
import { getconcursanteById, getConcursanteByIdWithConcursos } from "@/lib/concursantes";
import { getAllconcursos, getConcursosEnableToParticipate } from "@/lib/concursos";
import { redirect } from "next/navigation";

export default async function EditarConcursante({ params }: { params: { id: string } }) {
    const concursante = await getConcursanteByIdWithConcursos(params.id)
    if (!concursante) return redirect("/concursantes")

    const concursos = await getConcursosEnableToParticipate(params.id);
    return (
        <>
            <ConcursanteForm type='edit' concursante={concursante} concursos={concursos}  />
        </>
    );
}
