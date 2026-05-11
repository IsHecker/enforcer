'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Enforcer</span>
            </Link>
            

          </div>
        </div>
      </header>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted/30" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(120, 119, 198, 0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Welcome to Enforcer
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to access your authentication proxy platform
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-lg">
            <LoginForm />
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>


        </div>
      </main>
    </div>
  );
}