import ConcursanteForm from "@/components/forms/concursante";
import { getconcursanteById, getConcursanteByIdWithConcursos } from "@/lib/concursantes";
import { redirect } from "next/navigation";

export default async function EditarConcursante({ params }: { params: { id: string } }) {
    const concursante = await getConcursanteByIdWithConcursos(params.id)

    if(!concursante) return redirect("/concursantes")

    return (
        <>
            <ConcursanteForm type='edit' concursante={concursante} />
        </>
    );
}
