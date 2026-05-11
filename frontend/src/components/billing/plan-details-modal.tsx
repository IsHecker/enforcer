'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Zap,
  Target,
  DollarSign,
  Activity,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

interface ApiSubscription {
  id: string;
  apiName: string;
  planName: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  quota: number;
  rateLimit: string;
  renewalDate: string;
  usage: number;
  status: 'active' | 'cancelled' | 'expired';
  overageCharges: number;
  nextBillingAmount: number;
  planType?: string;
  overageRules?: {
    rate: number;
    freeAllowance: number;
    description: string;
  };
  features?: string[];
  endpoints?: string[];
}

interface PlanDetailsModalProps {
  subscription: ApiSubscription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanDetailsModal({ subscription, isOpen, onClose }: PlanDetailsModalProps) {
  if (!subscription) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const usagePercentage = (subscription.usage / subscription.quota) * 100;
  const isOverQuota = subscription.usage > subscription.quota;

  const getUsageColor = (usage: number, quota: number): string => {
    const percentage = (usage / quota) * 100;
    if (percentage > 90) return 'text-red-400';
    if (percentage > 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getUsageBarColor = (usage: number, quota: number): string => {
    const percentage = (usage / quota) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold">{subscription.apiName}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {subscription.planName}
                </Badge>
                <Badge variant="outline" className={getStatusBadge(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed information about your API subscription and usage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Plan Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Plan Name</div>
                  <div className="text-xl font-bold">{subscription.planName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Plan Type</div>
                  <div className="text-lg font-semibold">
                    {subscription.planType || 'Standard'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(subscription.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{subscription.billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Billing Cycle</div>
                  <div className="text-lg font-semibold">
                    {subscription.billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Quota</div>
                  <div className="text-lg font-semibold">
                    {subscription.quota.toLocaleString()} calls
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rate Limit</div>
                  <div className="text-lg font-semibold">
                    {subscription.rateLimit}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">Renewal Date</div>
                  <div className="text-lg font-semibold">
                    {formatDate(subscription.renewalDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Usage Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Calls This Month</span>
                  <span className={`text-sm font-medium ${getUsageColor(subscription.usage, subscription.quota)}`}>
                    {subscription.usage.toLocaleString()} / {subscription.quota.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${getUsageBarColor(subscription.usage, subscription.quota)}`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={getUsageColor(subscription.usage, subscription.quota)}>
                      {usagePercentage.toFixed(1)}% used
                    </span>
                    <span className="text-muted-foreground">
                      {subscription.quota - subscription.usage} calls remaining
                    </span>
                  </div>
                </div>
              </div>

              {isOverQuota && (
                <div className="flex items-center space-x-2 text-sm text-orange-400 bg-orange-500/10 p-3 rounded border border-orange-500/20">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    You've exceeded your quota by {(subscription.usage - subscription.quota).toLocaleString()} calls
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overage Rules */}
          {subscription.overageRules && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Overage Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overage Rate</span>
                    <span className="font-medium">{formatCurrency(subscription.overageRules.rate)} per 1,000 calls</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Free Allowance</span>
                    <span className="font-medium">{subscription.overageRules.freeAllowance.toLocaleString()} calls</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {subscription.overageRules.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Billing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Base Subscription</span>
                  <span className="font-medium">{formatCurrency(subscription.price)}</span>
                </div>
                
                {subscription.overageCharges > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overage Charges</span>
                    <span className="font-medium text-orange-400">
                      +{formatCurrency(subscription.overageCharges)}
                    </span>
                  </div>
                )}

                <Separator />
                
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Next Bill Total</span>
                  <span>{formatCurrency(subscription.nextBillingAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}