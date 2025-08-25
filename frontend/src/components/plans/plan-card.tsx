'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Zap, 
  DollarSign,
  Users,
  Activity,
  Shield,
  Clock,
} from 'lucide-react';
import type { Plan } from '@/types/api';

interface PlanCardProps {
  plan: Plan;
  onSubscribe?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
  userRole: 'creator' | 'consumer' | 'admin';
  isCurrentPlan?: boolean;
  isPopular?: boolean;
}

export function PlanCard({ 
  plan, 
  onSubscribe, 
  onEdit, 
  onDelete, 
  userRole, 
  isCurrentPlan = false,
  isPopular = false,
}: PlanCardProps) {
  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'free':
        return <Users className="h-5 w-5" />;
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'enterprise':
        return <Shield className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'text-green-400';
      case 'pro':
        return 'text-blue-400';
      case 'enterprise':
        return 'text-purple-400';
      default:
        return 'text-primary';
    }
  };

  const formatQuota = (quota: number): string => {
    if (quota >= 1000000) return `${(quota / 1000000).toFixed(1)}M`;
    if (quota >= 1000) return `${(quota / 1000).toFixed(0)}K`;
    return quota.toString();
  };

  const formatPrice = (price: number, period: string): string => {
    if (price === 0) return 'Free';
    return `$${price}${period === 'yearly' ? '/yr' : '/mo'}`;
  };

  return (
    <Card className={`relative bg-card/50 backdrop-blur-sm border-border/20 hover:bg-card/60 transition-all duration-200 ${
      isCurrentPlan ? 'ring-2 ring-primary' : ''
    } ${isPopular ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white">
            Most Popular
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-primary text-primary-foreground">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-muted/20 ${getPlanColor(plan.type)}`}>
              {getPlanIcon(plan.type)}
            </div>
            <div>
              <CardTitle className="text-foreground capitalize">
                {plan.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${plan.isActive ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {plan.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(plan.price, plan.billingPeriod)}
            </div>
            <div className="text-xs text-muted-foreground">
              {plan.billingPeriod === 'usage' ? 'pay-per-use' : plan.billingPeriod}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">
                {formatQuota(plan.quotaLimit)} requests
              </div>
              <div className="text-xs text-muted-foreground">
                per {plan.billingPeriod === 'usage' ? 'transaction' : 'month'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">
                {plan.rateLimit}/sec
              </div>
              <div className="text-xs text-muted-foreground">rate limit</div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Features included:</div>
          <div className="space-y-1">
            {plan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
            {plan.features.length > 4 && (
              <div className="text-xs text-muted-foreground">
                +{plan.features.length - 4} more features
              </div>
            )}
          </div>
        </div>

        {plan.overage?.enabled && (
          <>
            <Separator />
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="font-medium text-foreground">
                  ${plan.overage.pricePerRequest} per extra request
                </div>
                <div className="text-xs text-muted-foreground">
                  Max {plan.overage.maxOverage} overages
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        {userRole === 'consumer' ? (
          <div className="w-full">
            {isCurrentPlan ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => onSubscribe?.(plan)}
              >
                {plan.price === 0 ? 'Get Started' : 'Upgrade'}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit?.(plan)}
            >
              Edit Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete?.(plan)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}