import { MemberstackAdminService } from "@/utils/memberstack-admin";

// Assuming you have a type or interface for the member object
interface Member {
    id: string;
    auth: {
        email: string;
    };
    createdAt?: string;
    lastLogin?: string;
    customFields: {
        'active-license-states': string;
        'base-rate': string;
        'control-fee': string;
        'controlled-substances-needed': string;
        'launch-eta': string;
        'multi-np-fee': string;
        'practice-types': string;
        'state-fee': string;
        'other-skills': string;
    };
    verified: boolean;
    loginRedirect: string | null;
    metaData: object;
    permissions: string[];
    profileImage?: string | null;
    stripeCustomerId?: string | null;
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    try {
        const { data: member } = await MemberstackAdminService.getMemberById(id);

        if (!member) {
            return <div className="text-red-500 text-center mt-4">Member not found</div>;
        }

        const typedMember = member as Member; // Type assertion

        return (
            <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Member Details</h1>
                <div className="space-y-2">
                    <p><strong>ID:</strong> {typedMember.id}</p>
                    <p><strong>Email:</strong> {typedMember.auth.email}</p>
                    <p><strong>Created At:</strong> {new Date(typedMember.createdAt || '').toLocaleString()}</p>
                    <p><strong>Last Login:</strong> {new Date(typedMember.lastLogin || '').toLocaleString()}</p>
                    <p><strong>Active License States:</strong> {typedMember.customFields['active-license-states']}</p>
                    <p><strong>Base Rate:</strong> ${typedMember.customFields['base-rate']}</p>
                    <p><strong>Control Fee:</strong> ${typedMember.customFields['control-fee']}</p>
                    <p><strong>Controlled Substances Needed:</strong> {typedMember.customFields['controlled-substances-needed']}</p>
                    <p><strong>Launch ETA:</strong> {typedMember.customFields['launch-eta']}</p>
                    <p><strong>Multi NP Fee:</strong> ${typedMember.customFields['multi-np-fee']}</p>
                    <p><strong>Practice Types:</strong> {typedMember.customFields['practice-types']}</p>
                    <p><strong>State Fee:</strong> ${typedMember.customFields['state-fee']}</p>
                    <p><strong>Verified:</strong> {typedMember.verified ? 'Yes' : 'No'}</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching member data:", error);
        return <div className="text-red-500 text-center mt-4">Error loading member details</div>;
    }
}