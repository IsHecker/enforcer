'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api-service';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';
import type { ApiServiceResponse } from '@/types/backend-api';

// Map backend API service to frontend ApiProduct type
function mapApiServiceToProduct(service: ApiServiceResponse): ApiProduct {
  return {
    id: service.id,
    name: service.name || 'Unnamed API',
    description: service.description || '',
    basePath: service.serviceKey || '/api',
    backendUrl: service.targetBaseUrl || '',
    logo: service.logoUrl || undefined,
    isPublic: service.isPublic,
    status: (service.status?.toLowerCase() as 'active' | 'inactive' | 'maintenance') || 'active',
    createdBy: '',
    endpoints: [],
    plans: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: service.version || undefined,
    category: service.category || undefined,
    totalSubscribers: service.subscriptionsCount,
    totalCalls: 0,
    successRate: 0,
  };
}

export default function StudioProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch API services from backend
        const response = await api.apiServices.list({
          pageNumber: 1,
          pageSize: 10,
          search: searchTerm || undefined,
        });

        if (response.success && response.data) {
          // Map backend services to frontend products
          const items = Array.isArray(response.data)
            ? response.data
            : ((response.data as any).items || []);
          const mappedProducts = items.map(mapApiServiceToProduct);
          setProducts(mappedProducts);

          if (mappedProducts.length === 0) {
            console.log('No API products found');
          }
        } else {
          const errorMsg = response.error?.message || 'Failed to load products';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred while loading products';
        console.error('Error fetching products:', err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user, searchTerm]);

  if (!user) return null;

  const filteredProducts = products.filter(product => {
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesStatus;
  });

  const handleViewAnalytics = (product: ApiProduct) => {
    console.log('View analytics:', product.id);
    router.push(`/studio/products/${product.id}`);
  };

  const handleManageProduct = (product: ApiProduct) => {
    console.log('Manage product:', product.id);
    router.push(`/studio/products/${product.id}`);
  };

  const handleCreateProduct = () => {
    router.push('/studio/products/new');
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-foreground">
                My API Products
              </h1>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-purple-400">
                  {isLoading ? '...' : filteredProducts.length}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage your API products and monitor their performance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:max-w-md items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearchTerm(searchInput);
              }}
              className="pl-9 bg-secondary/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => setSearchTerm(searchInput)}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[160px] bg-secondary/50 border-border/40 h-10 text-sm">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 h-10 border border-border/40 rounded-md p-1 bg-secondary/50">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode('grid')}
              disabled={isLoading}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode('list')}
              disabled={isLoading}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your API products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Failed to load products</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewAnalytics={handleViewAnalytics}
              onManage={handleManageProduct}
              userRole={user.role}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Create your first API product to get started'}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSearchInput('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          ) : (
            <Button onClick={handleCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
