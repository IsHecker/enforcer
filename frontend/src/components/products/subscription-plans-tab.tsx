'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlanCard } from '@/components/plans/plan-card';
import { EditPlanModal } from '@/components/plans/edit-plan-modal';
import { CreatePlanModal } from '@/components/plans/create-plan-modal';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api-service';
import { PlanStatResponse } from '@/types/backend-api';
import { toast } from 'sonner';
import {
  Zap,
  Plus,
  LayoutGrid,
  Info,
  Layers,
} from 'lucide-react';
import type { Plan, ApiEndpoint } from '@/types/api';

interface SubscriptionPlansTabProps {
  apiProductId: string;
  isNewProduct?: boolean;
}

const mockPlansForProduct: Plan[] = [
  {
    id: '1',
    name: 'Free Tier',
    type: 'free',
    price: 0,
    billingPeriod: 'monthly',
    quotaLimit: 1000,
    quotaPeriod: 'monthly',
    rateLimit: 10,
    rateLimitPeriod: 'second',
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
    quotaPeriod: 'monthly',
    rateLimit: 100,
    rateLimitPeriod: 'second',
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
    quotaPeriod: 'monthly',
    rateLimit: 1000,
    rateLimitPeriod: 'second',
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

const mockEndpoints: ApiEndpoint[] = [
  { id: '1', path: '/users', method: 'GET', isActive: true, planRestrictions: [], title: 'Get Users' },
  { id: '2', path: '/users/{id}', method: 'GET', isActive: true, planRestrictions: [], title: 'Get User by ID' },
  { id: '3', path: '/data/analytics', method: 'GET', isActive: true, planRestrictions: [], title: 'Get Analytics Data' },
  { id: '4', path: '/webhooks', method: 'POST', isActive: true, planRestrictions: [], title: 'Create Webhook' },
];

export function SubscriptionPlansTab({ apiProductId, isNewProduct = false }: SubscriptionPlansTabProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planStats, setPlanStats] = useState<Record<string, PlanStatResponse>>({});
  const [isLoading, setIsLoading] = useState(!isNewProduct);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      if (isNewProduct) return;
      
      setIsLoading(true);
      try {
        const response = await api.plans.listForService(apiProductId);
        if (response.success && response.data) {
          const transformedPlans: Plan[] = response.data.map(p => ({
            id: p.id,
            name: p.name || 'Unnamed Plan',
            type: (p.type?.toLowerCase() as 'free' | 'pro' | 'enterprise') || 'free',
            price: (p.priceInCents || 0) / 100,
            billingPeriod: (p.billingPeriod?.toLowerCase() as 'monthly' | 'yearly' | 'usage') || 'monthly',
            quotaLimit: p.quotaLimit,
            quotaPeriod: (p.quotaResetPeriod?.toLowerCase() as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'monthly',
            rateLimit: p.rateLimit,
            rateLimitPeriod: 'minute', // Default since backend uses window enum
            features: p.features || [],
            isActive: p.isActive,
            createdAt: new Date().toISOString(),
          }));
          setPlans(transformedPlans);
          
          // Fetch stats for each plan
          response.data.forEach(async (plan) => {
            try {
              const statRes = await api.analytics.getPlanStat(plan.id);
              if (statRes.success && statRes.data) {
                setPlanStats(prev => ({ ...prev, [plan.id]: statRes.data! }));
              }
            } catch (err) {
              console.error(`Error fetching stats for plan ${plan.id}:`, err);
            }
          });
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        toast.error('Failed to load plans');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [apiProductId, isNewProduct]);

  // Determine popular plan based on highest active subscriber count
  const popularPlanId = useMemo(() => {
    const statsArray = Object.values(planStats);
    if (statsArray.length === 0) return plans.find(p => p.type === 'pro')?.id;
    
    return statsArray.reduce((prev, curr) => 
      (curr.activeSubscribers > prev.activeSubscribers) ? curr : prev
    ).planId;
  }, [planStats, plans]);

  if (!user) return null;

  const handleEditPlan = (plan: Plan): void => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = (): void => {
    setIsEditModalOpen(false);
    setEditingPlan(null);
  };

  const handleEditPlanSave = (updatedPlan: Plan): void => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleDeletePlan = (plan: Plan): void => {
    if (confirm(`Are you sure you want to delete the ${plan.name}?`)) {
      setPlans(prev => prev.filter(p => p.id !== plan.id));
      toast.success(`${plan.name} deleted successfully`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Updated Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.05]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white tracking-tight">Subscription Plans</h2>
            <div className="bg-white/[0.05] border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-3 transition-all hover:bg-white/[0.05] hover:border-white/20 group/tier shadow-inner">

              <span className="text-[12px] font-black text-muted-foreground group-hover/tier:text-white/70 uppercase tracking-[0.15em] leading-none transition-colors">
                {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium opacity-70">
            View and manage subscription plans for this API product
          </p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Synchronizing plan data...</p>
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              <PlanCard
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
                userRole={user.role}
                isPopular={plan.id === popularPlanId}
                activeSubscribers={planStats[plan.id]?.activeSubscribers}
                totalSubscribers={planStats[plan.id]?.totalSubscribers}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[32px] text-center space-y-6 group hover:border-white/10 transition-colors">
          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.04] transition-all transform group-hover:rotate-12">
            <Zap className="h-10 w-10 text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-bold text-white leading-tight">No subscription tiers detected</h3>
            <p className="text-sm text-muted-foreground/60 font-medium leading-relaxed">
              Monetize your API assets by defining specific usage limits and pricing models for your developers.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="bg-white text-black hover:bg-white/90 rounded-xl px-8 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-white/10"
          >
            Launch First Tier
          </Button>
        </div>
      )}

      {/* Control Modals */}
      <CreatePlanModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={(newPlan) => {
          setPlans(prev => [...prev, newPlan]);
          setIsCreateDialogOpen(false);
          toast.success(`${newPlan.name} created successfully`);
        }}
        apiProductId={apiProductId}
        existingPlans={plans}
      />

      <EditPlanModal
        plan={editingPlan}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={(updatedPlan) => {
          handleEditPlanSave(updatedPlan);
          toast.success(`${updatedPlan.name} updated successfully`);
        }}
      />
    </div>
  );
}