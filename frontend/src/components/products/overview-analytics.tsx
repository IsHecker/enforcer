'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RouteDisplay } from '@/components/ui/route-display';
import { Users, Zap, Activity, CheckCircle, BarChart3 } from 'lucide-react';
import type { ApiProduct } from '@/types/api';

interface OverviewAnalyticsProps {
  apiProduct: ApiProduct;
  usageData: any[];
  isNewProduct: boolean;
}

export function OverviewAnalytics({ apiProduct, usageData, isNewProduct }: OverviewAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{apiProduct.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(apiProduct.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(apiProduct.totalCalls || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total requests</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {apiProduct.successRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Uptime reliability</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Usage Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle>Usage Analytics (Calls)</CardTitle>
          </CardHeader>
          <CardContent>
            {isNewProduct ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  No usage data yet
                </h3>
                <p className="text-xs text-muted-foreground">
                  Usage metrics will appear here over time
                </p>
              </div>
            ) : (
              <AnalyticsChart
                data={usageData}
                dataKey="calls"
                className="h-64"
              />
            )}
          </CardContent>
        </Card>

        {/* Endpoint Performance */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle>Endpoint Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {apiProduct.endpoints.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  No endpoint data available
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create endpoints to see performance metrics
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiProduct.endpoints.slice(0, 5).map((endpoint) => (
                  <div key={endpoint.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">
                        <RouteDisplay route={endpoint?.path || ''} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {endpoint.callsToday || 0} calls today
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{endpoint.responseTime || 0}ms</div>
                      <div className="text-sm text-muted-foreground">
                        {endpoint.errorRate || 0}% error rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
