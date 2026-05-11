"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CustomCheckoutForm from "./CustomCheckoutForm";
import { Tag, Wallet, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Lock as LockIcon, ArrowLeft, Plus } from "lucide-react";
import { SavedPaymentMethods } from "./SavedPaymentMethods";
import { PaymentMethodResponse } from "@/api/api-contracts";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

// Initialize Stripe outside of component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

// Mock Saved Payment Methods
const mockSavedCards: PaymentMethodResponse[] = [
  {
    id: "pm_1",
    cardBrand: "visa",
    cardLast4: "4242",
    cardExpMonth: 12,
    cardExpYear: 2025,
    isDefault: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: "pm_2",
    cardBrand: "mastercard",
    cardLast4: "5555",
    cardExpMonth: 10,
    cardExpYear: 2024,
    isDefault: false,
    isActive: true,
    isVerified: true,
  },
  {
    id: "pm_3",
    cardBrand: "amex",
    cardLast4: "0005",
    cardExpMonth: 8,
    cardExpYear: 2026,
    isDefault: false,
    isActive: true,
    isVerified: true,
  },
  {
    id: "pm_4",
    cardBrand: "visa",
    cardLast4: "1111",
    cardExpMonth: 3,
    cardExpYear: 2027,
    isDefault: false,
    isActive: true,
    isVerified: true,
  },
  {
    id: "pm_5",
    cardBrand: "mastercard",
    cardLast4: "8888",
    cardExpMonth: 6,
    cardExpYear: 2025,
    isDefault: false,
    isActive: true,
    isVerified: true,
  }
];

export default function CheckoutPage() {
  // Mock Invoice Data
  const baseAmount = 50.0;
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Mock Wallet Data
  const [walletBalance] = useState(50.0);
  const [walletInputAmount, setWalletInputAmount] = useState("");
  const [walletAppliedAmount, setWalletAppliedAmount] = useState(0);
  const [walletError, setWalletError] = useState("");
  const [isApplyingWallet, setIsApplyingWallet] = useState(false);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | 'new'>(mockSavedCards[0]?.id || 'new');
  const selectedCard = mockSavedCards.find(c => c.id === selectedPaymentMethodId);

  // Calculate Totals dynamically
  const subtotal = baseAmount;
  const discountAmount = promoApplied ? subtotal * promoApplied.discount : 0;
  const afterDiscount = subtotal - discountAmount;
  // Ensure we don't deduct more than the remaining balance or the wallet balance
  const effectiveWalletDeduction = Math.min(walletAppliedAmount, afterDiscount, walletBalance);
  const finalTotal = afterDiscount - effectiveWalletDeduction;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError("");

    // Mock API Call to validate promo code
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE20") {
        setPromoApplied({ code: "SAVE20", discount: 0.2 });
      } else {
        setPromoError("Invalid or expired promo code.");
      }
      setIsApplyingPromo(false);
    }, 600);
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
  };

  const handleApplyWallet = () => {
    const amount = parseFloat(walletInputAmount);
    setWalletError("");

    if (isNaN(amount) || amount <= 0) {
      setWalletError("Please enter a valid amount.");
      return;
    }

    if (amount > walletBalance) {
      setWalletError(`You only have $${walletBalance.toFixed(2)} available.`);
      return;
    }

    if (amount > afterDiscount) {
      setWalletError(`Amount cannot exceed the remaining balance ($${afterDiscount.toFixed(2)}).`);
      return;
    }

    setIsApplyingWallet(true);

    // Mock API call to apply wallet credits
    setTimeout(() => {
      setWalletAppliedAmount(amount);
      setIsApplyingWallet(false);
    }, 500);
  };

  const handleRemoveWallet = () => {
    setWalletAppliedAmount(0);
    setWalletInputAmount("");
  };

  const handleApplyMaxWallet = () => {
    const maxApplicable = Math.min(walletBalance, afterDiscount);
    setWalletInputAmount(maxApplicable.toFixed(2));
  };

  const handlePayWithSavedCard = () => {
    // Logic for charging a saved card via backend
    console.log("Charging saved card:", selectedPaymentMethodId);
    // In a real app, this would be an API call
  };

  return (
    <div className={`${inter.className} min-h-screen bg-background`}>
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Checkout Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#111111] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="bg-[#1A1A1A] px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    Billing Information
                  </h2>
                  <div className="flex gap-2">
                    <div className="w-9 h-6 bg-white/10 rounded-md backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-red-500/80 -mr-1 mix-blend-multiply"></div>
                      <div className="w-4 h-4 rounded-full bg-yellow-500/80 mix-blend-multiply"></div>
                    </div>
                    <div className="w-9 h-6 bg-white/10 rounded-md backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-white text-[10px] italic">VISA</div>
                  </div>
                </div>

                <div className="p-8 space-y-10">
                  {/* Contact Information Section */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">Contact Information</h3>
                      <button className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">Edit information</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                        JD
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-white">Jane Doe</p>
                        <p className="text-xs text-slate-100">jane.doe@example.com</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  <div className="space-y-6">
                    <div className={selectedPaymentMethodId === 'new' ? "space-y-2" : ""}>
                      {selectedPaymentMethodId === 'new' && (
                        <button
                          onClick={() => setSelectedPaymentMethodId(mockSavedCards[0]?.id || '')}
                          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-0"
                        >
                          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                          <span className="text-[11px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">Back to saved</span>
                        </button>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {selectedPaymentMethodId === 'new' ? 'Add New Card' : 'Payment Methods'}
                        </h3>
                        {selectedPaymentMethodId !== 'new' && (
                          <button
                            onClick={() => setSelectedPaymentMethodId('new')}
                            className="flex items-center gap-2 text-xs font-bold text-black bg-white hover:bg-slate-100 transition-all px-4 py-2 rounded-lg active:scale-[0.98] shadow-lg shadow-white/5"
                          >
                            <Plus className="w-4 h-4" />
                            Add New
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative min-h-[140px]">
                      {selectedPaymentMethodId !== 'new' ? (
                        <div>
                          {/* Scrollable Container for Saved Cards */}
                          <div className="max-h-[300px] overflow-y-auto pr-3 custom-scrollbar space-y-3">
                            <style jsx global>{`
                            .custom-scrollbar::-webkit-scrollbar {
                              width: 5px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                              background: rgba(255, 255, 255, 0.02);
                              border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                              background: rgba(255, 255, 255, 0.1);
                              border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                              background: rgba(255, 255, 255, 0.2);
                            }
                          `}</style>
                            <SavedPaymentMethods
                              methods={mockSavedCards}
                              selectedId={selectedPaymentMethodId}
                              onSelect={setSelectedPaymentMethodId}
                            />
                          </div>

                          <div className="mt-8 pt-2">
                            <button
                              onClick={handlePayWithSavedCard}
                              className="w-full py-4 rounded-xl text-[16px] font-bold text-black bg-white hover:bg-slate-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                            >
                              Pay ${Math.max(0, finalTotal).toFixed(2)}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Elements stripe={stripePromise}>
                            <CustomCheckoutForm amount={finalTotal} />
                          </Elements>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Invoice & Options */}
            <div className="lg:col-span-5 space-y-6 sticky top-8">

              {/* Order Summary */}
              <div className="bg-[#111111] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>

                  <div className="space-y-4 text-sm">
                    {/* Product Item Line */}
                    <div className="flex justify-between items-start pb-4">
                      <div>
                        <p className="font-medium text-white">Pro Plan Subscription</p>
                        <p className="text-slate-100">Annual billing</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-white block">${baseAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* What's Included / Value Prop */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-[11px] font-bold text-white uppercase tracking-widest">What's Included?</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-xs text-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          <span><strong>200,000</strong> API Credits / Month</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          <span><strong>250,000</strong> Hard Request Limit</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>High-speed bandwidth priority</span>
                        </li>
                      </ul>
                    </div>

                    <hr className="border-white/5" />

                    {/* Integrated Promo Code Input */}
                    {!promoApplied ? (
                      <div className="py-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200" />
                            <input
                              type="text"
                              placeholder="Promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="w-full rounded-xl border border-white/10 pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/20 uppercase bg-[#1A1A1A] text-white placeholder:text-slate-200 transition-colors"
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            disabled={isApplyingPromo || !promoCode.trim()}
                            className="bg-white hover:bg-slate-100 text-black font-bold px-4 rounded-xl text-xs transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-white/5"
                          >
                            {isApplyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {promoError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="flex justify-between items-center text-emerald-400 font-medium bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-xl animate-in slide-in-from-top-2">
                          <span className="flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Code <strong>{promoApplied.code}</strong> Applied
                          </span>
                          <button onClick={handleRemovePromo} className="text-[11px] text-slate-100 hover:text-red-400 ml-1 underline decoration-dotted">Remove</button>
                        </div>
                      </div>
                    )}

                    <hr className="border-white/5" />

                    {/* Pricing Breakdown Section */}
                    <div className="space-y-3 py-1">
                      <div className="flex justify-between items-center text-slate-100">
                        <span>Subtotal</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between items-center text-emerald-400 font-medium animate-in slide-in-from-right-2">
                          <span>Discount</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {effectiveWalletDeduction > 0 && (
                        <div className="flex justify-between items-center text-blue-400 font-medium animate-in slide-in-from-right-2">
                          <span>Wallet Credit</span>
                          <span>-${effectiveWalletDeduction.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <hr className="border-white/5" />

                    {/* Final Total Due */}
                    <div className="flex justify-between items-baseline pt-2">
                      <div className="space-y-0.5">
                        <span className="text-xl font-bold text-white block">Total</span>
                      </div>
                      <span className="text-3xl font-bold text-white tracking-tight">
                        ${Math.max(0, finalTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Integration */}
              <div className="bg-[#111111] rounded-2xl shadow-xl border border-white/10 p-6 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                      <Wallet className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">My Wallet</h4>
                      <p className="text-sm text-slate-100">Available: <span className="font-bold text-white">${walletBalance.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>

                {walletAppliedAmount === 0 ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-200 font-medium">$</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={walletInputAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*\.?\d*$/.test(val)) {
                              setWalletInputAmount(val);
                            }
                          }}
                          className="w-full rounded-xl border border-white/10 px-3.5 pl-7 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1A1A1A] text-white placeholder:text-slate-100 transition-colors"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyWallet()}
                        />
                        <button
                          onClick={handleApplyMaxWallet}
                          className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-blue-300 hover:text-blue-200"
                        >
                          MAX
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyWallet}
                        disabled={isApplyingWallet || !walletInputAmount}
                        className="bg-white hover:bg-slate-100 text-black font-bold px-4 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center min-w-[80px] shadow-lg shadow-white/5"
                      >
                        {isApplyingWallet ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {walletError && (
                      <p className="text-red-400 text-xs flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {walletError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-sm text-blue-200 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <p>Applied <strong className="text-white">${walletAppliedAmount.toFixed(2)}</strong></p>
                    </div>
                    <button type="button" onClick={handleRemoveWallet} className="text-blue-100 hover:text-white text-xs font-semibold bg-blue-500/20 hover:bg-blue-500/30 px-2.5 py-1.5 rounded-md transition-colors">Edit</button>
                  </div>
                )}
              </div>



            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
