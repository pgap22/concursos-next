import { Button } from "@/components/ui/button";
import { getUsuariosByRol } from "@/lib/usuario";

import Link from "next/link";

export default async function JuradosPage() {
    const jurados = await getUsuariosByRol("jurado")

    return (
        <div className=" bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Jurados</h1>
            <div className="flex justify-between items-center mb-6">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <Link href="/admin/jurados/crear">Crear Jurado</Link>
                </Button>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Listas de jurados</h2>
                <section>
                    {jurados.map((jurado) => (
                        <Link key={jurado.id} href={`/admin/jurados/editar/${jurado.id}`}>
                            <div className="cursor-pointer hover:bg-gray-200 rounded-lg mb-4 p-4 border border-gray-300 transition duration-300">
                                <p className="text-lg text-gray-800">{jurado.nombre}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    )
}