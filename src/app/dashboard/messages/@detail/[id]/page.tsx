import { IUser } from "@/app/models/User";
import { MessageThread } from "@/components/messaging/MessageThread";

export async function generateStaticParams() {
    const users = await fetch('/api/messages/users').then((res) => res.json())
   
    return users.map((user: IUser) => ({
      id: user.id,
    }))
  }

export default async function MessageDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return <MessageThread receiverId={id} />;
}