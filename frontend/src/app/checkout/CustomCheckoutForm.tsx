"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { Loader2, Lock as LockIcon, AlertCircle, CreditCard, CalendarDays, CheckCircle2 } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface CustomCheckoutFormProps {
  amount: number;
}

export default function CustomCheckoutForm({ amount }: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardZip, setCardZip] = useState("");

  const ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '15px',
        color: '#FFFFFF',
        fontWeight: '500',
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        '::placeholder': {
          color: '#ffffff75',
          fontWeight: '500',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // If the total is 0, we can bypass Stripe completely
    if (amount <= 0) {
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    // MOCK SUBMISSION
    setTimeout(() => {
      // Fake a success for UI demonstration
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 border border-emerald-500/20">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">Payment Successful</h3>
        <p className="text-slate-100">Thank you for your business. A receipt has been sent to your email.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2 bg-white text-black rounded-lg hover:bg-slate-200 transition-colors font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {amount > 0 ? (
        <div className="space-y-5">
          {/* Name on Card */}
          <div>
            <label htmlFor="card-name" className="block text-sm font-medium text-white mb-1.5">
              Cardholder Name
            </label>
            <input
              id="card-name"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="w-full rounded-lg border border-white/10 px-3 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent text-white bg-[#1A1A1A] hover:bg-[#222222] transition-colors placeholder-[#ffffff75] font-medium placeholder:font-medium antialiased font-sans"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Card Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-white">
                <CreditCard className="h-5 w-5 text-slate-100 group-focus-within:text-white transition-colors" />
              </div>
              <div className="w-full rounded-lg border border-white/10 px-3 py-3 pl-11 bg-[#1A1A1A] hover:bg-[#222222] focus-within:bg-[#222222] focus-within:ring-2 focus-within:ring-white/20 focus-within:border-transparent transition-all">
                <CardNumberElement options={{ ...ELEMENT_OPTIONS, showIcon: false }} />
              </div>
            </div>
          </div>

          {/* Expiry and CVC Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Expiration date
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <CalendarDays className="h-5 w-5 text-slate-100 group-focus-within:text-white transition-colors" />
                </div>
                <div className="w-full rounded-lg border border-white/10 px-3 py-3 pl-11 bg-[#1A1A1A] hover:bg-[#222222] focus-within:bg-[#222222] focus-within:ring-2 focus-within:ring-white/20 focus-within:border-transparent transition-all">
                  <CardExpiryElement options={ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                CVC
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <LockIcon className="h-4 w-4 text-slate-100 group-focus-within:text-white transition-colors" />
                </div>
                <div className="w-full rounded-lg border border-white/10 px-3 py-3 pl-10 bg-[#1A1A1A] hover:bg-[#222222] focus-within:bg-[#222222] focus-within:ring-2 focus-within:ring-white/20 focus-within:border-transparent transition-all">
                  <CardCvcElement options={ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="card-zip" className="block text-sm font-medium text-white mb-1.5">
              ZIP / Postal code
            </label>
            <input
              id="card-zip"
              type="text"
              value={cardZip}
              onChange={(e) => setCardZip(e.target.value)}
              placeholder="10001"
              required
              className="w-full rounded-lg border border-white/10 px-3 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-[#1A1A1A] hover:bg-[#222222] transition-colors placeholder-[#ffffff75] font-medium placeholder:font-medium antialiased font-sans"
            />
          </div>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-2 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">No Payment Required</h3>
            <p className="text-slate-200 max-w-[260px] mx-auto text-sm leading-relaxed">
              Your applied credits and discounts cover the full total. Click below to finalize your order.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={(!stripe && amount > 0) || isProcessing}
          className="w-full relative flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-2xl text-[16px] font-bold text-black bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin h-5 w-5 text-black" />
          ) : (
            <>
              {amount > 0 ? (
                <>
                  Pay ${amount.toFixed(2)}
                </>
              ) : (
                "Complete Transaction"
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
}