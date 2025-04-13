'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Request from '@/components/collaboration/actions/Request';
import Schedule from '../collaboration/actions/Schedule';
import Favorite from '../collaboration/actions/Favorite';
import { formatCurrency } from '@/lib/utils';
import { useBreakdownStore } from '@/lib/store/breakdown';
import { getListingById, ListingDocument } from '@/app/actions/listing';

export default function FindMatchDetail({ id }: { id: string }) {
    const [listing, setListing] = useState<ListingDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { breakdown, setBreakdown, total } = useBreakdownStore();     


    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const listing = await getListingById(id); 
                setListing(listing); 
            } catch (err) {
                setError('Failed to load user details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [id]);

    useEffect(() => {
        const baseRate = Number(process.env.BASE_RATE ?? 0);
        const controlledSubstancesFee = Number(process.env.CONTROLLED_SUBSTANCES_FEE ?? 0);
        const platformFee = Number(process.env.PLATFORM_FEE ?? 0);
        const additionalStates = (listing?.stateLicenses?.length || 0) * Number(process.env.ADDITIONAL_STATE_FEE ?? 0);
        const additionalNps = (listing?.multipleNPFee ?? 0)
        
        const newBreakdown = new Map([
            ['Base Rate', baseRate],
            ['Controlled Substances Fee', controlledSubstancesFee],
            ['Platform Fee', platformFee],
            ['Additional States Fee', additionalStates],
            ['Additional NP Fee', additionalNps]
        ]);
        setBreakdown(newBreakdown);
        
    }, [listing, setBreakdown]);

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center text-destructive">
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
                                src={listing?.profile?.profilePhotoPath || ''}
                                alt={listing?.profile?.firstName || 'Photo not found'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-3 text-foreground">{listing?.title ?? 'MD - Backup Collaborator for PA'}</h1>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={listing?.profile?.profilePhotoPath || ''} alt={listing?.profile?.firstName || 'Photo not found'} className="w-12 h-12 rounded-full" />
                                <AvatarFallback>{listing?.profile?.firstName?.charAt(0)} {listing?.profile?.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-foreground">{listing?.profile?.firstName} {listing?.profile?.lastName}</p>
                                <p className="text-muted-foreground">{listing?.boardCertification}</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-bold mb-4 text-foreground">About</h2>
                        <p className="text-muted-foreground mb-4">{listing?.description}</p>
                        {listing?.description && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2 text-foreground">Publications</h3>
                                <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: listing?.description }}></div>
                            </div>
                        )}
                    </div>

                    {/* Practice Types */}
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-bold mb-4 text-foreground">Practice Types</h2>
                        <div className="flex flex-wrap gap-2">
                            {listing?.practiceTypes?.map((type) => (
                                <span key={type} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Licenses and Certifications */}
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-bold mb-6 text-foreground">Licenses & Certifications</h2>

                        {/* Medical Licenses */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3 text-foreground">Medical Licenses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {listing?.stateLicenses?.map((state: string) => {
                                    return (
                                        <div key={state} className="border border-border p-3 rounded-lg bg-card">
                                            <p className="font-medium text-foreground">{state}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>  

                        {/* DEA Licenses */}
                        {/* <div className="mb-6">
                            <h3 className="font-semibold mb-3 text-foreground">DEA Licenses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {listing?.deaLicenseStates?.map((state: License) => (
                                    <div key={state.state} className="border border-border p-3 rounded-lg bg-card">
                                        <p className="font-medium text-foreground">{state.state}</p>
                                        <p className="text-sm text-muted-foreground">License: {state.licenseNumber}</p>
                                        <p className="text-sm text-muted-foreground">Expires: {state.expirationDate ? new Date(state.expirationDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Additional Certifications */}
                        {/* <div>
                            <h3 className="font-semibold mb-3 text-foreground">Additional Certifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {listing?.additionalCertifications?.map((cert: Certification) => (
                                    <div key={cert.certification} className="border border-border p-3 rounded-lg bg-card">
                                        <p className="font-medium text-foreground">{cert.certification}</p>
                                        <p className="text-sm text-muted-foreground">Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</p>
                                        <p className="text-sm text-muted-foreground">Expires: {cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Right side - Pricing and details */}
                <div className="md:w-[30%] space-y-6">
                    {/* Header and Action Buttons */}
                    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-2">{listing?.title}</h2>
                        <p className="text-2xl font-bold text-primary mb-4">
                            {listing?.monthlyBaseRate
                                ? `$${listing.monthlyBaseRate.toFixed(2)}`
                                : 'Price not available'}<span className="text-sm text-muted-foreground font-normal">/month</span>
                        </p>
                        <div className="space-y-3">
                            <Schedule calendlyLink={listing?.metaData?.calendlyLink || ''} /> 
                            <Request id={id} /> 
                            <Favorite id={id} />
                        </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                        <h3 className="font-bold text-foreground mb-4">Monthly Fee Breakdown</h3>
                        <div className="space-y-4">
                            {Array.from(breakdown.entries()).map(([key, value]) => (
                                <div className="flex justify-between text-muted-foreground" key={key}>
                                    <span>{key}</span>
                                    <span>{formatCurrency(value)}</span>
                                </div>
                            ))}
                            
                            <div className="h-px bg-border my-2"></div>
                            <div className="flex justify-between font-bold text-foreground">
                                <span>Total Monthly Fee</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            * All fees are billed monthly. Cancel anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}