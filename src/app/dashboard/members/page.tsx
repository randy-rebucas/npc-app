// Add at the top of the file
import { syncMembers } from '@/app/actions/members';  // Adjust the import path based on your actual file structure

export default function Members() {

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={async () => {
                        'use server';
                        await syncMembers();
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Members
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 p-4 font-semibold border-b">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>

                {/* Member rows */}
                <div className="divide-y">
                    <div className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <span>John Doe</span>
                        </div>
                        <div className="flex items-center">john@example.com</div>
                        <div className="flex items-center">
                            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Admin</span>
                        </div>
                        <div className="flex items-center">
                            <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
