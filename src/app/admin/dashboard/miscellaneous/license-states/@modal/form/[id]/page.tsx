import Modal from "@/components/modal";
import MedicalLicenseStateForm from "@/components/admin/forms/MedicalLicenseStateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface LicenseStateFormModalProps {
    params: {
        id: string;
    };
}

export default function LicenseStateFormModal({ params }: LicenseStateFormModalProps) {
    return (
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit License State</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <MedicalLicenseStateForm id={params.id} />
                </Suspense>
            </div>
        </Modal>
    );
}