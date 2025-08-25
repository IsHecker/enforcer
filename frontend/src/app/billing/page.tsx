'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InvoiceTable } from '@/components/billing/invoice-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Settings,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();

  if (!user) return null;

  const mockBillingData = {
    currentPlan: {
      name: user.plan === 'pro' ? 'Pro Plan' : 'Free Tier',
      price: user.plan === 'pro' ? 29.99 : 0,
      billingPeriod: 'monthly',
      nextBilling: '2024-02-15',
    },
    currentUsage: {
      apiCalls: 3420,
      quota: user.plan === 'pro' ? 50000 : 1000,
      overage: 0,
      cost: user.plan === 'pro' ? 29.99 : 0,
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
    },
  };

  const usagePercentage = (mockBillingData.currentUsage.apiCalls / mockBillingData.currentUsage.quota) * 100;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={user.plan === 'pro'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-green-500/10 text-green-400 border-green-500/30'
              }
            >
              {mockBillingData.currentPlan.name}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Plan */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Current Plan</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your active subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">
                  {mockBillingData.currentPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">
                  ${mockBillingData.currentPlan.price}{mockBillingData.currentPlan.price > 0 ? '/mo' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next billing</span>
                <span className="font-medium text-foreground">
                  {new Date(mockBillingData.currentPlan.nextBilling).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  {user.plan === 'pro' ? 'Manage Plan' : 'Upgrade'}
                </Button>
                {user.plan === 'pro' && (
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Usage */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Current Usage</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                This billing cycle usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Calls</span>
                <span className="font-medium text-foreground">
                  {mockBillingData.currentUsage.apiCalls.toLocaleString()} / {mockBillingData.currentUsage.quota.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{usagePercentage.toFixed(1)}% used</span>
                <span className="text-muted-foreground">
                  {mockBillingData.currentUsage.quota - mockBillingData.currentUsage.apiCalls} remaining
                </span>
              </div>
              {mockBillingData.currentUsage.overage > 0 && (
                <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Overage: {mockBillingData.currentUsage.overage} calls</span>
                </div>
              )}
              <div className="flex items-center justify-between font-medium pt-2 border-t border-border/50">
                <span className="text-foreground">Current Bill</span>
                <span className="text-foreground">
                  ${mockBillingData.currentUsage.cost.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your default payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.plan === 'pro' ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        •••• •••• •••• {mockBillingData.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {mockBillingData.paymentMethod.expiryMonth}/{mockBillingData.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Update Card
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    No payment method required for free plan
                  </p>
                  <Button size="sm">
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Common billing and subscription tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Usage History
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Billing Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <InvoiceTable />
      </div>
    </DashboardLayout>
  );
}