import { Card } from "@/components/ui/card";

import Modal from "@/components/modal";
import TemplateForm from "@/components/admin/forms/TemplateForm";

export default function TemplateNewModal() {
    return (
        <Modal>
            <Card className="p-6">
                <TemplateForm id={null} />
            </Card>
        </Modal>
    )
}
