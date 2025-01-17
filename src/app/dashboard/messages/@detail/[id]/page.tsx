import { MessageThread } from "@/components/messaging/MessageThread";

export default async function MessageDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return <MessageThread receiverId={id} />;
}