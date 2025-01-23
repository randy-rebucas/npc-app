import { getUserByEmail } from "@/app/actions/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    if (user.role !== "PHYSICIAN") {
        redirect("/np/find-match");
    }

    return <>{children}</>;
}