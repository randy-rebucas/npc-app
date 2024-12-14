import Header from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function HelpPage() {
    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Help',
                    href: '/dashboard/help',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Help</h1>
                    </div>

                    <div className="flex flex-col items-center p-8">
                        <h1 className="text-2xl font-semibold mb-8">Need Help or Have Feedback?</h1>

                        <div className="w-full max-w-md space-y-4">
                            {/* Contact Us Card */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div>
                                    <h2 className="text-lg font-medium">Contact us</h2>
                                    <p className="text-gray-400 text-sm">Can ask us for any help</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl">@</span>
                                </div>
                            </div>

                            {/* Report Issue Card */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div>
                                    <h2 className="text-lg font-medium">Report an issue</h2>
                                    <p className="text-gray-400 text-sm">Let us know of any bug</p>
                                </div>
                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xl">🐞</span>
                                </div>
                            </div>

                            {/* Request Feature Card */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div>
                                    <h2 className="text-lg font-medium">Request a feature</h2>
                                    <p className="text-gray-400 text-sm">Tell us about new features</p>
                                </div>
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">NEW</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SidebarInset>
    );
}