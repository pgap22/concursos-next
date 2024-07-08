import JuradoForm from "@/components/forms/jurado";
import { getUsuarioById } from "@/lib/usuario";
import { redirect } from "next/navigation";

export default async function EditarJurado({ params }: { params: { id: string } }) {
    const jurado = await getUsuarioById(params.id)

    if(!jurado) return redirect("/admin/jurados")

    return (
        <>
            <JuradoForm type='edit' jurado={jurado} />
        </>
    );
}
