'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { sdk } from '@farcaster/miniapp-sdk'
import DemoDisclaimerPopup from '@/components/demo-disclaimer-popup';
import {
  Zap,
  Shield,
  TrendingUp,
  Globe,
  ArrowRight,
  Users,
  BarChart3,
  Key,
  DollarSign,
  CheckCircle,
  Star,
  Activity,
} from 'lucide-react';
import { useAddMiniApp } from "@/hooks/useAddMiniApp";

const features = [
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'Enterprise-grade JWT authentication with role-based access control and API key management',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Monitor API performance, usage patterns, and revenue metrics with live dashboards',
    color: 'bg-green-500/10 border-green-500/20 text-green-400',
  },
  {
    icon: Zap,
    title: 'Smart Rate Limiting',
    description: 'Flexible quotas and intelligent rate limiting with plan-based access controls',
    color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  },
  {
    icon: Globe,
    title: 'API Marketplace',
    description: 'Discover and monetize APIs through our comprehensive marketplace ecosystem',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  {
    icon: DollarSign,
    title: 'Monetization Engine',
    description: 'Built-in billing, subscription management, and revenue optimization tools',
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights into API usage, performance metrics, and business intelligence',
    color: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  },
];

const stats = [
  { label: 'API Products', value: '10,000+', icon: Package, growth: '+23%' },
  { label: 'Active Developers', value: '50,000+', icon: Users, growth: '+18%' },
  { label: 'API Calls/Month', value: '1.2B+', icon: Activity, growth: '+45%' },
  { label: 'Revenue Processed', value: '$10M+', icon: DollarSign, growth: '+67%' },
];

function Package({ className }: { className?: string }) {
  return <Globe className={className} />;
}

export default function HomePage() {
  const { addMiniApp } = useAddMiniApp();
  useEffect(() => {
    const tryAddMiniApp = async () => {
      try {
        await addMiniApp()
      } catch (error) {
        console.error('Failed to add mini app:', error)
      }

    }



    tryAddMiniApp()
  }, [addMiniApp])
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))

        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(void 0)
            } else {
              window.addEventListener('load', () => resolve(void 0), { once: true })
            }
          })
        }

        await sdk.actions.ready()
        console.log('Farcaster SDK initialized successfully - app fully loaded')
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error)
        setTimeout(async () => {
          try {
            await sdk.actions.ready()
            console.log('Farcaster SDK initialized on retry')
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError)
          }
        }, 1000)
      }
    }

    initializeFarcaster()
  }, [sdk])

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
    <div className="min-h-screen bg-background">
      {/* Demo Disclaimer Popup */}
      <DemoDisclaimerPopup />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Enforcer</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="text-foreground hover:text-foreground hover:bg-accent"
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">


            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Build, Manage & Monetize
              <br />
              <span className="text-primary relative">
                Your API Products
                <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-lg"></div>
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete authentication proxy platform with quotas, rate limiting, and advanced monetization.
              Perfect for creators building API businesses and developers consuming APIs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 h-12"
                onClick={() => router.push('/auth/signup')}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3 h-12"
                onClick={() => router.push('/auth/login')}
              >
                Explore Platform
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                            {stat.growth}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From authentication to analytics, we provide all the tools you need to build and scale your API business.
            </p>
          </div>

          <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Trusted by 50,000+ developers worldwide
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join thousands of creators and developers building successful API businesses with our platform
              </p>
              <div className="flex items-center justify-center space-x-8 text-muted-foreground">
                <div className="text-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 inline mr-2" />
                  99.9% Uptime
                </div>
                <div className="text-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 inline mr-2" />
                  24/7 Support
                </div>
                <div className="text-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 inline mr-2" />
                  Enterprise Ready
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-primary/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Ready to start building?
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of developers and creators already using Enforcer to build and monetize their APIs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg h-14"
              onClick={() => router.push('/auth/signup')}
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-sm text-muted-foreground">Setup Fee</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-foreground">5min</div>
              <div className="text-sm text-muted-foreground">Quick Setup</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-foreground">Free</div>
              <div className="text-sm text-muted-foreground">Start Building</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Enforcer</span>
            </div>
            <p className="text-muted-foreground text-center max-w-md">
              The complete API management platform for modern developers and businesses.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Enforcer. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}