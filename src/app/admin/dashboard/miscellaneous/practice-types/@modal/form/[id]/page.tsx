import Modal from "@/components/modal";
import PracticeTypeForm from "@/components/admin/forms/PracticeTypeForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface PracticeTypeFormModalProps {
    params: {
        id: string;
    };
}

export default function PracticeTypeFormModal({ params }: PracticeTypeFormModalProps) {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Practice Type</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <PracticeTypeForm id={params.id} />
                </Suspense>
            </div>
        </Modal>
    );
}