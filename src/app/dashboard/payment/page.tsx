"use client"

import { useCallback, useEffect, useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { IPayoutObject, IChargeObject, IBalance, IAccountObject } from '@/utils/stripe';
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentPage() {
  const [payouts, setPayouts] = useState<IPayoutObject[] | null>(null);
  const [availableBalance, setAvailableBalance] = useState<IBalance[] | null>(null);
  const [account, setAccount] = useState<IAccountObject | null>(null);
  const [charges, setCharges] = useState<IChargeObject[] | null>(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const connectWithStripe = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
    }
  }, []); // Empty dependency array since function doesn't depend on any props or state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [statusRes, payoutsRes, balanceRes, chargesRes] = await Promise.all([
          fetch("/api/stripe/status"),
          fetch("/api/stripe/payout"),
          fetch("/api/stripe/balance/available"),
          fetch("/api/stripe/charges")
        ]);

        // Check if any response failed
        // if (!statusRes.ok || !payoutsRes.ok || !balanceRes.ok || !chargesRes.ok) {
        // const failedEndpoint = [
        //   { res: statusRes, name: 'status' },
        //   { res: payoutsRes, name: 'payout' },
        //   { res: balanceRes, name: 'balance' },
        //   { res: chargesRes, name: 'charges' }
        // ].find(({ res }) => !res.ok);

        // throw new Error(`API endpoint ${failedEndpoint?.name} failed with status ${failedEndpoint?.res.status}`);
        // }

        const [statusData, payoutsData, balanceData, chargesData] = await Promise.all([
          statusRes.json(),
          payoutsRes.json(),
          balanceRes.json(),
          chargesRes.json()
        ]);

        console.log(statusData);
        console.log(payoutsData);
        console.log(balanceData);
        console.log(chargesData);

        // Validate required data
        // if (!statusData || !payoutsData?.payouts?.data || !balanceData?.available || !chargesData?.charges?.data) {
        //   throw new Error('Received incomplete data from the API');
        // }

        setAccount(statusData);
        setStripeConnected(statusData.account !== null);
        setPayouts(payoutsData.data);
        setAvailableBalance(balanceData.data);
        setCharges(chargesData.data);
      } catch (err) {
        // const errorMessage = err instanceof Error ?
        //   `Failed to load payment data: ${err.message}` :
        //   "Failed to load payment data. Please try again later.";
        // setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Payment", href: "/dashboard/payment", active: true },
  ];

  const renderStatCard = (icon: string, title: string, amount: string, subtitle: string) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center text-blue-500 text-sm font-medium mb-2">
        <span className="mr-2">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{amount}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );

  const formatDate = (date: number | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log(account);
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Header breadcrumbs={breadcrumbs} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : stripeConnected ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Payment Dashboard</h1>
              {account && (
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => window.open(`https://dashboard.stripe.com/${account.id}/dashboard`, '_blank')}
                >
                  <span>Open Stripe Dashboard</span>
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {renderStatCard('💰', 'Next Payout', payouts && payouts.length > 0 ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: payouts[0].currency
              }).format(payouts[0].amount ?? 0) : 'Loading...', payouts && payouts.length > 0 ? `Scheduled for ${payouts[0].arrival_date}` : 'Calculating...')}

              {renderStatCard('📅', 'This Month', availableBalance && availableBalance.length > 0 ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: availableBalance[0].currency
              }).format(availableBalance[0].amount) : 'Loading...', availableBalance && availableBalance.length > 0 ? `From ${availableBalance[0].source_types} collaborators` : 'Calculating...')}

              {renderStatCard('💰', 'Total Earnings', availableBalance && availableBalance.length > 0 ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: availableBalance[0].currency
              }).format(availableBalance[0].amount) : 'Loading...', 'Last 12 months')}
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium">Recent Transactions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {charges && charges.map((payment: IChargeObject, index: number) => (
                  <div key={index} className="p-6 flex items-center justify-between">
                    <div>
                      <div className="font-medium">${payment.amount / 100}</div>
                      <div className="text-sm text-gray-500">{formatDate(payment.created)}</div>
                    </div>
                    <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                      {payment.status}
                    </span>
                  </div>
                ))}
                {charges && charges.length === 0 && (
                  <div className="p-6 text-center text-gray-500">No transactions found</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Welcome to Stripe Connect</h2>
            <p className="text-gray-600 mb-8">
              We&apos;ve partnered with Stripe to provide secure, reliable payments for healthcare professionals. Let&apos;s get your account set up to receive payments.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Business Information</h3>
                  <p className="text-sm text-gray-500">Provide your practice details and tax information</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Bank Account Connection</h3>
                  <p className="text-sm text-gray-500">Connect your bank account for direct deposits</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Start Receiving Payments</h3>
                  <p className="text-sm text-gray-500">Track your earnings and manage payments in one place</p>
                </div>
              </div>
            </div>

            <Button
              onClick={connectWithStripe}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
            >
              Connect with Stripe
            </Button>

            <p className="text-sm text-gray-500 mt-6">
              By continuing, you agree to Stripe&apos;s terms of service and privacy policy.
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 