import IssueForm from "@/components/admin/forms/IssueForm";
import Modal from "@/components/modal";

export default function IssuesFormModal() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Issue</h2>
                <IssueForm id={null} />
            </div>
        </Modal>
    )
}