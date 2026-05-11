'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ViewSubscribersModal } from '@/components/revenue/view-subscribers-modal';
import { ViewPlansModal } from '@/components/revenue/view-plans-modal';
import { useAuth } from '@/contexts/auth-context';
import { 
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Download,
  Calendar,
  ArrowUpRight,
  Banknote,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Settings,
} from 'lucide-react';

// Enhanced interfaces for the restructured dashboard
interface SummaryData {
  totalEarningsToDate: number;
  currentMonthEarnings: number;
  pendingPayouts: number;
}

interface ProductRevenue {
  id: string;
  name: string;
  totalActiveSubscribers: number;
  currentMonthRevenue: number;
  allTimeRevenue: number;
  averageRevenuePerSubscriber: number;
  subscribers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    monthlyRevenue: number;
    joinedDate: string;
    renewalDate: string;
    usage: number;
    quota: number;
    status: 'active' | 'cancelled' | 'expired';
  }>;
  plans: Array<{
    id: string;
    name: string;
    type: 'free' | 'basic' | 'pro' | 'enterprise';
    price: number;
    billingCycle: 'monthly' | 'yearly';
    quotaLimit: number;
    rateLimit: number;
    subscribers: number;
    revenue: number;
    features: Array<{
      name: string;
      included: boolean;
    }>;
    popular?: boolean;
    description: string;
  }>;
}

interface PayoutHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  description: string;
  transactionId: string;
}

interface TransactionHistoryItem {
  id: string;
  consumerName: string;
  consumerId: string;
  product: string;
  planName: string;
  amountPaid: number;
  billingCycleDate: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

// Mock data following the new structure
const mockSummaryData: SummaryData = {
  totalEarningsToDate: 47250,
  currentMonthEarnings: 12920,
  pendingPayouts: 8640,
};

const mockProductsRevenue: ProductRevenue[] = [
  {
    id: '1',
    name: 'Weather API',
    totalActiveSubscribers: 142,
    currentMonthRevenue: 6400,
    allTimeRevenue: 28400,
    averageRevenuePerSubscriber: 45.07,
    subscribers: [
      { id: '1', name: 'John Smith', email: 'john@techcorp.com', plan: 'Pro Plan', monthlyRevenue: 49, joinedDate: '2023-08-15', renewalDate: '2024-02-15', usage: 8200, quota: 10000, status: 'active' },
      { id: '2', name: 'Mike Chen', email: 'mike@devstudio.io', plan: 'Pro Plan', monthlyRevenue: 49, joinedDate: '2023-09-10', renewalDate: '2024-02-10', usage: 9800, quota: 10000, status: 'active' },
      { id: '3', name: 'DataCorp Inc.', email: 'admin@datacorp.com', plan: 'Enterprise', monthlyRevenue: 299, joinedDate: '2023-06-20', renewalDate: '2024-02-20', usage: 45000, quota: 100000, status: 'active' },
    ],
    plans: [
      {
        id: '1', name: 'Free Plan', type: 'free', price: 0, billingCycle: 'monthly', quotaLimit: 1000, rateLimit: 10, subscribers: 68, revenue: 0,
        description: 'Perfect for testing and small projects',
        features: [
          { name: '1,000 API calls/month', included: true },
          { name: 'Basic rate limiting', included: true },
          { name: 'Community support', included: true },
          { name: 'Priority support', included: false },
          { name: 'Advanced analytics', included: false },
        ]
      },
      {
        id: '2', name: 'Pro Plan', type: 'pro', price: 49, billingCycle: 'monthly', quotaLimit: 10000, rateLimit: 100, subscribers: 52, revenue: 2548, popular: true,
        description: 'Great for growing businesses and applications',
        features: [
          { name: '10,000 API calls/month', included: true },
          { name: 'Enhanced rate limiting', included: true },
          { name: 'Priority email support', included: true },
          { name: 'Basic analytics dashboard', included: true },
          { name: 'Custom integrations', included: false },
        ]
      },
      {
        id: '3', name: 'Enterprise Plan', type: 'enterprise', price: 299, billingCycle: 'monthly', quotaLimit: 100000, rateLimit: 1000, subscribers: 22, revenue: 6578,
        description: 'For large-scale applications with custom needs',
        features: [
          { name: '100,000+ API calls/month', included: true },
          { name: 'Unlimited rate limits', included: true },
          { name: '24/7 phone & chat support', included: true },
          { name: 'Advanced analytics & reporting', included: true },
          { name: 'Custom integrations & SLA', included: true },
        ]
      },
    ],
  },
  {
    id: '2',
    name: 'Crypto Prices API',
    totalActiveSubscribers: 89,
    currentMonthRevenue: 4950,
    allTimeRevenue: 18950,
    averageRevenuePerSubscriber: 55.62,
    subscribers: [
      { id: '4', name: 'Sarah Johnson', email: 'sarah@startup.co', plan: 'Enterprise', monthlyRevenue: 149, joinedDate: '2023-07-25', renewalDate: '2024-02-25', usage: 45000, quota: 50000, status: 'active' },
      { id: '5', name: 'Alex Wilson', email: 'alex@ecom.com', plan: 'Pro Plan', monthlyRevenue: 79, joinedDate: '2023-10-18', renewalDate: '2024-02-18', usage: 7500, quota: 15000, status: 'cancelled' },
      { id: '6', name: 'CryptoTrader Pro', email: 'info@cryptotrader.com', plan: 'Enterprise', monthlyRevenue: 199, joinedDate: '2023-05-12', renewalDate: '2024-02-12', usage: 78000, quota: 100000, status: 'active' },
    ],
    plans: [
      {
        id: '4', name: 'Free Plan', type: 'free', price: 0, billingCycle: 'monthly', quotaLimit: 500, rateLimit: 5, subscribers: 34, revenue: 0,
        description: 'Basic crypto price data for personal use',
        features: [
          { name: '500 API calls/month', included: true },
          { name: 'Real-time price data', included: true },
          { name: 'Top 100 cryptocurrencies', included: true },
          { name: 'Historical data', included: false },
          { name: 'Portfolio tracking', included: false },
        ]
      },
      {
        id: '5', name: 'Pro Plan', type: 'pro', price: 79, billingCycle: 'monthly', quotaLimit: 15000, rateLimit: 150, subscribers: 38, revenue: 3002, popular: true,
        description: 'Advanced features for serious crypto traders',
        features: [
          { name: '15,000 API calls/month', included: true },
          { name: 'Real-time & historical data', included: true },
          { name: 'All cryptocurrencies', included: true },
          { name: 'Portfolio tracking API', included: true },
          { name: 'WebSocket connections', included: true },
        ]
      },
      {
        id: '6', name: 'Enterprise Plan', type: 'enterprise', price: 199, billingCycle: 'monthly', quotaLimit: 100000, rateLimit: 2000, subscribers: 17, revenue: 3383,
        description: 'Enterprise-grade crypto data infrastructure',
        features: [
          { name: 'Unlimited API calls', included: true },
          { name: 'Ultra-fast WebSocket streams', included: true },
          { name: 'Custom data feeds', included: true },
          { name: 'Dedicated support', included: true },
          { name: 'White-label solutions', included: true },
        ]
      },
    ],
  },
  {
    id: '3',
    name: 'News Aggregator API',
    totalActiveSubscribers: 53,
    currentMonthRevenue: 1570,
    allTimeRevenue: 8900,
    averageRevenuePerSubscriber: 29.62,
    subscribers: [
      { id: '7', name: 'Lisa Brown', email: 'lisa@agency.com', plan: 'Pro Plan', monthlyRevenue: 29, joinedDate: '2023-11-25', renewalDate: '2024-02-25', usage: 4200, quota: 5000, status: 'active' },
      { id: '8', name: 'NewsHub Media', email: 'tech@newshub.com', plan: 'Enterprise', monthlyRevenue: 149, joinedDate: '2023-09-05', renewalDate: '2024-02-05', usage: 28000, quota: 50000, status: 'active' },
      { id: '9', name: 'StartupBlog', email: 'editor@startupblog.io', plan: 'Pro Plan', monthlyRevenue: 29, joinedDate: '2023-12-01', renewalDate: '2024-03-01', usage: 3800, quota: 5000, status: 'active' },
    ],
    plans: [
      {
        id: '7', name: 'Free Plan', type: 'free', price: 0, billingCycle: 'monthly', quotaLimit: 200, rateLimit: 2, subscribers: 28, revenue: 0,
        description: 'Basic news aggregation for small projects',
        features: [
          { name: '200 API calls/month', included: true },
          { name: 'Top news sources', included: true },
          { name: 'Basic categorization', included: true },
          { name: 'Sentiment analysis', included: false },
          { name: 'Custom sources', included: false },
        ]
      },
      {
        id: '8', name: 'Pro Plan', type: 'pro', price: 29, billingCycle: 'monthly', quotaLimit: 5000, rateLimit: 50, subscribers: 19, revenue: 551, popular: true,
        description: 'Enhanced news data with analysis features',
        features: [
          { name: '5,000 API calls/month', included: true },
          { name: 'Premium news sources', included: true },
          { name: 'Advanced categorization', included: true },
          { name: 'Sentiment analysis', included: true },
          { name: 'Custom keyword alerts', included: true },
        ]
      },
      {
        id: '9', name: 'Enterprise Plan', type: 'enterprise', price: 149, billingCycle: 'monthly', quotaLimit: 50000, rateLimit: 500, subscribers: 6, revenue: 894,
        description: 'Complete news intelligence platform',
        features: [
          { name: '50,000+ API calls/month', included: true },
          { name: 'All global news sources', included: true },
          { name: 'AI-powered insights', included: true },
          { name: 'Custom source integration', included: true },
          { name: 'Real-time alerts & monitoring', included: true },
        ]
      },
    ],
  },
];

const mockPayoutHistory: PayoutHistoryItem[] = [
  { id: '1', date: '2024-01-15', amount: 8640, status: 'Paid', description: 'Monthly payout - January 2024', transactionId: 'PAY-2024-001' },
  { id: '2', date: '2023-12-15', amount: 7890, status: 'Paid', description: 'Monthly payout - December 2023', transactionId: 'PAY-2023-012' },
  { id: '3', date: '2023-11-15', amount: 6420, status: 'Paid', description: 'Monthly payout - November 2023', transactionId: 'PAY-2023-011' },
  { id: '4', date: '2023-10-15', amount: 5890, status: 'Paid', description: 'Monthly payout - October 2023', transactionId: 'PAY-2023-010' },
  { id: '5', date: '2024-02-15', amount: 9240, status: 'Pending', description: 'Monthly payout - February 2024', transactionId: 'PAY-2024-002' },
  { id: '6', date: '2024-02-01', amount: 1200, status: 'Failed', description: 'Bonus payout - Q4 2023', transactionId: 'PAY-2024-003' },
];

const mockTransactionHistory: TransactionHistoryItem[] = [
  { id: '1', consumerName: 'John Smith', consumerId: 'USR-001', product: 'Weather API', planName: 'Pro Plan', amountPaid: 49, billingCycleDate: '2024-01-15', status: 'Paid' },
  { id: '2', consumerName: 'Sarah Johnson', consumerId: 'USR-002', product: 'Crypto Prices API', planName: 'Enterprise', amountPaid: 149, billingCycleDate: '2024-01-20', status: 'Paid' },
  { id: '3', consumerName: 'Mike Chen', consumerId: 'USR-003', product: 'Weather API', planName: 'Pro Plan', amountPaid: 49, billingCycleDate: '2024-01-10', status: 'Paid' },
  { id: '4', consumerName: 'Lisa Brown', consumerId: 'USR-004', product: 'News Aggregator API', planName: 'Pro Plan', amountPaid: 29, billingCycleDate: '2024-01-25', status: 'Paid' },
  { id: '5', consumerName: 'Alex Wilson', consumerId: 'USR-005', product: 'Crypto Prices API', planName: 'Pro Plan', amountPaid: 79, billingCycleDate: '2024-01-18', status: 'Failed' },
  { id: '6', consumerName: 'DataCorp Inc.', consumerId: 'USR-006', product: 'Weather API', planName: 'Enterprise', amountPaid: 299, billingCycleDate: '2024-01-20', status: 'Paid' },
  { id: '7', consumerName: 'CryptoTrader Pro', consumerId: 'USR-007', product: 'Crypto Prices API', planName: 'Enterprise', amountPaid: 199, billingCycleDate: '2024-01-12', status: 'Paid' },
  { id: '8', consumerName: 'NewsHub Media', consumerId: 'USR-008', product: 'News Aggregator API', planName: 'Enterprise', amountPaid: 149, billingCycleDate: '2024-01-05', status: 'Pending' },
];

export default function StudioRevenuePage() {
  const [timeFrame, setTimeFrame] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { user } = useAuth();

  if (!user) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'Failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const generatePayoutReceipt = (payout: PayoutHistoryItem): void => {
    const receiptContent = `
ENFORCER - PAYOUT RECEIPT
========================

Payout ID: ${payout.transactionId}
Date: ${new Date(payout.date).toLocaleDateString()}
Amount: ${formatCurrency(payout.amount)}
Status: ${payout.status}
Description: ${payout.description}

Payment processed on ${new Date(payout.date).toLocaleDateString()}

Thank you for using Enforcer API Management Platform.

For questions, contact: support@enforcer.com
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Enforcer-Payout-Receipt-${payout.transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Revenue Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track earnings, subscriber management, and payout details across all API products
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeFrame} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeFrame(value)}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* 1. Summary Section (at the very top) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings to Date</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(mockSummaryData.totalEarningsToDate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime revenue across all products
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month's Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(mockSummaryData.currentMonthEarnings)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+24.2%</span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(mockSummaryData.pendingPayouts)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for next payout cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Products Revenue Overview (directly below) */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Products Revenue Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {mockProductsRevenue.map((product) => (
              <Card key={product.id} className="p-6 bg-muted/20 border border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Subscribers</p>
                        <p className="text-xl font-bold text-blue-600">{formatNumber(product.totalActiveSubscribers)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Month Revenue</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(product.currentMonthRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">All-Time Revenue</p>
                        <p className="text-xl font-bold text-purple-600">{formatCurrency(product.allTimeRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Revenue Per Subscriber</p>
                        <p className="text-xl font-bold text-orange-600">{formatCurrency(product.averageRevenuePerSubscriber)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <ViewSubscribersModal
                    productName={product.name}
                    subscribers={product.subscribers}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        View Subscribers
                      </Button>
                    }
                  />
                  
                  <ViewPlansModal
                    productName={product.name}
                    plans={product.plans}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        View Plans
                      </Button>
                    }
                  />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Payout History (next) */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5" />
            <span>Payout History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayoutHistory.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-foreground">
                      {new Date(payout.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(payout.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(payout.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(payout.status)}
                          <span>{payout.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payout.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => generatePayoutReceipt(payout)}
                        title="Download PDF Receipt"
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

      {/* 4. Transaction History (at the bottom) */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Consumer Name</TableHead>
                  <TableHead className="text-muted-foreground">Consumer ID</TableHead>
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">Plan Name</TableHead>
                  <TableHead className="text-muted-foreground">Amount Paid</TableHead>
                  <TableHead className="text-muted-foreground">Billing Cycle Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactionHistory.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-foreground">
                      {transaction.consumerName}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {transaction.consumerId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.product}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {transaction.planName}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(transaction.amountPaid)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.billingCycleDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(transaction.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(transaction.status)}
                          <span>{transaction.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              Showing {mockTransactionHistory.length} transactions
            </span>
            <span>
              Total Transaction Volume: <span className="font-semibold text-green-600">
                {formatCurrency(mockTransactionHistory.reduce((sum, t) => sum + t.amountPaid, 0))}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
