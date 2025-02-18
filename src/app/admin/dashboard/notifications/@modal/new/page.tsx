import NotificationForm from "@/components/admin/forms/NotificationForm";
import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";

export default function NotificationNewModal() {
    return (
        <Modal>
            <Card className="p-6">
                <NotificationForm id={null} />
            </Card>
        </Modal>
    )
}