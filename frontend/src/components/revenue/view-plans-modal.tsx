'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  DollarSign, 
  Target, 
  Zap, 
  Clock,
  Users,
  TrendingUp,
  Star,
  CheckCircle
} from 'lucide-react';

interface Plan {
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
}

interface ViewPlansModalProps {
  productName: string;
  plans: Plan[];
  trigger: React.ReactNode;
}

export function ViewPlansModal({ productName, plans, trigger }: ViewPlansModalProps) {
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const averageRevenuePerSubscriber = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPlanBadgeColor = (type: string): string => {
    switch (type) {
      case 'free':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'basic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pro':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'enterprise':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getMarketShare = (planSubscribers: number): number => {
    return totalSubscribers > 0 ? (planSubscribers / totalSubscribers) * 100 : 0;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-card border-border overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{productName} - Available Plans</span>
          </DialogTitle>
        </DialogHeader>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-green-600/80">All plans combined</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{totalSubscribers}</div>
              <p className="text-xs text-blue-600/80">Across {plans.length} plans</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Avg Revenue/Sub</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(averageRevenuePerSubscriber)}</div>
              <p className="text-xs text-purple-600/80">Per subscriber</p>
            </CardContent>
          </Card>
        </div>

        {/* Plans Grid - Scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`bg-card/50 backdrop-blur-sm border-border/20 flex flex-col ${
                  plan.popular ? 'ring-2 ring-purple-500/30 bg-purple-500/5' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                        {plan.popular && (
                          <Star className="h-4 w-4 text-purple-400 fill-current" />
                        )}
                      </div>
                      <Badge variant="outline" className={getPlanBadgeColor(plan.type)}>
                        {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline justify-end space-x-1">
                        <span className="text-2xl font-bold text-foreground">
                          {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-xs text-muted-foreground">
                            /{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0 space-y-2 flex-1 flex flex-col">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex items-center space-x-1 mb-1">
                        <Users className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium">Subscribers</span>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {plan.subscribers}
                      </div>
                      <p className="text-xs text-muted-foreground">active users</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex items-center space-x-1 mb-1">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium">Revenue</span>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {formatCurrency(plan.revenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">monthly</p>
                    </div>
                  </div>

                  {/* Plan Limits - Compact Layout */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex items-center space-x-1 mb-1">
                        <Target className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium">Quota Limit</span>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {formatNumber(plan.quotaLimit)}
                      </div>
                      <p className="text-xs text-muted-foreground">calls/month</p>
                    </div>

                    <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex items-center space-x-1 mb-1">
                        <Zap className="h-3 w-3 text-orange-600" />
                        <span className="text-xs font-medium">Rate Limit</span>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {plan.rateLimit}
                      </div>
                      <p className="text-xs text-muted-foreground">req/min</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
                    <div className="text-xs font-medium mb-1 flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>Key Features</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{feature.name}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          +{plan.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overage Rules - Simplified */}
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 mt-auto">
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="h-3 w-3 text-orange-600" />
                      <span className="text-xs font-medium text-orange-600">Overage Policy</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {plan.type === 'free' ? (
                        <p>Service suspended at quota limit</p>
                      ) : (
                        <>
                          <p>Rate: {plan.type === 'basic' ? '$0.001' : plan.type === 'pro' ? '$0.0008' : '$0.0005'}/call</p>
                          <p>Free allowance: {plan.type === 'basic' ? '500' : plan.type === 'pro' ? '2K' : '10K'} calls</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm text-muted-foreground">
          <span>{plans.length} plans available for {productName}</span>
          <span>Total MRR: {formatCurrency(totalRevenue)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}