'use client'

import { getUserById, UserDocument } from '@/app/actions/user';
import { Certification, License } from '@/lib/types/onboarding';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Request from '@/components/collaboration/actions/Request';
import Schedule from '../collaboration/actions/Schedule';
import Favorite from '../collaboration/actions/Favorite';

export default function FindMatchDetail({ id }: { id: string }) {
    const [user, setUser] = useState<UserDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const user = await getUserById(id);
                setUser(user);
            } catch (err) {
                setError('Failed to load user details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [id]);



    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-auto p-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Image and basic info */}
                <div className="md:w-[70%] space-y-8">
                    {/* Profile Header */}
                    <div>
                        <div className="relative h-80 w-full rounded-lg overflow-hidden mb-4">
                            <Image
                                src={user?.profile?.profilePhotoPath || ''}
                                alt={user?.profile?.firstName || 'Photo not found'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-3">{user?.profile?.title ?? 'MD - Backup Collaborator for PA'}</h1>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user?.profile?.profilePhotoPath || ''} alt={user?.profile?.firstName || 'Photo not found'} className="w-12 h-12 rounded-full" />
                                <AvatarFallback>{user?.profile?.firstName?.charAt(0)} {user?.profile?.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                                <p className="text-gray-600">{user?.profile?.boardCertification}</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-700 mb-4">{user?.profile?.description}</p>
                        {user?.profile?.publications && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Publications</h3>
                                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: user?.profile?.publications }}></div>
                            </div>
                        )}
                    </div>

                    {/* Practice Types */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Practice Types</h2>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.practiceTypes?.map((type) => (
                                <span key={type} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Licenses and Certifications */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">Licenses & Certifications</h2>

                        {/* Medical Licenses */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Medical Licenses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user?.profile?.medicalLicenseStates?.map((state: License) => {
                                    return (
                                        <div key={state.state} className="border p-3 rounded-lg">
                                            <p className="font-medium">{state.state}</p>
                                            <p className="text-sm text-gray-600">License: {state.licenseNumber}</p>
                                            <p className="text-sm text-gray-600">Expires: {state.expirationDate ? new Date(state.expirationDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* DEA Licenses */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">DEA Licenses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user?.profile?.deaLicenseStates?.map((state: License) => {
                                    return (
                                        <div key={state.state} className="border p-3 rounded-lg">
                                            <p className="font-medium">{state.state}</p>
                                            <p className="text-sm text-gray-600">License: {state.licenseNumber}</p>
                                            <p className="text-sm text-gray-600">Expires: {state.expirationDate ? new Date(state.expirationDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Additional Certifications */}
                        <div>
                            <h3 className="font-semibold mb-3">Additional Certifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user?.profile?.additionalCertifications?.map((cert: Certification) => {
                                    return (
                                        <div key={cert.certification} className="border p-3 rounded-lg">
                                            <p className="font-medium">{cert.certification}</p>
                                            <p className="text-sm text-gray-600">Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Expires: {cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Pricing and details */}
                <div className="md:w-[30%] space-y-6">
                    {/* Header and Action Buttons */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.profile?.title}</h2>
                        <p className="text-2xl font-bold text-blue-600 mb-4">
                            {user?.profile?.monthlyCollaborationRate
                                ? `$${user.profile.monthlyCollaborationRate.toFixed(2)}`
                                : 'Price not available'}<span className="text-sm text-gray-500 font-normal">/month</span>
                        </p>
                        <div className="space-y-3">
                            <Schedule calendlyLink={user?.metaData?.calendlyLink || ''} /> 
                            <Request id={id} /> 
                            <Favorite id={id} />
                        </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <h3 className="font-bold text-gray-900 mb-4">Monthly Fee Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Base Rate</span>
                                <span>{user?.profile?.monthlyCollaborationRate
                                    ? `$${user.profile.monthlyCollaborationRate.toFixed(2)}`
                                    : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Platform Fee</span>
                                <span>$0.00</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>Total Monthly Fee</span>
                                <span>{user?.profile?.monthlyCollaborationRate
                                    ? `$${user.profile.monthlyCollaborationRate.toFixed(2)}`
                                    : 'N/A'}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            * All fees are billed monthly. Cancel anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}