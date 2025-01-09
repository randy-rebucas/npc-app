import EnquiryForm from "@/components/admin/forms/EnquiryForm";
import Modal from "@/components/modal";

export default function EnquiryFormModal() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Enquiry</h2>
                <EnquiryForm id={null} />
            </div>
        </Modal>
    )
}