'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Plus,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Activity,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { ApiServiceResponse } from '@/types/backend-api';

export default function StudioDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ApiServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch creator's products
  useEffect(() => {
    const fetchCreatorProducts = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch API services created by this user
        const response = await api.apiServices.list({
          pageNumber: 1,
          pageSize: 100,
        });

        if (response.success && response.data) {
          const items = Array.isArray(response.data)
            ? response.data
            : ((response.data as any).items || []);
          setProducts(items);
        } else {
          console.warn('Failed to load products:', response.error);
        }
      } catch (err) {
        console.warn('Error fetching creator products:', err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorProducts();
  }, [user]);

  if (!user) {
    return null;
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user.name}`;
  };

  // Calculate stats from products
  const activeProducts = products.filter(p => p.status?.toLowerCase() === 'active').length;
  const maintenanceProducts = products.filter(p => p.status?.toLowerCase() === 'maintenance').length;
  const totalSubscribers = products.reduce((sum, p) => sum + (p.subscriptionsCount || 0), 0);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Creator Studio
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {getWelcomeMessage()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, manage, and monetize your API products
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => window.location.href = '/studio/products/new'}>
            <Plus className="h-4 w-4" />
            Create New Product
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {!isLoading && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{products.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeProducts} active{maintenanceProducts > 0 ? `, ${maintenanceProducts} in maintenance` : ''}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$0</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span className="ml-1">Revenue tracking coming soon</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{totalSubscribers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all products
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls (30d)</CardTitle>
                <Activity className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Analytics coming soon
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground">Product Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                Overview of your API products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50">
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name || 'Unnamed API'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.subscriptionsCount || 0} subscribers
                        </p>
                      </div>
                      <Badge className={
                        product.status?.toLowerCase() === 'active'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : product.status?.toLowerCase() === 'maintenance'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }>
                        {product.status || 'Unknown'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No products yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first API product to start managing your services
                  </p>
                  <Button onClick={() => window.location.href = '/studio/products/new'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
