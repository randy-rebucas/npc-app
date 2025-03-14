import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import IssueForm from "@/components/admin/forms/IssueForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface IssueDetailModalProps {
    params: {
        id: string;
    };
}

export default function IssueDetailModal({ params }: IssueDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Issue</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <IssueForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
} 