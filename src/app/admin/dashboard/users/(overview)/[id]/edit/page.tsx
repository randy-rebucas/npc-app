import UserForm from "@/components/admin/forms/UserForm";

export default async function UserEdit({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return <UserForm id={id} />; 
}