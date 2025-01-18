import { ConversationList } from "@/components/messaging/ConversationList";
import { SearchParams } from "@/lib/types/search-params";
import Header from "@/components/header";
import { MessageThread } from "@/components/messaging/MessageThread";

// Add type definition for breadcrumb items
type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Messages", href: "/dashboard/messages", active: false },
];

export default async function MessagesPage(props: {
  searchParams: SearchParams
}) {
  const params = await props.searchParams;

  const receiverId = String(params?.receiverId) || null;
  console.log(receiverId);
  return (
    <div className="bg-white min-h-screen w-full text-gray-900">
      <Header breadcrumbs={breadcrumbs} />
      <main className="max-w-[1800px] mx-auto">
        <div className="h-[calc(100vh-4rem)] flex">
          <div className="w-1/3">
            <ConversationList receiverId={receiverId} />
          </div>

          <div className="flex-1">
            {receiverId && <MessageThread receiverId={receiverId} />}
          </div>
        </div>
      </main>
    </div>
  );
} 