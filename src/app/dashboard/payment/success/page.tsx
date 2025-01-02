'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SuccessPage() {
    const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
    const searchParams = useSearchParams();
    const router = useRouter();

    const paymentIntent = searchParams.get('payment_intent') || '';
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret') || '';
    const redirectStatus = searchParams.get('redirect_status') || '';

    useEffect(() => {
        const clientSecret = searchParams.get('payment_intent_client_secret');

        if (clientSecret) {
            stripePromise.then(stripe => {
                stripe?.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
                    switch (paymentIntent?.status) {
                        case "succeeded":
                            setStatus('success');
                            break;
                        case "processing":
                            setStatus('processing');
                            break;
                        default:
                            setStatus('error');
                            break;
                    }
                });
            });
        }
    }, [searchParams]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const createPaymentIntent = async () => {
            try {
                const transaction = await fetch('/api/transaction', {
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

                if (transaction.ok) {
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
                        {status === 'success' && (
                            <div className="text-center">
                                <div className="text-green-500 text-5xl mb-4">✓</div>
                                <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
                                <p className="text-gray-600 mb-4">Thank you for your payment!</p>
                                <a
                                    href="/dashboard/payment"
                                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Return to Dashboard
                                </a>
                            </div>
                        )}
                        {status === 'processing' && (
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-2">Processing Payment...</h1>
                                <p className="text-gray-600">Please wait while we confirm your payment.</p>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="text-center">
                                <div className="text-red-500 text-5xl mb-4">×</div>
                                <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
                                <p className="text-gray-600 mb-4">Something went wrong with your payment.</p>
                                <a
                                    href="/dashboard/payment"
                                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Try Again
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}