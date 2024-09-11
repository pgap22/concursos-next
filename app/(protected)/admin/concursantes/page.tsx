import Back from "@/components/Back";
import ListaConcursateTodo from "@/components/ListaConcursanteTodo";
import { Button } from "@/components/ui/button";
import { getAllconcursantes } from "@/lib/concursantes";
import { getAllconcursos } from "@/lib/concursos";

import Link from "next/link";

export default async function Concursantes() {
    const concursantes = await getAllconcursantes()
    const concursos = await getAllconcursos();
    return (
        <div className=" bg-white p-4 rounded-lg shadow-lg">
            <Back href="/admin" />

            <h1 className="text-3xl font-bold mb-6">Concursantes</h1>
            <div className="flex justify-between items-center mb-6">
                <Button asChild className="bg-purple-500 text-white hover:bg-purple-600">
                    <Link href="/admin/concursantes/crear">Crear Concursante</Link>
                </Button>
            </div>
            <ListaConcursateTodo concursantes={concursantes} concursos={concursos} />
        </div>
    )
}