import { redirect } from "next/navigation";
// import { UserRole } from "../models/User";
// import { getUserByEmail } from "../actions/user";
// import { getLogtoContext } from "@logto/next/server-actions";
// import { logtoConfig } from "../logto";


export default async function AdminPage() {
    
    // const { claims } = await getLogtoContext(logtoConfig);

    // const user = await getUserByEmail(claims?.email || "");

    // if (user.role !== UserRole.ADMIN) {
    //     redirect("/")
    // }

    redirect("/admin/dashboard");

    // return (<></>);
}
