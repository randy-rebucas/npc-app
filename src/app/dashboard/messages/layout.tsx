import Header from "@/components/header";

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

// Add proper TypeScript props interface
interface MessagesLayoutProps {
    children: React.ReactNode;
    detail: React.ReactNode;
}

export default function MessagesLayout({ children, detail }: MessagesLayoutProps) {
    return (
        <div className="bg-white min-h-screen w-full text-gray-900">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-[1800px] mx-auto">
                <div className="h-[calc(100vh-4rem)] flex">
                    <div className="w-1/3">
                        {children}
                    </div>

                    <div className="flex-1">
                        {detail}
                    </div>
                </div>
            </main>
        </div>
    );
}