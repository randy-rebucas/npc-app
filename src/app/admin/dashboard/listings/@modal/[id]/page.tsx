import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import ListingForm from "@/components/admin/forms/ListingForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ListingDetailModalProps {
    params: {
        id: string | null;
    };
}

export default function ListingDetailModal({ params }: ListingDetailModalProps) {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <ListingForm id={params.id} />
                </Suspense>
            </Card>
        </Modal>
    );
} 