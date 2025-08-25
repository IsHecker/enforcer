'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { useAuth } from '@/contexts/auth-context';
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PiggyBank,
} from 'lucide-react';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscribers: number;
  averageRevenuePerUser: number;
  revenueGrowth: number;
  subscriberGrowth: number;
  pendingPayouts: number;
  totalPayouts: number;
}

interface ProductRevenue {
  id: string;
  name: string;
  revenue: number;
  subscribers: number;
  growth: number;
  planBreakdown: {
    plan: string;
    revenue: number;
    subscribers: number;
  }[];
}

const mockRevenueData: RevenueData = {
  totalRevenue: 24750,
  monthlyRevenue: 8920,
  activeSubscribers: 156,
  averageRevenuePerUser: 57.20,
  revenueGrowth: 23.5,
  subscriberGrowth: 18.2,
  pendingPayouts: 6240,
  totalPayouts: 18510,
};

const mockProductRevenue: ProductRevenue[] = [
  {
    id: '1',
    name: 'Weather API',
    revenue: 12400,
    subscribers: 89,
    growth: 15.3,
    planBreakdown: [
      { plan: 'Free', revenue: 0, subscribers: 45 },
      { plan: 'Pro', revenue: 8900, subscribers: 31 },
      { plan: 'Enterprise', revenue: 3500, subscribers: 13 },
    ],
  },
  {
    id: '2',
    name: 'Crypto Prices API',
    revenue: 8950,
    subscribers: 67,
    growth: 32.1,
    planBreakdown: [
      { plan: 'Free', revenue: 0, subscribers: 34 },
      { plan: 'Pro', revenue: 6200, subscribers: 24 },
      { plan: 'Enterprise', revenue: 2750, subscribers: 9 },
    ],
  },
  {
    id: '3',
    name: 'Maps & Geocoding API',
    revenue: 3400,
    subscribers: 28,
    growth: -5.2,
    planBreakdown: [
      { plan: 'Free', revenue: 0, subscribers: 12 },
      { plan: 'Pro', revenue: 2100, subscribers: 12 },
      { plan: 'Enterprise', revenue: 1300, subscribers: 4 },
    ],
  },
];

const monthlyRevenueData = [
  { name: 'Jan', revenue: 4200, subscribers: 89 },
  { name: 'Feb', revenue: 5100, subscribers: 102 },
  { name: 'Mar', revenue: 6800, subscribers: 124 },
  { name: 'Apr', revenue: 7200, subscribers: 135 },
  { name: 'May', revenue: 8100, subscribers: 142 },
  { name: 'Jun', revenue: 8920, subscribers: 156 },
];

export default function RevenuePage() {
  const [timeFrame, setTimeFrame] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { user } = useAuth();

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Revenue Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track earnings, payouts, and financial performance across all API products
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
                Export
              </Button>
            </div>
          </div>

          {/* Revenue Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockRevenueData.totalRevenue)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">{formatPercentage(mockRevenueData.revenueGrowth)}</span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(mockRevenueData.monthlyRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current month earnings
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockRevenueData.activeSubscribers.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">{formatPercentage(mockRevenueData.subscriberGrowth)}</span>
                  <span className="ml-1">growth</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Revenue/User</CardTitle>
                <CreditCard className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(mockRevenueData.averageRevenuePerUser)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per subscriber per month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChart
                data={monthlyRevenueData}
                dataKey="revenue"
                className="h-80"
                showRevenue
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Revenue Breakdown */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle>Revenue by API Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProductRevenue.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <Badge
                            className={
                              product.growth > 0
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {formatPercentage(product.growth)}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {formatCurrency(product.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {product.subscribers} subscribers
                        </div>
                        <div className="space-y-1">
                          {product.planBreakdown.map((plan) => (
                            <div key={plan.plan} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{plan.plan}:</span>
                              <span>{formatCurrency(plan.revenue)} ({plan.subscribers} users)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payouts & Financial Health */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle>Payouts & Financials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600/30">
                        Pending
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(mockRevenueData.pendingPayouts)}
                    </div>
                    <p className="text-xs text-muted-foreground">Next payout</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <PiggyBank className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-blue-600 border-blue-600/30">
                        Paid Out
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(mockRevenueData.totalPayouts)}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Recent Payouts</h4>
                  {[
                    { date: 'Jun 1, 2024', amount: 6240, status: 'completed' },
                    { date: 'May 1, 2024', amount: 5890, status: 'completed' },
                    { date: 'Apr 1, 2024', amount: 4920, status: 'completed' },
                  ].map((payout, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium text-sm">{payout.date}</div>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600/30 text-xs"
                        >
                          {payout.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(payout.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Payout History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Insights */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle>Revenue Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-600">Growing Revenue</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your Crypto Prices API is showing strong 32% growth. Consider expanding its feature set.
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-600">Subscriber Growth</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    18% subscriber growth this month. Your marketing efforts are paying off!
                  </p>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <ArrowDownRight className="h-4 w-4 text-orange-600" />
                    </div>
                    <h4 className="font-medium text-orange-600">Attention Needed</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maps API revenue is down 5.2%. Consider reviewing pricing or adding new features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}