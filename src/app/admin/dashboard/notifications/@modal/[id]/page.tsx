import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import NotificationForm from "@/components/admin/forms/NotificationForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


export default async function NotificationDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <NotificationForm id={id} />
                </Suspense>
            </Card>
        </Modal>
    );
}