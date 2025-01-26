import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { UserRole } from "../models/User";
import { getUserByEmail } from "../actions/user";


export default async function AdminPage() {
    
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    if (user.role !== UserRole.ADMIN) {
        redirect("/np")
    }

    redirect("/admin/dashboard");

    return (<></>);
}
