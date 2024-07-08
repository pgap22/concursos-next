import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (session?.user.rol !== "admin") return redirect("/redirect")

    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-10">
                <header className="flex flex-col md:flex-row  justify-between md:items-center mb-12 bg-white p-6 shadow-lg rounded-lg">
                    <Link href={"/admin"}>
                        <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
                    </Link>
                    <form
                        className="w-full md:w-auto"
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <Button className="bg-red-600 w-full text-white hover:bg-red-700 py-2 px-4 rounded-lg">Logout</Button>
                    </form>
                </header>

                {children}

            </div>
        </>
    )
}