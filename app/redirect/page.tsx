import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Redirect() {
    const session = await auth();

    if(session?.user.rol == "jurado") return redirect("/jurado")
    if(session?.user.rol == "admin") return redirect("/admin")

    return redirect("/")
}