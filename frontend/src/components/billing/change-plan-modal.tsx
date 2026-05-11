'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  DollarSign,
  Zap,
  Clock,
  Target,
  ArrowRight,
  AlertTriangle,
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
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  quota: number;
  rateLimit: string;
  features: string[];
  popular?: boolean;
  description: string;
}

interface ChangePlanModalProps {
  subscription: ApiSubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanChange?: (planId: string, subscription: ApiSubscription) => void;
}

export function ChangePlanModal({ subscription, isOpen, onClose, onPlanChange }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  if (!subscription) return null;

  // Mock available plans for this API
  const availablePlans: PlanOption[] = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 19,
      billingPeriod: 'monthly',
      quota: 2500,
      rateLimit: '25 requests/minute',
      features: ['Basic API access', 'Email support', 'Standard rate limits'],
      description: 'Perfect for small projects and testing'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 49,
      billingPeriod: 'monthly',
      quota: 10000,
      rateLimit: '100 requests/minute',
      features: ['Full API access', 'Priority support', 'Enhanced rate limits', 'Analytics dashboard'],
      popular: true,
      description: 'Ideal for production applications'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 149,
      billingPeriod: 'monthly',
      quota: 50000,
      rateLimit: '500 requests/minute',
      features: ['Unlimited API access', '24/7 dedicated support', 'Custom rate limits', 'Advanced analytics', 'SLA guarantee'],
      description: 'For high-volume applications'
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCurrentPlan = (): PlanOption | undefined => {
    return availablePlans.find(plan => plan.name === subscription.planName);
  };

  const handleSelectPlan = (plan: PlanOption): void => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmChange = (): void => {
    if (selectedPlan && onPlanChange) {
      onPlanChange(selectedPlan.id, subscription);
    }
    setShowConfirmation(false);
    setSelectedPlan(null);
    onClose();
  };

  const handleCancel = (): void => {
    setShowConfirmation(false);
    setSelectedPlan(null);
  };

  const isUpgrade = (plan: PlanOption): boolean => {
    return plan.price > subscription.price;
  };

  const currentPlan = getCurrentPlan();

  if (showConfirmation && selectedPlan) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span>Confirm Plan Change</span>
            </DialogTitle>
            <DialogDescription>
              Please review your plan change details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                  {subscription.planName}
                </Badge>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Plan</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {selectedPlan.name}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Price</span>
                <span className="font-bold">{formatCurrency(selectedPlan.price)}/month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Effective Date</span>
                <span className="font-medium">
                  {isUpgrade(selectedPlan) ? 'Immediately' : 'Next billing cycle'}
                </span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>You are switching to {selectedPlan.name}</strong> at {formatCurrency(selectedPlan.price)}/month starting{' '}
                <strong>{isUpgrade(selectedPlan) ? 'immediately' : 'next billing cycle'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmChange} className="flex-1">
              Confirm Change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold">Change Plan</div>
              <div className="text-sm text-muted-foreground">{subscription.apiName}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Compare available plans and select the one that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availablePlans.map((plan) => {
            const isCurrentPlan = plan.name === subscription.planName;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.popular ? 'border-blue-500/50 bg-blue-500/5' : 'bg-card/50 backdrop-blur-sm border-border/20'
                } ${isCurrentPlan ? 'ring-2 ring-green-500/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Quota</span>
                      <span className="font-medium">{plan.quota.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rate Limit</span>
                      <span className="font-medium">{plan.rateLimit}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button disabled className="w-full" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Select Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}