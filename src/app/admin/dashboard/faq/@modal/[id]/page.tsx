import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import FaqForm from "@/components/admin/forms/FaqForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface FaqDetailModalProps {
    params: {
        id: string;
    };
}

export default function FaqDetailModal({ params }: FaqDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit FAQ</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <FaqForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
}