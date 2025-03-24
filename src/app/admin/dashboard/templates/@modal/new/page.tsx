import { Card } from "@/components/ui/card";
import Modal from "@/components/modal";
import TemplateForm from "@/components/admin/forms/TemplateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function TemplateNewModal() {
    return (
        <Modal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <TemplateForm id={null} />
                </Suspense>
            </Card>
        </Modal>
    );
}
