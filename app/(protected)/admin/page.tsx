import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default async function AdminPage() {
    return (
        <>
            {/* Listas de todas las entidades creadas */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <div className="p-8 grid grid-rows-[1fr_max-content] bg-white shadow-lg rounded-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Jurados</h2>
                        <p className="text-gray-500">Administra los jurados dentro de la plataforma</p>
                    </div>
                    <Link href="/admin/jurados">
                        <Button className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600">
                            Ver Jurados
                        </Button>
                    </Link>
                </div>
                <div className="p-8 grid grid-rows-[1fr_max-content] bg-white shadow-lg rounded-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Concursos</h2>
                        <p className="text-gray-500">Gestiona los concursos disponibles</p>
                    </div>
                    <Link href="/admin/concursos">
                        <Button className="w-full mt-4 bg-green-500 text-white hover:bg-green-600">
                            Ver Concursos
                        </Button>
                    </Link>
                </div>
                <div className="p-8 grid grid-rows-[1fr_max-content] bg-white shadow-lg rounded-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Concursantes</h2>
                        <p className="text-gray-500">Administra los concursantes inscritos</p>
                    </div>
                    <Link href="/admin/concursantes">
                        <Button className="w-full mt-4 bg-purple-500 text-white hover:bg-purple-600">
                            Ver Concursantes
                        </Button>
                    </Link>
                </div>
                <div className="p-8 grid grid-rows-[1fr_max-content] bg-white shadow-lg rounded-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rubricas</h2>
                        <p className="text-gray-500">Define y administra las rúbricas de evaluación</p>
                    </div>
                    <Link href="/admin/rubricas">
                        <Button className="w-full mt-4 bg-yellow-500 text-white hover:bg-yellow-600">
                            Ver Rubricas
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    )
}