import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import TemplateForm from "@/components/admin/forms/TemplateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function TemplateDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <TemplateForm id={id} />
                </Suspense>
            </Card>
        </Modal>
    );
}
