import { ComposeMessage } from "@/components/messaging/ComposeMessage";
import { PreviousMessage } from "@/components/messaging/PreviousMessage";
import Modal from "@/components/modal";

export default async function FavoritesMessageModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    console.log(id);
    return (
        <Modal className="max-w-md">
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Message Details</h2>
                
                <div className="space-y-4">
                    <PreviousMessage physicianId={id} />

                    <div className="mt-4">
                        <ComposeMessage physicianId={id} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}