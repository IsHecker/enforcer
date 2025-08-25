'use client';

import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join ProxyAPI
          </h1>
          <p className="text-gray-400">
            Create your account and start building
          </p>
        </div>

        <SignupForm />

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}