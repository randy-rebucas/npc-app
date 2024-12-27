import { getEnquiries } from "@/app/actions/enquiry";
import { getFeatures } from "@/app/actions/feature";
import { getIssues } from "@/app/actions/issue";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Help Dashboard',
};


export default async function HelpPage() {
    const { total: issues } = await getIssues({ page: 1, search: '', status: 'pending', limit: 10000 });
    const { total: features } = await getFeatures({ page: 1, search: '', status: 'all', limit: 10000 });
    const { total: enquiries } = await getEnquiries({ page: 1, search: '', status: 'pending', limit: 10000 });


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-700">Features</h2>
                <p className="text-3xl font-bold mt-2">{features}</p>
                <p className="text-sm text-gray-500 mt-1">Total features</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-700">Issues</h2>
                <p className="text-3xl font-bold mt-2">{issues}</p>
                <p className="text-sm text-gray-500 mt-1">Open issues</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-700">Enquiries</h2>
                <p className="text-3xl font-bold mt-2">{enquiries}</p>
                <p className="text-sm text-gray-500 mt-1">Pending enquiries</p>
            </div>
        </div>

    )
}