import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";

export default async function Dashboard() {
    const { claims } = await getLogtoContext(logtoConfig);

    return (
        <>
            {/* User Data Section */}
            {(claims) && (
                <section className="pt-32 px-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                        <h2 className="font-semibold mb-6 p-4 text-2xl text-gray-900">Your Profile Data</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Object.entries(claims).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{key}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{String(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}