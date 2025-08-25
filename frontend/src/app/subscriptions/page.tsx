'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Package,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  CreditCard,
  Download,
} from 'lucide-react';

interface Subscription {
  id: string;
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
  features: string[];
  subscriptionDate: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    apiName: 'Weather API',
    planName: 'Pro Plan',
    planType: 'pro',
    price: 19.99,
    billingCycle: 'monthly',
    status: 'active',
    usage: {
      current: 1850,
      quota: 10000,
      resetDate: '2024-02-01T00:00:00Z',
    },
    nextBilling: '2024-02-15T00:00:00Z',
    features: ['Unlimited forecasts', 'Historical data', 'Premium support'],
    subscriptionDate: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    apiName: 'Crypto API',
    planName: 'Free Plan',
    planType: 'free',
    price: 0,
    billingCycle: 'monthly',
    status: 'active',
    usage: {
      current: 980,
      quota: 1000,
      resetDate: '2024-02-01T00:00:00Z',
    },
    nextBilling: '2024-02-01T00:00:00Z',
    features: ['Basic crypto prices', '1000 calls/month', 'Community support'],
    subscriptionDate: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    apiName: 'News API',
    planName: 'Pro Plan',
    planType: 'pro',
    price: 29.99,
    billingCycle: 'monthly',
    status: 'active',
    usage: {
      current: 450,
      quota: 25000,
      resetDate: '2024-02-01T00:00:00Z',
    },
    nextBilling: '2024-02-10T00:00:00Z',
    features: ['Global news sources', 'Sentiment analysis', 'Real-time updates'],
    subscriptionDate: '2024-01-10T00:00:00Z',
  },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const totalMonthlySpend = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + sub.price, 0);

  const totalApiCalls = mockSubscriptions.reduce((total, sub) => total + sub.usage.current, 0);
  const totalQuota = mockSubscriptions.reduce((total, sub) => total + sub.usage.quota, 0);

  const handleUpgrade = (subscriptionId: string) => {
    toast.success('Redirecting to upgrade options...');
    console.log('Upgrade subscription:', subscriptionId);
  };

  const handleCancel = (subscriptionId: string, apiName: string) => {
    toast.success(`${apiName} subscription cancelled`);
    console.log('Cancel subscription:', subscriptionId);
  };

  const handleManagePlan = (subscriptionId: string) => {
    toast.success('Opening plan management...');
    console.log('Manage plan:', subscriptionId);
  };

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
    <RoleGuard allowedRoles={['consumer']}>
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
              {mockSubscriptions.filter(sub => sub.status === 'active').length} Active
            </Badge>
          </div>

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
                  {mockSubscriptions.filter(sub => sub.status === 'active').length}
                </div>
                <p className="text-sm text-muted-foreground">
                  of {mockSubscriptions.length} total
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
                  <Zap className="h-4 w-4 mr-2" />
                  Usage Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {((totalApiCalls / totalQuota) * 100).toFixed(1)}%
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

            {mockSubscriptions.map((subscription) => {
              const usagePercentage = (subscription.usage.current / subscription.usage.quota) * 100;
              const isNearLimit = usagePercentage > 80;

              return (
                <Card key={subscription.id} className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground flex items-center space-x-2">
                            <span>{subscription.apiName}</span>
                            <Badge variant="outline" className={getPlanColor(subscription.planType)}>
                              {subscription.planName}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Subscribed since {new Date(subscription.subscriptionDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(subscription.status)}>
                          {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {subscription.status === 'cancelled' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {subscription.status === 'expired' && <Clock className="h-3 w-3 mr-1" />}
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManagePlan(subscription.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Plan Details */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Price</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {subscription.price === 0 ? 'Free' : `$${subscription.price}/${subscription.billingCycle}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Next billing</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {new Date(subscription.nextBilling).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Quota reset</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {new Date(subscription.usage.resetDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Usage Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Monthly Usage</span>
                        <span className="text-sm text-muted-foreground">
                          {subscription.usage.current.toLocaleString()} / {subscription.usage.quota.toLocaleString()} calls
                        </span>
                      </div>

                      <Progress
                        value={usagePercentage}
                        className={`h-2 ${isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                      />

                      <div className="flex items-center justify-between text-sm">
                        <span className={`${isNearLimit ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                          {usagePercentage.toFixed(1)}% used
                        </span>
                        <span className="text-muted-foreground">
                          {(subscription.usage.quota - subscription.usage.current).toLocaleString()} remaining
                        </span>
                      </div>

                      {isNearLimit && (
                        <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                          <AlertTriangle className="h-4 w-4" />
                          <div>
                            <span className="font-medium">High usage detected.</span>
                            <span className="ml-1">Consider upgrading to avoid hitting quota limits.</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Plan Features */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Plan Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {subscription.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/api-details/${subscription.id}?source=subscriptions`}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/usage?api=${subscription.id}`}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {subscription.planType !== 'enterprise' && subscription.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpgrade(subscription.id)}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Upgrade
                          </Button>
                        )}

                        {subscription.status === 'active' && subscription.price > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(subscription.id, subscription.apiName)}
                            className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Billing Summary */}
          <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Monthly Billing Summary
                  </h3>
                  <p className="text-muted-foreground">
                    Total monthly cost across all active subscriptions
                  </p>
                  <div className="text-2xl font-bold text-foreground mt-2">
                    ${totalMonthlySpend.toFixed(2)} / month
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}