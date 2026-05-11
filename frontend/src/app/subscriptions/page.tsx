'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/services/api-service';
import { USER_CONFIG } from '@/config/user-config';
import type { SubscriptionResponse, PlanResponse } from '@/types/backend-api';
import {
  Package,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  CreditCard,
  Download,
  Eye,
  Settings,
  BookOpen,
  Copy,
  TerminalSquare
} from 'lucide-react';

interface Subscription {
  id: string;
  apiServiceId: string; // Add API service ID for navigation
  apiName: string;
  planName: string;
  planType: 'free' | 'pro' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  usage: {
    current: number;
    quota: number;
    resetDate: string;
  };
  nextBilling: string;
  subscriptionDate: string;
  usagePeriod: string; // "Daily", "Weekly", "Monthly", or "Yearly"
}

// Helper function to determine usage period label from reset period
const getUsagePeriodLabel = (resetPeriod: string | null | undefined): string => {
  if (!resetPeriod) return 'Monthly';

  const period = resetPeriod.toLowerCase();
  if (period.includes('day') || period === 'daily') return 'Daily';
  if (period.includes('week') || period === 'weekly') return 'Weekly';
  if (period.includes('month') || period === 'monthly') return 'Monthly';
  if (period.includes('year') || period === 'yearly') return 'Yearly';

  return 'Monthly'; // Default fallback
};

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscriptions from backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.subscriptions.list();

        if (response.success && response.data) {
          // Transform backend subscriptions to match the Subscription interface
          const transformedSubscriptions: Subscription[] = await Promise.all(
            response.data.map(async (sub: SubscriptionResponse) => {
              // Fetch API service details to get the name
              let apiName = 'Unknown API';
              try {
                const apiResponse = await api.apiServices.getById(sub.apiServiceId);
                if (apiResponse.success && apiResponse.data) {
                  apiName = apiResponse.data.name || 'Unknown API';
                }
              } catch (err) {
                console.error('Error fetching API details:', err);
              }

              // Get plan details - either from subscription or fetch separately
              let planDetails: PlanResponse | null = sub.plan;

              if (!planDetails && sub.planId) {
                try {
                  const planResponse = await api.plans.getById(sub.planId);
                  if (planResponse.success && planResponse.data) {
                    planDetails = planResponse.data;
                  }
                } catch (err) {
                  console.error('Error fetching plan details:', err);
                }
              }

              // Determine usage period label
              const usagePeriod = getUsagePeriodLabel(planDetails?.quotaResetPeriod);

              // Fetch real usage for this subscription
              let currentUsage = 0;
              let resetAt = sub.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
              
              try {
                const usageResponse = await api.apiUsages.getSubscriptionApiUsage(sub.id);
                if (usageResponse.success && usageResponse.data) {
                  currentUsage = Math.max(0, (planDetails?.quotaLimit || 0) - usageResponse.data.quotasLeft);
                  resetAt = usageResponse.data.resetAt;
                }
              } catch (err) {
                console.error('Error fetching usage:', err);
              }

              return {
                id: sub.id,
                apiServiceId: sub.apiServiceId, // Store API service ID for navigation
                apiName: apiName,
                planName: planDetails?.name || 'Unknown Plan',
                planType: (planDetails?.type?.toLowerCase() as 'free' | 'pro' | 'enterprise') || 'free',
                price: (planDetails?.priceInCents || 0) / 100, // Convert from cents to dollars
                billingCycle: (planDetails?.billingPeriod?.toLowerCase() as 'monthly' | 'yearly') || 'monthly',
                status: sub.isCanceled ? 'cancelled' : sub.expiresAt && new Date(sub.expiresAt) < new Date() ? 'expired' : 'active',
                usage: {
                  current: currentUsage,
                  quota: planDetails?.quotaLimit || 0,
                  resetDate: resetAt,
                },
                nextBilling: sub.expiresAt || resetAt,
                subscriptionDate: sub.subscribedAt,
                usagePeriod: usagePeriod,
                apiKey: sub.apiKey || 'sk_live_mock123'
              };
            })
          );

          setSubscriptions(transformedSubscriptions);
        } else {
          console.error('Failed to fetch subscriptions:', response.error);
          setError(response.error?.message || 'Failed to load subscriptions');
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (!user) return null;

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + sub.price, 0);

  const totalApiCalls = subscriptions.reduce((total, sub) => total + sub.usage.current, 0);
  const totalQuota = subscriptions.reduce((total, sub) => total + sub.usage.quota, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'pro':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'enterprise':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              My Subscriptions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your API subscriptions, usage, and billing details
            </p>
          </div>

          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {subscriptions.filter(sub => sub.status === 'active').length} Active
          </Badge>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading subscriptions...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="subscriptions" className="space-y-6">
            <TabsList className="bg-secondary/50 w-fit p-1">
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Active Subscriptions</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Billing History</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions" className="space-y-6">
              {/* Overview Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Active Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {subscriptions.filter(sub => sub.status === 'active').length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      of {subscriptions.length} total
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Monthly Spend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      ${totalMonthlySpend.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      per month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Total API Calls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {totalApiCalls.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Usage Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {totalQuota > 0 ? ((totalApiCalls / totalQuota) * 100).toFixed(1) : '0.0'}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      of total quota
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Subscription Details</h2>

                {subscriptions.length === 0 ? (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardContent className="py-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Subscriptions Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't subscribed to any APIs yet. Browse the marketplace to get started.
                      </p>
                      <Button onClick={() => router.push('/marketplace')}>
                        Browse Marketplace
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  subscriptions.map((subscription) => {
                    // Fix NaN% problem by checking if quota is 0
                    const usagePercentage = subscription.usage.quota > 0
                      ? (subscription.usage.current / subscription.usage.quota) * 100
                      : 0;
                    const isNearLimit = usagePercentage > 80;

                    return (
                      <Card key={subscription.id} className="bg-card/50 backdrop-blur-sm border-border/20 hover:border-border/40 transition-all">
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                  <Package className="h-7 w-7 text-primary" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-xl font-bold text-foreground">{subscription.apiName}</h3>
                                    <Badge variant="outline" className={getPlanColor(subscription.planType)}>
                                      {subscription.planName}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-3 w-3 mr-1.5" />
                                    Subscribed since {new Date(subscription.subscriptionDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <Badge variant="outline" className={`${getStatusColor(subscription.status)} px-3 py-1`}>
                                {subscription.status === 'active' && <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
                                {subscription.status === 'cancelled' && <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />}
                                {subscription.status === 'expired' && <Clock className="h-3.5 w-3.5 mr-1.5" />}
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                              </Badge>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Key Metrics Grid */}
                            <div className="grid gap-2 md:grid-cols-3">
                              <div className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-2">
                                <div className="flex items-center space-x-1.5 mb-1">
                                  <div className="p-0.5 rounded-md bg-blue-500/20">
                                    <DollarSign className="h-3 w-3 text-blue-400" />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">Price</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {subscription.price === 0 ? 'Free' : `$${subscription.price}`}
                                </p>
                                {subscription.price > 0 && (
                                  <p className="text-xs text-muted-foreground">per {subscription.billingCycle}</p>
                                )}
                              </div>

                              <div className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-500/10 p-2">
                                <div className="flex items-center space-x-1.5 mb-1">
                                  <div className="p-0.5 rounded-md bg-purple-500/20">
                                    <Calendar className="h-3 w-3 text-purple-400" />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">Next Billing</span>
                                </div>
                                <p className="text-sm font-bold text-foreground">
                                  {new Date(subscription.nextBilling).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(subscription.nextBilling).getFullYear()}
                                </p>
                              </div>

                              <div className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-green-500/5 to-green-500/10 p-2">
                                <div className="flex items-center space-x-1.5 mb-1">
                                  <div className="p-0.5 rounded-md bg-green-500/20">
                                    <Clock className="h-3 w-3 text-green-400" />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">Quota Reset</span>
                                </div>
                                <p className="text-sm font-bold text-foreground">
                                  {new Date(subscription.usage.resetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(subscription.usage.resetDate).getFullYear()}
                                </p>
                              </div>
                            </div>

                            {/* Usage Section - Dynamic Period Label */}
                            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1.5">
                                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-semibold text-foreground">{subscription.usagePeriod} Usage</span>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {subscription.usage.current.toLocaleString()} / {subscription.usage.quota.toLocaleString()}
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                <Progress
                                  value={usagePercentage}
                                  className={`h-2 ${isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                                />

                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-medium ${isNearLimit ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {usagePercentage.toFixed(1)}% used
                                  </span>
                                  <span className="text-muted-foreground">
                                    {(subscription.usage.quota - subscription.usage.current).toLocaleString()} calls remaining
                                  </span>
                                </div>
                              </div>

                              {isNearLimit && (
                                <div className="flex items-start space-x-1.5 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/30">
                                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">High usage detected</p>
                                    <p className="text-xs text-yellow-400/80">
                                      You're approaching your quota limit. Consider upgrading to avoid service interruption.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-border/40">
                              <Button
                                variant="secondary"
                                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                onClick={() => {
                                  navigator.clipboard.writeText((subscription as any).apiKey);
                                  toast.success('API Key copied to clipboard');
                                }}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Key
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-border/40 hover:bg-white/5"
                                onClick={() => router.push(`/api-details/${subscription.apiServiceId}?source=subscriptions`)}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Docs
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-border/40 hover:bg-white/5"
                                onClick={() => router.push(`/api-details/${subscription.apiServiceId}?source=subscriptions`)}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }))}
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-xl">Billing History</CardTitle>
                  <CardDescription>View your past invoices and billing statements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-border/40">
                        <TableCell className="font-medium text-foreground">INV-2026-001</TableCell>
                        <TableCell className="text-muted-foreground">Jan 1, 2026</TableCell>
                        <TableCell className="text-foreground">${totalMonthlySpend.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 font-normal">Paid</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-border/40">
                        <TableCell className="font-medium text-foreground">INV-2025-012</TableCell>
                        <TableCell className="text-muted-foreground">Dec 1, 2025</TableCell>
                        <TableCell className="text-foreground">${totalMonthlySpend.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 font-normal">Paid</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Current Billing Cycle
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Total projected cost for all active subscriptions
                      </p>
                      <div className="text-2xl font-bold text-foreground mt-2">
                        ${totalMonthlySpend.toFixed(2)} / month
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/wallet')}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Methods
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
