

import FindMatchDetail from "@/components/find-match/Detail";
import Modal from "@/components/modal";

export default async function FindMatchModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <Modal className="max-w-7xl">
            <FindMatchDetail id={id} /> 
        </Modal>
    );
}