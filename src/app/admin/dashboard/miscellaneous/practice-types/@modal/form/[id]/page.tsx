import Modal from "@/components/modal";
import PracticeTypeForm from "@/components/admin/forms/PracticeTypeForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function PracticeTypeFormModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Practice Type</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <PracticeTypeForm id={id} />
                </Suspense>
            </div>
        </Modal>
    );
}