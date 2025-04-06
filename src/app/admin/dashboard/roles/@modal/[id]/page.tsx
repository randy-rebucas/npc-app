import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import RoleForm from "@/components/admin/forms/RoleForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function RoleDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <RoleForm id={id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
