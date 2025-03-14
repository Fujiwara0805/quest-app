"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

// Stripeの公開キーを使用してStripeをロード
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </SessionProvider>
  );
}