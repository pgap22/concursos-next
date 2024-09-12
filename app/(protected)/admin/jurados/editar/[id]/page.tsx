import JuradoForm from "@/components/forms/jurado";
import { getConcursosEnableToRank } from "@/lib/concursos";
import { getJuradoByid, getUsuarioById } from "@/lib/usuario";
import { redirect } from "next/navigation";

export default async function EditarJurado({ params }: { params: { id: string } }) {
    const jurado = await getJuradoByid(params.id)

    if(!jurado) return redirect("/admin/jurados")

    const concursos = await getConcursosEnableToRank(params.id);

    return (
        <>
            <JuradoForm type='edit' jurado={jurado} concursos={concursos}/>
        </>
    );
}
