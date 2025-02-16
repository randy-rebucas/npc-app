import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import TemplateForm from "@/components/admin/forms/TemplateForm";

export default async function TemplateDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    return (
        <Modal>
            <Card className="p-6">
                <TemplateForm id={id} />
            </Card>
        </Modal>
    )
}
