import EditarRubricaForm from "@/components/forms/editarRubrica";
import { getRubricaById } from "@/lib/rubricas";
import { redirect } from "next/navigation";

export default async function EditarRubrica({params} : {params : {id: string}}){
    const rubrica = await getRubricaById(params.id)
    
    if(!rubrica) return redirect("/admin/rubricas")

    return(
        <>
         <EditarRubricaForm rubrica={rubrica} />
        </>
    )
}