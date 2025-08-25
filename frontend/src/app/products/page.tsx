'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

const mockProducts: ApiProduct[] = [
  {
    id: '1',
    name: 'Weather API',
    description: 'Real-time weather data and forecasts for any location worldwide with historical data access',
    basePath: '/weather',
    backendUrl: 'https://api.weather.com',
    logo: '',
    isPublic: true,
    status: 'active',
    createdBy: 'creator-1',
    plans: ['free', 'pro'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    endpoints: [
      {
        id: '1',
        productId: '1',
        path: '/current',
        method: 'GET',
        description: 'Get current weather',
        isActive: true,
        planRestrictions: [],
      },
      {
        id: '2',
        productId: '1',
        path: '/forecast',
        method: 'GET',
        description: 'Get weather forecast',
        isActive: true,
        planRestrictions: ['pro'],
      },
    ],
  },
  {
    id: '2',
    name: 'Crypto Prices API',
    description: 'Real-time cryptocurrency prices, market data, and trading information',
    basePath: '/crypto',
    backendUrl: 'https://api.crypto.com',
    isPublic: true,
    status: 'active',
    createdBy: 'creator-1',
    plans: ['free', 'pro', 'enterprise'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    endpoints: [
      {
        id: '3',
        productId: '2',
        path: '/prices',
        method: 'GET',
        description: 'Get crypto prices',
        isActive: true,
        planRestrictions: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Maps & Geocoding API',
    description: 'Location services including geocoding, reverse geocoding, and mapping data',
    basePath: '/maps',
    backendUrl: 'https://api.maps.com',
    isPublic: false,
    status: 'maintenance',
    createdBy: 'creator-1',
    plans: ['pro', 'enterprise'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    endpoints: [
      {
        id: '4',
        productId: '3',
        path: '/geocode',
        method: 'GET',
        description: 'Geocode addresses',
        isActive: false,
        planRestrictions: ['pro'],
      },
    ],
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  if (!user) return null;

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditProduct = (product: ApiProduct) => {
    console.log('Edit product:', product.id);
  };

  const handleDeleteProduct = (product: ApiProduct) => {
    console.log('Delete product:', product.id);
  };

  const handleViewAnalytics = (product: ApiProduct) => {
    console.log('View analytics:', product.id);
  };

  const handleCreateProduct = () => {
    console.log('Create new product');
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My API Products
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your API products and monitor their performance
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {filteredProducts.length} products
              </Badge>
              <Button onClick={handleCreateProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-background/50 border-border/50"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onViewAnalytics={handleViewAnalytics}
                  userRole={user.role}
                />
              ))}
            </div>
          ) : (
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
                  : user.role === 'creator'
                    ? 'Create your first API product to get started'
                    : 'No products available in the marketplace'
                }
              </p>
              {user.role === 'creator' && !searchTerm && statusFilter === 'all' && (
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}