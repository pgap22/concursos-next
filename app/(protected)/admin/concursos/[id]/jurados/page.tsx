import Back from "@/components/Back";
import JuradoItemList from "@/components/JuradoItemList";
import { ListaJurado } from "@/components/ListaJurados";
import { getconcursoByIdWithJurados } from "@/lib/concursos"
import { getJurados, getUsuariosByRol } from "@/lib/usuario";
import { redirect } from "next/navigation"

export default async function ParticipantesConcursos({ params }: { params: { id: string } }) {

    const concurso = await getconcursoByIdWithJurados(params.id)
    const jurados = await getJurados();

    if (!concurso) return redirect("/admin/concursos")

    const { JuradosConcursos } = concurso

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <Back href={"/admin/concursos/"+concurso.id+"/editar"} />

                <h2 className="text-xl font-bold mb-4">Jurados</h2>

                {/* Sección para agregar participantes */}
                <ListaJurado jurados={jurados} concurso_id={concurso.id} />

                {/* Sección de lista de participantes */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Lista de Jurados:</h3>
                    {JuradosConcursos.length === 0 ? (
                        <p className="text-sm text-gray-600">No hay Jurados.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {JuradosConcursos.map(jurado => (
                                <JuradoItemList key={jurado.id} jurado={jurado}  />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>)
}

