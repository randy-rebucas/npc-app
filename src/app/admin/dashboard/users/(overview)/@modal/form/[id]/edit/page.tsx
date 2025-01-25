import UserForm from "@/components/admin/forms/UserForm";
import Modal from "@/components/modal";

export default async function UserEdit({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
                <UserForm id={id} />
            </div>
        </Modal>
    )
}