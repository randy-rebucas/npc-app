import MedicalLicenseStateForm from "@/components/admin/forms/MedicalLicenseStateForm";
import Modal from "@/components/modal";

export default function LicenseStateFormModal() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">License State</h2>
                <MedicalLicenseStateForm id={null} />
            </div>
        </Modal>
    )
}