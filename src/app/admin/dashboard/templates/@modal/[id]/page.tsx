import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import TemplateForm from "@/components/admin/forms/TemplateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface TemplateDetailModalProps {
    params: {
        id: string;
    };
}

export default function TemplateDetailModal({
    params,
}: TemplateDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <TemplateForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
