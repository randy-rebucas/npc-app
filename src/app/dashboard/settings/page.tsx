'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a UI component library

export default function Settings() {
  const [stripeConnected] = useState(false);
    
  const connectWithStripe = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      // Redirect to Stripe Connect onboarding
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
    }
  }, []); // Empty dependency array since function doesn't depend on any props or state

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Payment Settings</h2>
          {stripeConnected ? (
            <div className="text-green-600">
              ✓ Connected to Stripe
            </div>
          ) : (
            <Button onClick={connectWithStripe}>
              Connect with Stripe
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
