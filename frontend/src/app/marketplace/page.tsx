'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Globe,
  Zap,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

const featuredProducts: ApiProduct[] = [
  {
    id: '1',
    name: 'Weather API',
    description: 'Real-time weather data and forecasts for any location worldwide with historical data access',
    basePath: '/weather',
    backendUrl: 'https://api.weather.com',
    isPublic: true,
    status: 'active',
    createdBy: 'weather-corp',
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
    description: 'Real-time cryptocurrency prices, market data, and trading information with portfolio tracking',
    basePath: '/crypto',
    backendUrl: 'https://api.crypto.com',
    isPublic: true,
    status: 'active',
    createdBy: 'crypto-data-co',
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
    name: 'News Aggregator API',
    description: 'Curated news articles from thousands of sources with sentiment analysis and categorization',
    basePath: '/news',
    backendUrl: 'https://api.news.com',
    isPublic: true,
    status: 'active',
    createdBy: 'news-corp',
    plans: ['free', 'pro'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    endpoints: [
      {
        id: '4',
        productId: '3',
        path: '/articles',
        method: 'GET',
        description: 'Get news articles',
        isActive: true,
        planRestrictions: [],
      },
    ],
  },
  {
    id: '4',
    name: 'Image Processing API',
    description: 'Advanced image processing, optimization, and AI-powered analysis for modern applications',
    basePath: '/images',
    backendUrl: 'https://api.images.com',
    isPublic: true,
    status: 'active',
    createdBy: 'image-ai-corp',
    plans: ['pro', 'enterprise'],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    endpoints: [
      {
        id: '5',
        productId: '4',
        path: '/process',
        method: 'POST',
        description: 'Process images',
        isActive: true,
        planRestrictions: ['pro'],
      },
    ],
  },
];

const categories = [
  { id: 'all', name: 'All Categories', count: featuredProducts.length },
  { id: 'weather', name: 'Weather & Environment', count: 1 },
  { id: 'finance', name: 'Finance & Crypto', count: 1 },
  { id: 'news', name: 'News & Media', count: 1 },
  { id: 'ai', name: 'AI & Machine Learning', count: 1 },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { user } = useAuth();

  if (!user) return null;

  const getCategoryForProduct = (product: ApiProduct): string => {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();

    if (name.includes('weather') || description.includes('weather')) return 'weather';
    if (name.includes('crypto') || name.includes('finance') || description.includes('crypto') || description.includes('finance')) return 'finance';
    if (name.includes('news') || description.includes('news') || description.includes('media')) return 'news';
    if (name.includes('image') || name.includes('ai') || description.includes('ai') || description.includes('machine learning') || description.includes('processing')) return 'ai';

    return 'other';
  };

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || getCategoryForProduct(product) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = (product: ApiProduct) => {
    toast.success(`Subscribed to ${product.name}!`);
    console.log('Subscribe to product:', product.id);
  };

  return (
    <RoleGuard allowedRoles={['consumer']}>
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

            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {filteredProducts.length} APIs available
            </Badge>
          </div>

          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-border/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">
                Welcome to the API Marketplace
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access a growing collection of high-quality APIs from trusted developers.
                Start with free tiers and scale as your needs grow.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search and Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search APIs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                      <TrendingUp className="h-4 w-4 mr-2" />
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
            </CardContent>
          </Card>

          {/* Featured APIs Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-foreground">Featured APIs</h2>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={(product) => handleSubscribe(product)}
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
                  Try adjusting your search terms or browse different categories
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          {/* Categories Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
              {selectedCategory !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Filter
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.filter(cat => cat.id !== 'all').map((category) => (
                <Card
                  key={category.id}
                  className={`backdrop-blur-sm border-border/20 hover:bg-card/60 transition-colors cursor-pointer ${selectedCategory === category.id
                      ? 'bg-primary/20 border-primary/40 ring-1 ring-primary/20'
                      : 'bg-card/50'
                    }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${selectedCategory === category.id
                        ? 'bg-primary/30'
                        : 'bg-primary/20'
                      }`}>
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className={`font-medium mb-1 ${selectedCategory === category.id
                        ? 'text-primary'
                        : 'text-foreground'
                      }`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} API{category.count !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}