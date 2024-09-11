import Link from "next/link";
import { MdOutlineChevronLeft } from "react-icons/md";

export default function Back({ href }: { href: string }) {
    return (
        <div className="w-fit my-2">
            <Link href={href}>
                <div className="flex text-md items-center gap-2">
                    <MdOutlineChevronLeft size={24} />
                    Volver
                </div>
            </Link>
        </div>
    )
}