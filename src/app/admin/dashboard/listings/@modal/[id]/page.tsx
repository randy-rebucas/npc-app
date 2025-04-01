import Modal from "@/components/modal";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ListingDetailModalProps {
    params: {
        id: string | null;
    };
}

export default function ListingDetailModal({ params }: ListingDetailModalProps) {
    const { id } = params;
    console.log(id);
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    {/* <ListingForm id={params.id} /> */}
                </Suspense>
            </Card>
        </Modal>
    );
} 