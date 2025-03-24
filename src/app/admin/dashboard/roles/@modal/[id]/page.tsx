import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import RoleForm from "@/components/admin/forms/RoleForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface RoleDetailModalProps {
    params: {
        id: string;
    };
}

export default function RoleDetailModal({ params }: RoleDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <RoleForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
