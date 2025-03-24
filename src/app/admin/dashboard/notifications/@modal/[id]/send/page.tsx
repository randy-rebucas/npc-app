import Modal from "@/components/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationSendForm from "@/components/admin/forms/NotificationSendForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface NotificationSendModalProps {
    params: {
        id: string;
    };
}

export default function NotificationSendModal({ params }: NotificationSendModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <CardHeader>
                    <CardTitle>Send Notification</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                        <NotificationSendForm id={params.id} />
                    </Suspense>
                </CardContent>
            </Card>
        </Modal>
    );
}