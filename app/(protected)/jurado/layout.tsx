import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function JuradoLayout({children} : {children: ReactNode}) {
    const session = await auth();

    if(session?.user.rol !== "jurado") return redirect("/redirect")

    return(
        <>
            {children}
        </>
    )
}