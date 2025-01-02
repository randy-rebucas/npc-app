"use client"

import { useEffect, useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import Header from '@/components/header';
import { IPayment } from '@/app/models/Payment';

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [nextPayout, setNextPayout] = useState<{ amount: number; date: string } | null>(null);
  const [thisMonth, setThisMonth] = useState<{ amount: number; collaboratorCount: number } | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<{ amount: number; monthlyData: number[] } | null>(null);
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const fetchCreatePaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1000 }), // $10.00
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchCreatePaymentIntent();

    // New fetch for next payout information
    const fetchNextPayout = async () => {
      try {
        const response = await fetch("/api/payment/get-next-payout");
        console.log('Next Payout Response:', {
          status: response.status,
          url: response.url
        });

        if (!response.ok) {
          setNextPayout({ amount: 0, date: new Date().toLocaleDateString() });
          throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
        }
        const data = await response.json();
        setNextPayout(data);
      } catch (error) {
        console.error("Error fetching next payout:", error);
      }
    };

    fetchNextPayout();

    // Add new fetch for this month's data
    const fetchThisMonth = async () => {
      try {
        const response = await fetch("/api/payment/get-this-month");
        console.log('This Month Response:', {
          status: response.status,
          url: response.url
        });

        if (!response.ok) {
          setThisMonth({ amount: 0, collaboratorCount: 0 });
          throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
        }
        const data = await response.json();
        setThisMonth(data);
      } catch (error) {
        console.error("Error fetching this month's data:", error);
      }
    };

    fetchThisMonth();

    // Add new fetch for total earnings
    const fetchTotalEarnings = async () => {
      try {
        const response = await fetch("/api/payment/get-total-earnings");
        if (!response.ok) {
          setTotalEarnings({ amount: 0, monthlyData: [] });
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTotalEarnings(data);
      } catch (error) {
        console.error("Error fetching total earnings:", error);
      }
    };

    fetchTotalEarnings();

    const fetchPayment = async () => {
      try {
        const response = await fetch("/api/payment");
        console.log('Payments Response:', {
          status: response.status,
          url: response.url
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      }
    };
    fetchPayment();
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Payment", href: "/dashboard/payment", active: true },
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Header breadcrumbs={breadcrumbs} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Dashboard</h1>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            <span>Open Stripe Dashboard</span>
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-blue-500 text-sm font-medium mb-2">
              <span className="mr-2">💰</span>
              <span>Next Payout</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {nextPayout ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(nextPayout.amount) : 'Loading...'}
            </div>
            <div className="text-sm text-gray-500">
              {nextPayout ? `Scheduled for ${nextPayout.date}` : 'Calculating...'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-blue-500 text-sm font-medium mb-2">
              <span className="mr-2">📅</span>
              <span>This Month</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {thisMonth ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(thisMonth.amount) : 'Loading...'}
            </div>
            <div className="text-sm text-gray-500">
              {thisMonth ? `From ${thisMonth.collaboratorCount} collaborators` : 'Calculating...'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-blue-500 text-sm font-medium mb-2">
              <span className="mr-2">💰</span>
              <span>Total Earnings</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {totalEarnings ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalEarnings.amount) : 'Loading...'}
            </div>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Payments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-medium">${payment.amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{payment.createdAt.toLocaleDateString()}</div>
                </div>
                <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                  {payment.status}
                </span>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="p-6 text-center text-gray-500">No payments found</div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        {clientSecret && (
          <div className="mt-8">
            <PaymentForm clientSecret={clientSecret} />
          </div>
        )}
      </main>
    </div>
  );
} 