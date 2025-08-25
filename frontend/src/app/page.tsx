'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Globe, 
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'JWT-based authentication with role-based access control',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Monitor API usage, performance, and revenue in real-time',
  },
  {
    icon: Zap,
    title: 'Quota Management',
    description: 'Flexible quotas and rate limiting for different plan tiers',
  },
  {
    icon: Globe,
    title: 'API Marketplace',
    description: 'Browse and subscribe to APIs from various creators',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: ['1,000 API calls/month', '5 API subscriptions', 'Basic analytics', 'Community support'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: ['50,000 API calls/month', 'Unlimited subscriptions', 'Advanced analytics', 'Priority support', 'Custom rate limits'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations',
    features: ['Unlimited API calls', 'White-label solution', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
    popular: false,
  },
];

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">ProxyAPI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
                ✨ Authentication Proxy Platform
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Build, Manage & Monetize
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Your API Products
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete authentication proxy with quotas, rate limiting, and monetization. 
              Perfect for creators building API businesses and developers consuming APIs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                onClick={() => router.push('/auth/signup')}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
                onClick={() => router.push('/auth/login')}
              >
                Explore Platform
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                From authentication to analytics, we provide all the tools you need to build and scale your API business.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-card/20 backdrop-blur-sm border-border/20 hover:bg-card/30 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Choose the plan that fits your needs. Upgrade or downgrade at any time.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative bg-card/20 backdrop-blur-sm border-border/20 hover:bg-card/30 transition-colors ${
                    plan.popular ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-white">
                      {plan.price}
                      <span className="text-base font-normal text-gray-400">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-300">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3 text-gray-300">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                      onClick={() => router.push('/auth/signup')}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to start building?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers and creators already using ProxyAPI to build and monetize their APIs.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg"
              onClick={() => router.push('/auth/signup')}
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-white">ProxyAPI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ProxyAPI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}