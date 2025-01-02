'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/header';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const paymentIntent = searchParams.get('payment_intent') || '';
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret') || '';
    const redirectStatus = searchParams.get('redirect_status') || '';

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const createPaymentIntent = async () => {
            try {
                const payment = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentIntent,
                        paymentIntentClientSecret,
                        redirectStatus
                    }),
                });

                if (payment.ok) {   
                    timeoutId = setTimeout(() => {
                        router.push('/dashboard/payment');
                    }, 3000);
                } else {
                    console.error('Payment verification failed');
                    // Optionally handle the error case
                    router.push('/dashboard/payment');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                // Optionally handle the error case
                router.push('/dashboard/payment');
            }
        };

        createPaymentIntent();

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [router, paymentIntent, paymentIntentClientSecret, redirectStatus]);

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payment", href: "/dashboard/payment", active: true },
    ];

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div className="flex items-center justify-center space-y-2">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold tracking-tight">Payment Successful</h2>
                            <p className="text-muted-foreground">
                                Thank you for your payment. You will be redirected shortly...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}