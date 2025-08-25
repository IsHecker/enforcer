'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
} from 'lucide-react';

export default function UsagePage() {
  const { user } = useAuth();

  if (!user) return null;

  const usageData = {
    currentPeriod: {
      apiCalls: 3420,
      quota: user.plan === 'pro' ? 50000 : 1000,
      overage: 0,
      cost: user.plan === 'pro' ? 29.99 : 0,
    },
    breakdown: [
      { name: 'Weather API', calls: 1850, percentage: 54.1, cost: 18.50 },
      { name: 'Crypto API', calls: 980, percentage: 28.7, cost: 9.80 },
      { name: 'News API', calls: 450, percentage: 13.2, cost: 4.50 },
      { name: 'Maps API', calls: 140, percentage: 4.1, cost: 1.40 },
    ],
    timeline: [
      { date: '2024-01-15', calls: 245, cost: 2.45 },
      { date: '2024-01-16', calls: 389, cost: 3.89 },
      { date: '2024-01-17', calls: 156, cost: 1.56 },
      { date: '2024-01-18', calls: 578, cost: 5.78 },
      { date: '2024-01-19', calls: 423, cost: 4.23 },
      { date: '2024-01-20', calls: 692, cost: 6.92 },
      { date: '2024-01-21', calls: 334, cost: 3.34 },
    ],
  };

  const usagePercentage = (usageData.currentPeriod.apiCalls / usageData.currentPeriod.quota) * 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Usage Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your API usage, quotas, and spending across all subscriptions
            </p>
          </div>

          <Badge
            variant="outline"
            className={isNearLimit
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              : 'bg-green-500/10 text-green-400 border-green-500/30'
            }
          >
            {isNearLimit ? (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Approaching Limit
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Usage Normal
              </>
            )}
          </Badge>
        </div>

        {/* Current Period Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                API Calls Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {usageData.currentPeriod.apiCalls.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                of {usageData.currentPeriod.quota.toLocaleString()} calls
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Usage Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {usagePercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                of monthly quota
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Days Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                18
              </div>
              <p className="text-sm text-muted-foreground">
                in billing cycle
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Current Bill
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${usageData.currentPeriod.cost.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                this period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quota Progress */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Monthly Quota</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track your API usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {usageData.currentPeriod.apiCalls.toLocaleString()} calls used
              </span>
              <span className="text-muted-foreground">
                {(usageData.currentPeriod.quota - usageData.currentPeriod.apiCalls).toLocaleString()} remaining
              </span>
            </div>
            <Progress
              value={usagePercentage}
              className={`h-3 ${isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {usagePercentage.toFixed(1)}% of quota used
              </span>
              <Badge variant="outline" className={isNearLimit ? 'text-yellow-400' : 'text-green-400'}>
                {user.plan} Plan
              </Badge>
            </div>

            {isNearLimit && (
              <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <span className="font-medium">Approaching quota limit.</span>
                  <span className="ml-1">Consider upgrading your plan to avoid service interruption.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Analytics Chart */}
        <AnalyticsChart role="consumer" />

        {/* API Breakdown */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Usage by API</CardTitle>
            <CardDescription className="text-muted-foreground">
              Breakdown of API calls across your subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData.breakdown.map((api, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <div className="font-medium text-foreground">{api.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {api.calls.toLocaleString()} calls ({api.percentage}%)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">${api.cost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">this period</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Upgrade CTA */}
        {user.plan !== 'enterprise' && (
          <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Need More API Calls?
                  </h3>
                  <p className="text-muted-foreground">
                    Upgrade your plan to get higher quotas, faster rate limits, and premium features.
                  </p>
                </div>
                <Button>
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}