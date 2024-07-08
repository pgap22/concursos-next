import { Button } from "@/components/ui/button";
import { getAllconcursantes } from "@/lib/concursantes";

import Link from "next/link";

export default async function Concursantes() {
    const concursantes = await getAllconcursantes()

    return (
        <div className=" bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Concursantes</h1>
            <div className="flex justify-between items-center mb-6">
                <Button className="bg-purple-500 text-white hover:bg-purple-600">
                    <Link href="/admin/concursantes/crear">Crear Concursnate</Link>
                </Button>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Listas de concursantes</h2>
                <section>
                    {concursantes.map((concursante) => (
                        <Link key={concursante.id} href={`/admin/concursantes/editar/${concursante.id}`}>
                            <div className="cursor-pointer hover:bg-gray-200 rounded-lg mb-4 p-4 border border-gray-300 transition duration-300">
                                <p className="text-lg text-gray-800">{concursante.nombre}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    )
}