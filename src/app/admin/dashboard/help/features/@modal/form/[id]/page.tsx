import Modal from "@/components/modal";
import FeatureForm from "@/components/admin/forms/FeatureForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Feature</h2>

                <FeatureForm id={id} />
            </div>
        </Modal>
    )
}