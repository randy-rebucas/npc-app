

import NotificationForm from "@/components/admin/forms/NotificationForm";
import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";

export default async function NotificationDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    return (
        <Modal>
            <Card className="p-6">
                <NotificationForm id={id} /> 
            </Card>
        </Modal>
    )
}