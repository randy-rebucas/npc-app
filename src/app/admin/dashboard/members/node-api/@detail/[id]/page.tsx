import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Assuming you have a type or interface for the member object
interface Member {
    id: string;
    auth: {
        email: string;
    };
    createdAt?: string;
    lastLogin?: string;
    customFields: {
        [key: string]: string;
    };
    verified: boolean;
    loginRedirect: string | null;
    metaData: object;
    permissions: string[];
    profileImage?: string | null;
    stripeCustomerId?: string | null;
}

export default async function DetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    const { data: member } = await MemberstackAdminService.getMemberById(id);

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-red-500 text-center mt-4">
                    <h2 className="text-3xl font-bold">Oops!</h2>
                    <p className="text-lg">We couldn&apos;t find the member you&apos;re looking for.</p>
                    <Link href={`/admin/dashboard/members/node-api`} className="mt-4 text-blue-500 underline">
                        Go back to Members List
                    </Link>
                </div>
            </div>
        );
    }

    const typedMember = member as Member; // Type assertion

    return (
        <div className="px-2">
            <Card>
                <CardHeader className="flex gap-4 p-6 space-y-1.5 flex-row">
                    <Link href={`/admin/dashboard/members/node-api`} className="flex justify-start items-center py-2">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Link>
                    <CardTitle>Member Detail</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="divide-y divide-gray-200">
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-gray-500">ID</dt>
                            <dd className="text-gray-900">{typedMember.id}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-gray-500">Email</dt>
                            <dd className="text-gray-900">{typedMember.auth.email}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-gray-500">Created At</dt>
                            <dd className="text-gray-900">{new Date(typedMember.createdAt || '').toLocaleString()}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-gray-500">Last Login</dt>
                            <dd className="text-gray-900">{new Date(typedMember.lastLogin || '').toLocaleString()}</dd>
                        </div>
                        {Object.entries(typedMember.customFields).map(([key, value]) => (
                            <div key={key} className="py-2 flex justify-between">
                                <dt className="font-medium text-gray-500">{key.replace(/-/g, ' ')}</dt>
                                <dd className="text-gray-900 break-words">{value}</dd>
                            </div>
                        ))}
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-gray-500">Verified</dt>
                            <dd className="text-gray-900"><Badge variant={typedMember.verified ? 'secondary' : 'outline'} className="text-sm">{typedMember.verified ? 'Yes' : 'No'}</Badge></dd>
                        </div>
                    </dl>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end space-x-2">
                        <Button>Edit</Button>
                        <Button>Delete</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}