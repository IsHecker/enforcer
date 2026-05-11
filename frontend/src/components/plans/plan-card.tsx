'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  DollarSign,
  Activity,
  Clock,
  Edit3,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import type { Plan } from '@/types/api';

interface PlanCardProps {
  plan: Plan;
  onSubscribe?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
  onCancel?: (plan: Plan) => void;
  userRole: 'creator' | 'consumer' | 'admin';
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  actionType?: 'subscribe' | 'upgrade' | 'downgrade' | 'current';
  activeSubscribers?: number;
  totalSubscribers?: number;
}

export function PlanCard({
  plan,
  onSubscribe,
  onEdit,
  onDelete,
  onCancel,
  userRole,
  isCurrentPlan = false,
  isPopular = false,
  actionType = 'subscribe',
  activeSubscribers,
  totalSubscribers,
}: PlanCardProps) {
  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const formatQuota = (quota: number): string => {
    if (quota >= 1000000) return `${(quota / 1000000).toFixed(1)}M`;
    if (quota >= 1000) return `${(quota / 1000).toFixed(0)}K`;
    return quota.toString();
  };

  const visibleFeatures = plan.features.slice(0, 5);
  const remainingFeaturesCount = plan.features.length - visibleFeatures.length;

  return (
    <TooltipProvider>
      <Card className={`h-full flex flex-col relative transition-all duration-300 group ${isPopular
        ? 'bg-white/[0.03] border-blue-500/50 ring-1 ring-blue-500/20 shadow-[0_0_40px_-20px_rgba(59,130,246,0.3)] scale-[1.02] z-10'
        : 'bg-white/[0.01] border-border/10 hover:bg-white/[0.02] hover:border-white/20'
        } ${isCurrentPlan ? 'ring-1 ring-primary/40 bg-primary/[0.02]' : ''} backdrop-blur-xl rounded-[24px]`}>

        {/* Popular Badge integrated into border */}
        {isPopular && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="px-4 py-1 flex items-center justify-center bg-blue-500 border border-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
                Most Popular
              </span>
            </div>
          </div>
        )}

        {/* Decorative Background Elements */}
        {isPopular && (
          <div className="absolute top-0 right-0 p-8 -mr-16 -mt-16 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none overflow-hidden" />
        )}
        <div className="absolute bottom-0 left-0 p-8 -ml-16 -mb-16 bg-white/[0.02] rounded-full blur-[60px] pointer-events-none" />



        <CardHeader className="pb-8 pt-10 px-6 space-y-6 relative">
          <div className="flex items-center justify-between w-full relative">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                {plan.name}
              </h3>
              {userRole !== 'consumer' && (
                <Badge variant="outline" className={`${getStatusBadge(plan.isActive)} rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-tight`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>

            <div className="absolute top-0 right-0 flex flex-col items-end gap-1.5 shrink-0 z-10">
              {typeof activeSubscribers === 'number' && (
                <div className="px-3 py-1 flex items-center justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg backdrop-blur-sm shadow-sm">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    {activeSubscribers} Active
                  </span>
                </div>
              )}
              {typeof totalSubscribers === 'number' && (
                <div className="px-3 py-1 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm shadow-sm">
                  <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] whitespace-nowrap">
                    {totalSubscribers} Total
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col">
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-5xl font-black text-white leading-none tracking-tighter">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-lg text-muted-foreground font-bold opacity-40">
                  /{plan.billingPeriod?.toLowerCase() === 'yearly' ? 'year' : 'month'}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 flex-1 px-6">
          {/* Main Key Metrics - SaaS Style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] transition-all group/metric">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Capacity/Quota</span>
              </div>
              <span className="text-[15px] font-black text-white tracking-tight">
                {formatQuota(plan.quotaLimit)} Requests/{plan.quotaPeriod ? ({ 'daily': 'Day', 'weekly': 'Week', 'monthly': 'Month', 'yearly': 'Year' }[plan.quotaPeriod.toLowerCase()] || plan.quotaPeriod) : 'Month'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] transition-all group/metric">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Rate Limit</span>
              </div>
              <span className="text-[15px] font-black text-white tracking-tight">
                {plan.rateLimit} Requests/{plan.rateLimitPeriod || 'Second'}
              </span>
            </div>

            {plan.overage?.enabled && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/[0.06] border border-orange-400/20 transition-all group/metric shadow-[0_2px_15px_-5px_rgba(251,146,60,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <DollarSign className="h-4 w-4 text-orange-400" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Overages</span>
                </div>
                <div className="flex flex-col items-end justify-center space-y-1.5">
                  <div className="flex items-center gap-2 leading-none">
                    <span className="text-[15px] font-black text-white tracking-tight">
                      {plan.overage.maxOverage ? plan.overage.maxOverage.toLocaleString() : '∞'}
                    </span>
                    <span className="text-[14px] font-black text-white tracking-tight">Extra Requests</span>
                  </div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[12px] font-black text-orange-400">
                      ${plan.overage.pricePerRequest}
                    </span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Per Request</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Checklist */}
          <div className="space-y-5">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-1 flex items-center gap-3 after:h-px after:flex-1 after:bg-white/10">
              Features included
            </p>
            <div className="space-y-4 px-1">
              <div className="space-y-2.5">
                {visibleFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2.5 group/feat">
                    <div className="mt-1 flex-shrink-0 p-0.5 rounded-full bg-emerald-500/10">
                      <CheckCircle className="h-2.5 w-2.5 text-emerald-400" />
                    </div>
                    <span className="text-[12px] text-muted-foreground/80 font-medium leading-tight group-hover/feat:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {remainingFeaturesCount > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 text-[11px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors pl-1 mt-2">
                      +{remainingFeaturesCount} more features
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-[#0A0A0B] border-white/10 text-white backdrop-blur-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3 pb-4">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <Activity className="h-4 w-4 text-blue-400" />
                        </div>
                        {plan.name} — Full Features
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4 mt-2">
                      <div className="space-y-4 pt-1">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors group/feat">
                            <div className="mt-1 flex-shrink-0 p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                              <CheckCircle className="h-3 w-3 text-emerald-400" />
                            </div>
                            <span className="text-sm text-gray-400 font-medium group-hover/feat:text-white transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>


        </CardContent>

        <CardFooter className="pt-6 pb-10 px-6 mt-auto">
          {userRole === 'consumer' ? (
            <Button
              className={`w-full py-7 h-auto rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all transform hover:translate-y-[-2px] active:scale-[0.98] ${actionType === 'current'
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-none hover:translate-y-0'
                : isPopular
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]'
                  : 'bg-white text-black hover:bg-gray-100 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]'
                }`}
              onClick={() => {
                if (actionType === 'current') {
                  onCancel?.(plan);
                } else {
                  onSubscribe?.(plan);
                }
              }}
            >
              {actionType === 'current' ? 'Cancel Subscription' : actionType === 'upgrade' ? 'Upgrade Tier' : actionType === 'downgrade' ? 'Downgrade Tier' : 'Subscribe'}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(plan)}
                className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-widest rounded-xl py-6 border-dashed"
              >
                <Edit3 className="h-4 w-4 mr-2 opacity-60" />
                Modify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(plan)}
                className="bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl py-6 border-dashed"
              >
                <Trash2 className="h-4 w-4 mr-2 opacity-60" />
                Remove
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}