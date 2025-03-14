import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import NotificationForm from "@/components/admin/forms/NotificationForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function NotificationNewModal() {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <NotificationForm id={null} />
                </Suspense>
            </Card>
        </Modal>
    );
}