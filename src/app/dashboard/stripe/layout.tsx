"use client"

import { Skeleton } from "@/components/ui/skeleton";
import Header from '@/components/header';
import { useEffect, useState } from "react";

export default function PaymentLayout({
    children,
    connect,
    statsCard,
    payments,
    payouts
}: {
    children: React.ReactNode,
    connect: React.ReactNode,
    statsCard: React.ReactNode,
    payments: React.ReactNode,
    payouts: React.ReactNode
}) {
    const [activeTab, setActiveTab] = useState('payments');
    const [stripeConnected, setStripeConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        {
            label: 'Stripe',
            href: '/dashboard/stripe',
            active: true,
        },
    ];

    useEffect(() => {
        const fetchAccount = async () => {
            const accountStatus = await fetch("/api/stripe/status");

            const { account } = await accountStatus.json();

            setStripeConnected(account.charges_enabled && account.payouts_enabled ? true : false);
        };
        fetchAccount();
    }, []);

    useEffect(() => {
        setIsLoading(false);
    }, [stripeConnected]);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {isLoading &&
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow">
                                <Skeleton className="h-4 w-24 mb-4" />
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ))}
                    </div>
                }
                {!stripeConnected &&
                    <>
                        {children}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {statsCard}
                        </div>
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`${activeTab === 'payments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Payments
                                </button>
                                <button
                                    onClick={() => setActiveTab('payouts')}
                                    className={`${activeTab === 'payouts'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Payouts
                                </button>
                            </nav>
                        </div>

                        <div className="bg-white rounded-lg shadow mb-8">
                            {activeTab === 'payments' && (
                                payments
                            )}
                            {activeTab === 'payouts' && (
                                payouts
                            )}
                        </div>
                    </>
                }
                {stripeConnected &&
                    connect
                }
            </main>
        </div>
    );
}