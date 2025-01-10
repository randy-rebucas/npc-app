import { getUserById } from "@/app/actions/user";
import { IUserProfile } from "@/app/models/UserProfile";
import { IStripeAccount } from "@/app/models/StripeAccount";
import AdminHeader from "@/components/admin/Header";
import Sync from "@/components/ui/member/sync";
import { SidebarInset } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

type SimplifiedUserResponse = {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    onboardingStatus: string;
    createdAt: Date;
    validated?: boolean;
    profile?: IUserProfile;
    stripeaccount?: IStripeAccount;
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const user = await getUserById(id) as SimplifiedUserResponse;

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Users', href: '/admin/dashboard/users', active: false },
                { label: user?.email, href: `/admin/dashboard/users/${user?.id}`, active: true },
            ]} />

            <div className="flex flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{user?.email}</h1>
                        <Badge variant={user.validated ? 'secondary' : 'outline'} className="text-sm">{user.validated ? 'Validated' : 'Not Validated'}</Badge>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">User Information</h2>
                            <dl className="divide-y divide-gray-200">
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">ID</dt>
                                    <dd className="text-gray-900">{id}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Email</dt>
                                    <dd className="text-gray-900">{user.email}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Username</dt>
                                    <dd className="text-gray-900">{user.username}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Role</dt>
                                    <dd className="text-gray-900">{user.role}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Provider</dt>
                                    <dd className="text-gray-900">{user.provider}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Onboarding Status</dt>
                                    <dd className="text-gray-900"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.onboardingStatus === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {user.onboardingStatus}
                                    </span></dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Created At</dt>
                                    <dd className="text-gray-900">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Validated</dt>
                                    <dd className="text-gray-900"><Badge variant={user.validated ? 'secondary' : 'outline'} className="text-sm">{user.validated ? 'Yes' : 'No'}</Badge></dd>
                                </div>
                            </dl>
                        </div>

                        {/* Profile Information */}
                        <div>
                            <h2 className="text-xl font-semibold">Profile Information</h2>
                            <dl className="divide-y divide-gray-200">
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">First Name</dt>
                                    <dd className="text-gray-900">{user.profile?.firstName}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Last Name</dt>
                                    <dd className="text-gray-900">{user.profile?.lastName}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Board Certification</dt>
                                    <dd className="text-gray-900">{user.profile?.boardCertification}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">LinkedIn</dt>
                                    <dd className="text-gray-900">{user.profile?.linkedinProfile}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Description</dt>
                                    <dd className="text-gray-900">{user.profile?.description}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Profile Photo Path</dt>
                                    <dd className="text-gray-900">{user.profile?.profilePhotoPath}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Government ID Path</dt>
                                    <dd className="text-gray-900">{user.profile?.governmentIdPath}</dd>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">NPI Number</dt>
                                    <dd className="text-gray-900">{user.profile?.npiNumber}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Stripe Account */}
                    <div>
                        <h2 className="text-xl font-semibold">Stripe Account</h2>
                        <dl className="divide-y divide-gray-200">
                            <div className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">Stripe Account ID</dt>
                                <dd className="text-gray-900">{user.stripeaccount?.stripeAccountId}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Sync id={user.id} />
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}