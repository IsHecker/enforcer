'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Tag, DollarSign, Wallet, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import { SubscriptionPlansTab } from './subscription-plans-tab';
import { PromoCodesTab } from './promo-codes-tab';
import { api } from '@/services/api-service';
import { ApiServiceStatResponse } from '@/types/backend-api';
import type { ApiProduct } from '@/types/api';
import { useState, useEffect } from 'react';

interface MonetizationDashboardProps {
  apiProduct: ApiProduct;
  isNewProduct?: boolean;
}

export function MonetizationDashboard({ apiProduct, isNewProduct = false }: MonetizationDashboardProps) {
  const [stats, setStats] = useState<ApiServiceStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.analytics.getApiServiceStat(apiProduct.id);
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching service stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [apiProduct.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20 shadow-sm transition-all hover:bg-blue-500/15">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.15em]">Active Promotions</span>
            <Tag className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            12 <span className="text-xs text-blue-400 font-bold ml-1.5 opacity-60">Live Codes</span>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20 shadow-sm transition-all hover:bg-green-500/15">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.15em]">Active Subscribers</span>
            <Users className="h-4 w-4 text-green-400" />
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-white tracking-tight">
              {isLoading ? '...' : (stats?.activeSubscribers || 0).toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {stats ? 'Live' : 'Mock'}
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20 shadow-sm transition-all hover:bg-purple-500/15">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.15em]">Conversion Rate</span>
            <CreditCard className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            14.2% <span className="text-xs text-purple-400 font-bold ml-1.5 opacity-60">New Users</span>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20 shadow-sm transition-all hover:bg-orange-500/15">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.15em]">Revenue Impact</span>
            <DollarSign className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(8450)}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="promo-codes" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Promo Codes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4 pt-4">
          <SubscriptionPlansTab
            apiProductId={apiProduct.id}
            isNewProduct={isNewProduct}
          />
        </TabsContent>

        <TabsContent value="promo-codes" className="space-y-4 pt-4">
          <PromoCodesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
