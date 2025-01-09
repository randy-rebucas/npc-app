import Modal from "@/components/modal";
import EnquiryForm from "@/components/admin/forms/EnquiryForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Enquiry</h2>

                <EnquiryForm id={id} />
            </div>
        </Modal>
    )
}