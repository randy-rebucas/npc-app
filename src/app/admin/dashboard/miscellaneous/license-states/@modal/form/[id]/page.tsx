import Modal from "@/components/modal";
import MedicalLicenseStateForm from "@/components/admin/forms/MedicalLicenseStateForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit License State</h2>

                <MedicalLicenseStateForm id={id} />
            </div>
        </Modal>
    )
}