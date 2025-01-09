import FeatureForm from "@/components/admin/forms/FeatureForm";
import Modal from "@/components/modal";

export default function FeatureFormModal() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Feature</h2>
                <FeatureForm id={null} />
            </div>
        </Modal>
    )
}