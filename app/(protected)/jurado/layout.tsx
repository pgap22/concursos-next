import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function JuradoLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (session?.user.rol !== "jurado") return redirect("/redirect")

    return (
        <>
            <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Bienvenido {session?.user.nombre}</h1>
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <Button
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </Button>
                </form>
            </header>

            <div className="p-4">
                {children}
            </div>
        </>
    )
}

