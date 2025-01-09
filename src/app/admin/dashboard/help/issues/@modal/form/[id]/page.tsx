import Modal from "@/components/modal";
import IssueForm from "@/components/admin/forms/IssueForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Issue</h2>

                <IssueForm id={id} />
            </div>
        </Modal>
    )
}