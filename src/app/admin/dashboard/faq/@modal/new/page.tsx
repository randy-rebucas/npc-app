import FaqForm from "@/components/admin/forms/FaqForm";
import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";

export default function FaqNewModal() {
    return (
        <Modal>
            <Card className="p-6">
                <FaqForm id={null} />
            </Card>
        </Modal>
    )
}