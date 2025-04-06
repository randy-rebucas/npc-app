import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import PermissionForm from "@/components/admin/forms/PermissionForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function PermissionDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <PermissionForm id={id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
