import Modal from "@/components/modal";
import PracticeTypeForm from "@/components/admin/forms/PracticeTypeForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Practice Type</h2>

                <PracticeTypeForm id={id} />
            </div>
        </Modal>
    )
}