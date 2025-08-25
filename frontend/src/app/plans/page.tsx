'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { PlanCard } from '@/components/plans/plan-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Plus,
  Zap,
} from 'lucide-react';
import type { Plan } from '@/types/api';

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Free Tier',
    type: 'free',
    price: 0,
    billingPeriod: 'monthly',
    quotaLimit: 1000,
    rateLimit: 10,
    isActive: true,
    features: [
      '1,000 API calls/month',
      'Basic analytics',
      'Community support',
      'Standard rate limiting',
      'Email notifications',
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Pro Plan',
    type: 'pro',
    price: 29,
    billingPeriod: 'monthly',
    quotaLimit: 50000,
    rateLimit: 100,
    isActive: true,
    features: [
      '50,000 API calls/month',
      'Advanced analytics & reporting',
      'Priority email support',
      'Higher rate limits',
      'Real-time notifications',
      'Custom webhooks',
      'API usage insights',
    ],
    overage: {
      enabled: true,
      pricePerRequest: 0.001,
      maxOverage: 10000,
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Enterprise',
    type: 'enterprise',
    price: 99,
    billingPeriod: 'monthly',
    quotaLimit: 500000,
    rateLimit: 1000,
    isActive: true,
    features: [
      '500,000 API calls/month',
      'Enterprise analytics suite',
      'Dedicated account manager',
      'Custom rate limits',
      'White-label options',
      'SLA guarantees',
      'Priority support (24/7)',
      'Advanced security features',
      'Custom integrations',
    ],
    overage: {
      enabled: true,
      pricePerRequest: 0.0005,
      maxOverage: 100000,
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export default function PlansPage() {
  const { user } = useAuth();

  if (!user) return null;

  const handleSubscribe = (plan: Plan) => {
    toast.success(`Subscribed to ${plan.name}!`);
    console.log('Subscribe to plan:', plan.id);
  };

  const handleEditPlan = (plan: Plan) => {
    console.log('Edit plan:', plan.id);
  };

  const handleDeletePlan = (plan: Plan) => {
    if (confirm(`Are you sure you want to delete the ${plan.name}?`)) {
      toast.success(`${plan.name} deleted successfully`);
      console.log('Delete plan:', plan.id);
    }
  };

  const handleCreatePlan = () => {
    console.log('Create new plan');
  };

  const getPageTitle = () => {
    switch (user.role) {
      case 'creator':
        return 'Pricing Plans';
      case 'consumer':
        return 'Choose Your Plan';
      case 'admin':
        return 'Platform Plans';
      default:
        return 'Plans & Pricing';
    }
  };

  const getPageSubtitle = () => {
    switch (user.role) {
      case 'creator':
        return 'Create and manage pricing plans for your API products';
      case 'consumer':
        return 'Select the perfect plan for your API usage needs';
      case 'admin':
        return 'Manage platform pricing plans and subscription options';
      default:
        return 'Find the right plan for your needs';
    }
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getPageTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">
                {getPageSubtitle()}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {mockPlans.length} plans
              </Badge>
              {user.role === 'creator' && (
                <Button onClick={handleCreatePlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              )}
            </div>
          </div>

          {user.role === 'consumer' && (
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-border/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Current Plan: {user.plan === 'pro' ? 'Pro Plan' : 'Free Tier'}
                  </h3>
                  <p className="text-muted-foreground">
                    {user.plan === 'pro'
                      ? 'You have access to all premium features'
                      : 'Upgrade to unlock more API calls and premium features'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
                userRole={user.role}
                isCurrentPlan={user.role === 'consumer' && (
                  (user.plan === 'pro' && plan.type === 'pro') ||
                  (user.plan !== 'pro' && plan.type === 'free')
                )}
                isPopular={plan.type === 'pro'}
              />
            ))}
          </div>

          {user.role === 'consumer' && (
            <div className="bg-card/50 backdrop-blur-sm border-border/20 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Need a Custom Plan?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Contact our sales team for custom pricing and enterprise features tailored to your specific needs.
                </p>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          )}

          {user.role === 'creator' && mockPlans.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No pricing plans created
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first pricing plan to start monetizing your API products
              </p>
              <Button onClick={handleCreatePlan}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}