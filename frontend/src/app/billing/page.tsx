'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

import { PlanDetailsModal } from '@/components/billing/plan-details-modal';
import { ChangePlanModal } from '@/components/billing/change-plan-modal';
import { CancelSubscriptionModal } from '@/components/billing/cancel-subscription-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { 
  CreditCard, 
  DollarSign,
  Calendar,
  Download,
  Settings,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle,
  ExternalLink,
  Eye,
  X,
  ArrowUpDown,
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
  allowCancel: boolean;
  allowUpgrade: boolean;
  planType?: string;
  overageRules?: {
    rate: number;
    freeAllowance: number;
    description: string;
  };
  features?: string[];
  endpoints?: string[];
}

interface InvoiceHistory {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl?: string;
}

const mockSubscriptions: ApiSubscription[] = [
  {
    id: '1',
    apiName: 'Weather API',
    planName: 'Pro Plan',
    price: 49,
    billingPeriod: 'monthly',
    quota: 10000,
    rateLimit: '100 requests/minute',
    renewalDate: '2024-02-15',
    usage: 7200,
    status: 'active',
    overageCharges: 0,
    nextBillingAmount: 49,
    allowCancel: true,
    allowUpgrade: true,
    planType: 'Professional',
    overageRules: {
      rate: 0.05,
      freeAllowance: 1000,
      description: 'First 1,000 overage calls are free, then $0.05 per 1,000 additional calls.'
    },
    features: [
      'Full weather data access',
      'Historical weather data',
      'Email support',
      'Analytics dashboard',
      'API rate limiting'
    ],
    endpoints: [
      '/weather/current',
      '/weather/forecast',
      '/weather/historical',
      '/weather/alerts'
    ]
  },
  {
    id: '2',
    apiName: 'Crypto Prices API',
    planName: 'Enterprise Plan',
    price: 149,
    billingPeriod: 'monthly',
    quota: 50000,
    rateLimit: '500 requests/minute',
    renewalDate: '2024-02-20',
    usage: 52400,
    status: 'active',
    overageCharges: 48.00,
    nextBillingAmount: 197,
    allowCancel: true,
    allowUpgrade: false,
    planType: 'Enterprise',
    overageRules: {
      rate: 0.02,
      freeAllowance: 5000,
      description: 'First 5,000 overage calls are free, then $0.02 per 1,000 additional calls.'
    },
    features: [
      'Real-time crypto prices',
      'Historical price data',
      'Market analysis tools',
      '24/7 dedicated support',
      'Advanced analytics',
      'Custom webhooks',
      'SLA guarantee'
    ],
    endpoints: [
      '/crypto/prices',
      '/crypto/historical',
      '/crypto/market-cap',
      '/crypto/trading-volume',
      '/crypto/exchanges',
      '/crypto/news'
    ]
  },
  {
    id: '3',
    apiName: 'News Aggregator API',
    planName: 'Pro Plan',
    price: 29,
    billingPeriod: 'monthly',
    quota: 5000,
    rateLimit: '50 requests/minute',
    renewalDate: '2024-02-25',
    usage: 4200,
    status: 'active',
    overageCharges: 0,
    nextBillingAmount: 29,
    allowCancel: true,
    allowUpgrade: true,
    planType: 'Professional',
    overageRules: {
      rate: 0.10,
      freeAllowance: 500,
      description: 'First 500 overage calls are free, then $0.10 per 1,000 additional calls.'
    },
    features: [
      'Global news sources',
      'Category filtering',
      'Search functionality',
      'Email support',
      'Basic analytics'
    ],
    endpoints: [
      '/news/headlines',
      '/news/search',
      '/news/categories',
      '/news/sources'
    ]
  },
];

const mockInvoiceHistory: InvoiceHistory[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-15',
    amount: 49.00,
    status: 'paid',
    description: 'Monthly subscription - Weather API Pro Plan',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    date: '2024-01-20',
    amount: 197.00,
    status: 'paid',
    description: 'Monthly subscription + overages - Crypto Prices API Enterprise',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    date: '2024-01-25',
    amount: 29.00,
    status: 'paid',
    description: 'Monthly subscription - News Aggregator API Pro Plan',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    date: '2024-02-15',
    amount: 49.00,
    status: 'pending',
    description: 'Monthly subscription - Weather API Pro Plan',
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [selectedSubscription, setSelectedSubscription] = useState<ApiSubscription | null>(null);
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState<boolean>(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState<boolean>(false);
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] = useState<boolean>(false);

  if (!user) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const handleViewPlanDetails = (subscription: ApiSubscription): void => {
    setSelectedSubscription(subscription);
    setIsPlanDetailsModalOpen(true);
  };

  const handleChangePlan = (subscription: ApiSubscription): void => {
    setSelectedSubscription(subscription);
    setIsChangePlanModalOpen(true);
  };

  const handleCancelSubscription = (subscription: ApiSubscription): void => {
    setSelectedSubscription(subscription);
    setIsCancelSubscriptionModalOpen(true);
  };

  const handlePlanChange = (planId: string, subscription: ApiSubscription): void => {
    console.log(`Changing plan to ${planId} for subscription: ${subscription.id}`);
    // TODO: Implement actual plan change logic
    // This would typically make an API call to update the subscription
  };

  const handleSubscriptionCancel = (subscriptionId: string, cancelType: 'end-of-cycle' | 'immediately'): void => {
    console.log(`Cancelling subscription ${subscriptionId} with type: ${cancelType}`);
    // TODO: Implement actual cancellation logic
    // This would typically make an API call to cancel the subscription
  };

  const handleDownloadInvoice = (invoiceNumber: string): void => {
    console.log(`Download invoice: ${invoiceNumber}`);
    // TODO: Implement PDF download
  };

  return (
    <DashboardLayout>
        <div className="flex-1 space-y-8 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Billing & Subscriptions
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your API subscriptions and billing information
              </p>
            </div>
          </div>

          {/* Subscribed Products List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Subscribed Products</h2>
            
            <div className="grid gap-4">
              {mockSubscriptions.map((subscription) => {
                const usagePercentage = (subscription.usage / subscription.quota) * 100;
                const isOverQuota = subscription.usage > subscription.quota;
                
                return (
                  <Card key={subscription.id} className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
                            <Zap className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{subscription.apiName}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                {subscription.planName}
                              </Badge>
                              <Badge variant="outline" className={getStatusBadge(subscription.status)}>
                                {subscription.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Renews</div>
                          <div className="font-semibold">{formatDate(subscription.renewalDate)}</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Usage Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Quota Usage</span>
                          <span className={`text-sm font-medium ${getUsageColor(subscription.usage, subscription.quota)}`}>
                            {subscription.usage.toLocaleString()} / {subscription.quota.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getUsageBarColor(subscription.usage, subscription.quota)}`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{usagePercentage.toFixed(1)}% used</span>
                          <span>{subscription.quota - subscription.usage} calls remaining</span>
                        </div>
                      </div>

                      {/* Overage Charges */}
                      {subscription.overageCharges > 0 && (
                        <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                            <span className="text-sm font-medium text-orange-400">Overage Charges</span>
                          </div>
                          <span className="text-lg font-bold text-orange-400">
                            +{formatCurrency(subscription.overageCharges)}
                          </span>
                        </div>
                      )}

                      <Separator />

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Total next bill: <span className="font-bold text-foreground">{formatCurrency(subscription.nextBillingAmount)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPlanDetails(subscription)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Plan Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleChangePlan(subscription)}
                            disabled={!subscription.allowUpgrade}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Change Plan
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelSubscription(subscription)}
                            disabled={!subscription.allowCancel}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Billing History */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Billing History</span>
                  </CardTitle>
                  <CardDescription>
                    View and download your payment history
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="text-muted-foreground">Invoice Date</TableHead>
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Payment Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoiceHistory.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-foreground">
                          {formatDate(invoice.date)}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(invoice.status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(invoice.status)}
                              <span className="capitalize">{invoice.status}</span>
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Details Modal */}
        <PlanDetailsModal 
          subscription={selectedSubscription}
          isOpen={isPlanDetailsModalOpen}
          onClose={() => setIsPlanDetailsModalOpen(false)}
        />

        {/* Change Plan Modal */}
        <ChangePlanModal 
          subscription={selectedSubscription}
          isOpen={isChangePlanModalOpen}
          onClose={() => setIsChangePlanModalOpen(false)}
          onPlanChange={handlePlanChange}
        />

        {/* Cancel Subscription Modal */}
        <CancelSubscriptionModal 
          subscription={selectedSubscription}
          isOpen={isCancelSubscriptionModalOpen}
          onClose={() => setIsCancelSubscriptionModalOpen(false)}
          onCancel={handleSubscriptionCancel}
        />
    </DashboardLayout>
  );
}