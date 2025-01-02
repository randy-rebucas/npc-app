"use client"

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Checkout Form Component
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/payment/success`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? 'An error occurred');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm mt-4">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

// Main Payment Form Component
interface PaymentFormProps {
  clientSecret: string;
}

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Payment Details</h2>
      <Elements stripe={stripePromise} options={options as StripeElementsOptions}>
        <CheckoutForm />
      </Elements>
    </div>
  );
} 