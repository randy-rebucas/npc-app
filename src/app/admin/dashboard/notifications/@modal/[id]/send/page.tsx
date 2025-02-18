import NotificationSendForm from "@/components/admin/forms/NotificationSendForm";
import Modal from "@/components/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NotificationSendModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal>
            <Card className="p-6">
                <CardHeader>
                    <CardTitle>Send Notification</CardTitle>
                </CardHeader>
                <CardContent>
                    <NotificationSendForm id={id} />
                </CardContent>
            </Card>
        </Modal>
    )
}