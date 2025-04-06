import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import FaqForm from "@/components/admin/forms/FaqForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function FaqDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit FAQ</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <FaqForm id={id} />
                </Suspense>
            </Card>
        </Modal>
    );
}