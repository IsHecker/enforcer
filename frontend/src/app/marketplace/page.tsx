'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api-service';
import { toast } from 'sonner';

import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Globe,
  Zap,
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

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'Weather & Environment', name: 'Weather & Environment' },
  { id: 'Finance & Crypto', name: 'Finance & Crypto' },
  { id: 'News & Media', name: 'News & Media' },
  { id: 'AI & Machine Learning', name: 'AI & Machine Learning' },
  { id: 'Maps & Location', name: 'Maps & Location' },
  { id: 'Communication', name: 'Communication' },
  { id: 'E-commerce', name: 'E-commerce' },
  { id: 'Other', name: 'Other' },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10; // Items per page
  const { user } = useAuth();
  const router = useRouter();

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch public API services from backend with pagination
        const response = await api.apiServices.list({
          pageNumber: currentPage,
          pageSize: pageSize,
          isPublic: true, // Only fetch public APIs for marketplace
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined,
        });

        console.log('Marketplace API Response:', response);
        console.log('Response data type:', typeof response.data);
        console.log('Is data an array?', Array.isArray(response.data));

        if (response.success && response.data) {
          // Handle different response structures
          let apiServices: ApiServiceResponse[] = [];

          if (Array.isArray(response.data)) {
            // Direct array response
            apiServices = response.data;
          } else if (response.data && typeof response.data === 'object' && 'items' in response.data) {
            // Paged response with items array
            apiServices = (response.data as any).items || [];
          } else {
            console.error('Unexpected response data structure:', response.data);
            setError('Unexpected response format from server');
            toast.error('Unexpected response format from server');
            setIsLoading(false);
            return;
          }

          console.log('API Services to map:', apiServices);

          // Map backend services to frontend products
          const mappedProducts = apiServices.map(mapApiServiceToProduct);
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);

          // Handle pagination metadata
          if (response.data && typeof response.data === 'object' && 'totalPages' in response.data) {
            const pagedData = response.data as any;
            setTotalPages(pagedData.totalPages || 1);
            setTotalCount(pagedData.totalCount || mappedProducts.length);
          } else {
            // If no pagination metadata, assume single page
            setTotalPages(1);
            setTotalCount(mappedProducts.length);
          }

          toast.success(`Loaded ${mappedProducts.length} API${mappedProducts.length !== 1 ? 's' : ''} from marketplace`);
        } else {
          const errorMsg = response.error?.message || 'Failed to load marketplace APIs';
          console.error('API Error:', response.error);
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred while loading APIs';
        console.error('Error fetching marketplace products:', err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user, currentPage, selectedCategory, searchTerm]);

  if (!user) return null;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.totalSubscribers || 0) - (a.totalSubscribers || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleViewDetails = (product: ApiProduct) => {
    router.push(`/api-details/${product.id}?source=marketplace`);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              API Marketplace
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and integrate powerful APIs to enhance your applications
            </p>
          </div>
        </div>

        {/* Hero Section small */}
        {/* <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/40 shadow-none">
          <CardContent className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                Welcome to the API Marketplace
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Access a growing collection of high-quality APIs from trusted developers. Start with free tiers and scale.
              </p>
            </div>
          </CardContent>
        </Card> */}

        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
          <CardHeader className="text-center py-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl text-foreground">
              Welcome to the API Marketplace
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Access a growing collection of high-quality APIs from trusted developers.
              Start with free tiers and scale as your needs grow.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex w-full sm:max-w-md items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[220px] bg-secondary/50 border-border/40 h-10 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[160px] bg-secondary/50 border-border/40 h-10 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading marketplace APIs...</p>
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
              <h3 className="text-lg font-medium text-foreground">Failed to load APIs</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Featured APIs Section */}
        {!isLoading && !error && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-foreground">Available APIs</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 ml-2">
                {totalCount} total
              </Badge>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    userRole="consumer"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No APIs found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your search terms or browse different categories'
                    : 'No public APIs are currently available in the marketplace'}
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSearchInput('');
                  setSelectedCategory('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}


      </div>
    </DashboardLayout>
  );
}
