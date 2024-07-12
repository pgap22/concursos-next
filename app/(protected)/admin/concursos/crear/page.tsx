import ConcursoForm from "@/components/forms/concurso";
import { getAllRubricas } from "@/lib/rubricas";

export default async function ConcursoCrear() {
    const rubricas = await getAllRubricas();

    return (
        <>
            <ConcursoForm type="create" rubricas={rubricas} />
        </>
    )
}