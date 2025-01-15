

import FaqForm from "@/components/admin/forms/FaqForm";
import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";

export default async function FaqDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    return (
        <Modal>
            <Card className="p-6">
                <FaqForm id={id} /> 
            </Card>
        </Modal>
    )
}