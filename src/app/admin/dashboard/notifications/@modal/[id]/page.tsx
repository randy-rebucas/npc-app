import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import NotificationForm from "@/components/admin/forms/NotificationForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface NotificationDetailModalProps {
    params: {
        id: string;
    };
}

export default function NotificationDetailModal({ params }: NotificationDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <NotificationForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
}