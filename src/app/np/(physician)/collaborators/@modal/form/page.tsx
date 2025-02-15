import Modal from "@/components/modal";
import CollaboratorForm from "@/components/collaboration/form/CollaboratorForm";

export default function Form() {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Invite Nurse Practitioner</h2>
                <p className="text-muted-foreground">
                    Send an invitation email to collaborate with a new nurse practitioner.
                </p>
                <CollaboratorForm />
            </div>
        </Modal>
    )
}