import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import EnquiryForm from "@/components/admin/forms/EnquiryForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface EnquiryDetailModalProps {
    params: {
        id: string;
    };
}

export default function EnquiryDetailModal({ params }: EnquiryDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Enquiry</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <EnquiryForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
} 