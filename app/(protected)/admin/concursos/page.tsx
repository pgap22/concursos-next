import Back from "@/components/Back";
import { Button } from "@/components/ui/button";
import { getAllconcursos } from "@/lib/concursos";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es'; // Import the Spanish locale
import dayjs from "dayjs";
dayjs.extend(localizedFormat)
import Link from "next/link";

export default async function ConcursosPage() {
    const concursos = await getAllconcursos()

    return (
        <div className=" bg-white p-4 rounded-lg shadow-lg">
            <Back href="/admin" />
            <h1 className="text-3xl font-bold mb-6">Concursos</h1>
            <div className="flex justify-between items-center mb-6">
                <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                    <Link href="/admin/concursos/crear">Crear Concurso</Link>
                </Button>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Listas de concursos</h2>
                <section>
                    {concursos.map((concurso) => (
                        <Link key={concurso.id} href={`/admin/concursos/${concurso.id}/editar`}>
                            <div className="cursor-pointer hover:bg-gray-200 rounded-lg mb-4 p-4 border border-gray-300 transition duration-300">
                                <p className="text-lg text-gray-800">{concurso.nombre}</p>
                                <p className="text-sm text-gray-500 whitespace-pre-line">{concurso.descripcion}</p>
                                <p className="text-sm text-gray-500"><span className="font-bold">Fecha</span>: {dayjs(concurso.fecha).locale('es').format('LLLL')}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    )
}