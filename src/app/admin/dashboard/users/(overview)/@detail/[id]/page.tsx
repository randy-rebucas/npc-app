import { getUserById } from "@/app/actions/user";
import { IUserProfile } from "@/app/models/UserProfile";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SimplifiedUserResponse = {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    createdAt: Date;
    metaData?: {
        [key: string]: string;
    };
    profile?: IUserProfile;
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const user = await getUserById(id) as SimplifiedUserResponse;

    return (
        <div className="px-2">
            <Card>
                <CardHeader className="flex gap-4 p-6 space-y-1.5 flex-row justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/dashboard/users`} className="flex justify-start items-center py-2">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </Link>
                        <CardTitle className="text-xl font-bold">
                            {user?.email}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button>Update</Button>
                        <Button variant="outline">Actions</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* User Information */}
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
                                <dt className="font-medium text-gray-500">Created At</dt>
                                <dd className="text-gray-900">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</dd>
                            </div>
                        </dl>
                    </div>

                    {user.metaData && (
                        <div>
                            <h2 className="text-xl font-semibold">Metadata</h2>
                            <dl className="divide-y divide-gray-200">
                                {Object.entries(user.metaData).map(([key, value]) => (
                                    <div key={key} className="py-2 flex justify-between">
                                        <dt className="font-medium text-gray-500">{key.replace(/-/g, ' ')}</dt>
                                        <dd className="text-gray-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

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
                                <dt className="font-medium text-gray-500">Phone</dt>
                                <dd className="text-gray-900">{user.profile?.phone}</dd>
                            </div>
                            <div className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">Address</dt>
                                <dd className="text-gray-900">{user.profile?.address}</dd>
                            </div>
                            <div className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">City</dt>
                                <dd className="text-gray-900">{user.profile?.city}</dd>
                            </div>
                            <div className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">State</dt>
                                <dd className="text-gray-900">{user.profile?.state}</dd>
                            </div>
                            <div className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">Zip</dt>
                                <dd className="text-gray-900">{user.profile?.zip}</dd>
                            </div>
                            {user.profile?.medicalLicenseStates &&
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Medical License States</dt>
                                    <dd className="text-gray-900">{user.profile?.medicalLicenseStates.map((state) => state.state).join(', ')}</dd>
                                </div>
                            }

                            {user.profile?.deaLicenseStates &&
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">DEA License States</dt>
                                    <dd className="text-gray-900">{user.profile?.deaLicenseStates.map((state) => state.state).join(', ')}</dd>
                                </div>
                            }

                            {user.profile?.practiceTypes &&
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Practice Types</dt>
                                    <dd className="text-gray-900">{user.profile?.practiceTypes.map((type) => type).join(', ')}</dd>
                                </div>
                            }

                            {user.profile?.additionalCertifications &&
                                <div className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">Additional Certifications</dt>
                                    <dd className="text-gray-900">{user.profile?.additionalCertifications.map((certification) => certification.certification).join(', ')}</dd>
                                </div>
                            }

                            {user.profile?.education && Object.entries(user.profile?.education).map(([key, value]) => (
                                <div key={key} className="py-2 flex justify-between">
                                    <dt className="font-medium text-gray-500">{key.replace(/-/g, ' ').charAt(0).toUpperCase() + key.replace(/-/g, ' ').slice(1)}</dt>
                                    <dd className="text-gray-900">
                                        {value}
                                    </dd>
                                </div>
                            ))}

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
                </CardContent>
            </Card>
        </div>

    );
}