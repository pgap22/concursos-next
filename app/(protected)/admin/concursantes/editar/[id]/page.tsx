import ConcursanteForm from "@/components/forms/concursante";
import JuradoForm from "@/components/forms/jurado";
import { getconcursanteById } from "@/lib/concursantes";
import { getUsuarioById } from "@/lib/usuario";
import { redirect } from "next/navigation";

export default async function EditarConcursante({ params }: { params: { id: string } }) {
    const concursante = await getconcursanteById(params.id)

    if(!concursante) return redirect("/concursantes")

    return (
        <>
            <ConcursanteForm type='edit' concursante={concursante} />
        </>
    );
}
