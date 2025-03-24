import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import PermissionForm from "@/components/admin/forms/PermissionForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface PermissionDetailModalProps {
    params: {
        id: string;
    };
}

export default function PermissionDetailModal({ params }: PermissionDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <PermissionForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
