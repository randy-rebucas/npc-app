import { getUser } from "@/app/actions/user";

import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon, DownloadIcon, PencilIcon } from "lucide-react"; //DownloadIcon
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Sync from "@/components/admin/user/actions/Sync";
import { Button } from "@/components/ui/button";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const user = await getUser(id);

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
                    <div className="flex items-center justify-between gap-2">

                        <Sync id={id} /> 

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`/admin/dashboard/users/form/${id}/edit`}>
                                            <PencilIcon className="w-6 h-6" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit User</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* User Information */}
                    <div className="space-y-6 mb-4">
                        <div className="flex items-center gap-4">
                            <Card className="w-[100px] h-[100px] relative overflow-hidden">
                                <Image
                                    src={user.profile?.profilePhotoPath}
                                    alt="Profile Photo"
                                    fill
                                    className="object-cover"
                                />
                            </Card>
                            <div>
                                <h2 className="text-xl font-semibold">{user.profile?.firstName} {user.profile?.lastName}</h2>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-sm text-muted-foreground">{user.username}</p>
                                <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Status Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Provider</span>
                                        <span className="text-sm">{user.provider}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Submission Status</span>
                                        <span className="text-sm">{user.submissionStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Onboarding Status</span>
                                        <span className="text-sm">{user.onBoardingStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Can Create Listings</span>
                                        <span className="text-sm">{user.canCreateListings ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Created At</span>
                                        <span className="text-sm">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {user.metaData && (
                        <div className="space-y-6 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className=" font-semibold text-xl">
                                            Metadata
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {Object.entries(user.metaData).map(([key, value]) => (
                                            <div key={key} className="py-2 flex justify-between">
                                                <span className="font-medium text-muted-foreground">{key.replace(/-/g, ' ')}</span>
                                                <span className="text-foreground">{value}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Profile Information */}

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">First Name</span>
                                    <span className="text-sm">{user.profile?.firstName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Last Name</span>
                                    <span className="text-sm">{user.profile?.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Phone</span>
                                    <span className="text-sm">{user.profile?.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Description</span>
                                    <span className="text-sm">{user.profile?.description}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">LinkedIn</span>
                                    <span className="text-sm">{user.profile?.linkedinProfile}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Address Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Address</span>
                                    <span className="text-sm">{user.profile?.address ?? '--'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">City</span>
                                    <span className="text-sm">{user.profile?.city ?? '--'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">State</span>
                                    <span className="text-sm">{user.profile?.state ?? '--'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Zip</span>
                                    <span className="text-sm">{user.profile?.zip ?? '--'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Licenses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Professional Licenses</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {user.profile?.medicalLicenseStates && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Medical License States</span>
                                        <span className="text-sm">{user.profile.medicalLicenseStates.map((state) => state.state).join(', ')}</span>
                                    </div>
                                )}
                                {user.profile?.deaLicenseStates && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">DEA License States</span>
                                        <span className="text-sm">{user.profile.deaLicenseStates.map((state) => state.state).join(', ')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">NPI Number</span>
                                    <span className="text-sm">{user.profile?.npiNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Board Certification</span>
                                    <span className="text-sm">{user.profile?.boardCertification}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Professional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {user.profile?.practiceTypes && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Practice Types</span>
                                        <span className="text-sm">{user.profile.practiceTypes.map((type) => type).join(', ')}</span>
                                    </div>
                                )}
                                {user.profile?.additionalCertifications && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Additional Certifications</span>
                                        <span className="text-sm">{user.profile.additionalCertifications.map((cert) => cert.certification).join(', ')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Government ID</span>
                                    <Link
                                        href={{ pathname: '/admin/dashboard/users/download-file/' + user.profile?.governmentIdPath, query: { path: user.profile?.governmentIdPath } }}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        Download
                                        <DownloadIcon className="h-4 w-4" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        {user.profile?.education && (
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Education</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(user.profile.education).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-sm font-medium">{key.replace(/-/g, ' ').charAt(0).toUpperCase() + key.replace(/-/g, ' ').slice(1)}</span>
                                            <span className="text-sm">{value}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>

    );
}