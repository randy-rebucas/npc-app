import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Header() {
    const session = await getServerSession(authOptions);
    if (session) {
        return redirect("/dashboard");
    }

    return (
        <header className="px-6 py-4">
            <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center ">
                {/* Logo */}
                <div className="logo">
                    <Image src="/logo-black.png" alt="NP Collaborator Logo" width={0} height={0} sizes="100vw" className="w-auto h-auto" />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <Link href="/" className="text-black hover:text-gray-600">Home</Link>
                    <Link href="/nurse" className="text-black hover:text-gray-600">Nurse Practitioners</Link>
                    <Link href="/physician" className="text-black hover:text-gray-600">Physician Collaborators</Link>
                    <button className="px-6 py-2 rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors">
                        Signup
                    </button>
                </nav>
            </div>
        </header>
    );
}