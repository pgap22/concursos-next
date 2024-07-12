import { Button } from "@/components/ui/button";
import { getAllRubricas } from "@/lib/rubricas";

import Link from "next/link";

export default async function JuradosPage() {
    const rubricas = await getAllRubricas()

    return (
        <div className=" bg-white p-4 rounded-lg shadow-lg">
            <Link href={"/admin"}>Volver</Link>
            <h1 className="text-3xl font-bold mb-6">Rubricas</h1>
            <div className="flex justify-between items-center mb-6">
                <Button asChild className="bg-yellow-500 text-white hover:bg-yellow-600">
                    <Link href="/admin/rubricas/crear">Crear Rubricas</Link>
                </Button>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Listas de rubricas</h2>
                <section>
                    {rubricas.map((rubrica) => (
                        <Link key={rubrica.id} href={`/admin/rubricas/editar/${rubrica.id}`}>
                            <div className="cursor-pointer hover:bg-gray-200 rounded-lg mb-4 p-4 border border-gray-300 transition duration-300">
                                <p className="text-lg text-gray-800">{rubrica.nombre}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    )
}