'use client';


import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Eye, 
  Settings,
  TrendingUp,
  Users,
  Activity,
  Globe,
  Lock,
  Star
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

interface ProductCardProps {
  product: ApiProduct;
  onViewAnalytics?: (product: ApiProduct) => void;
  onViewDetails?: (product: ApiProduct) => void;
  onManage?: (product: ApiProduct) => void;
  userRole: 'creator' | 'consumer' | 'admin';
}

export function ProductCard({ 
  product, 
  onViewAnalytics, 
  onViewDetails,
  onManage,
  userRole 
}: ProductCardProps) {
  const router = useRouter();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const formatNumber = (num: number | undefined): string => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const truncateDescription = (description: string, maxLength: number): string => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleManage = () => {
    // Navigate to studio's API product page for comprehensive management
    const productId = product.id;
    console.log('Navigating to product:', productId, 'Product name:', product.name);
    router.push(`/studio/products/${productId}`);
  };

  // For consumer view - Enhanced to match creator layout but with rating and only view details button
  if (userRole === 'consumer') {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/20 hover:bg-card/60 transition-all duration-200 h-full flex flex-col">
        <CardHeader className="pb-3">
          {/* Product Header with Avatar and Basic Info */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-border/50">
              <AvatarImage src={product.logo} alt={product.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {product.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-semibold text-foreground truncate cursor-help">
                      {product.name}
                    </h3>
                  </TooltipTrigger>
                  {product.name.length > 25 && (
                    <TooltipContent>
                      <p>{product.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              
              {/* Status and Privacy Badges */}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(product.status)}>
                  {getStatusText(product.status)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={product.isPublic 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }
                >
                  {product.isPublic ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground cursor-help">
                  {truncateDescription(product.description, 100)}
                </p>
              </TooltipTrigger>
              {product.description.length > 100 && (
                <TooltipContent className="max-w-sm">
                  <p>{product.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="pt-0 flex-1">
          {/* Metrics Grid - Rating instead of Calls */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Star className="h-4 w-4 text-yellow-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{(product.rating || 0).toFixed(1)}</p>
                <p className="text-muted-foreground">Rating</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Users className="h-4 w-4 text-green-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{formatNumber(product.totalSubscribers || 0)}</p>
                <p className="text-muted-foreground">Users</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Activity className="h-4 w-4 text-purple-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{(product.successRate || 0).toFixed(1)}%</p>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Base Path and Endpoints */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">base path:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono text-muted-foreground truncate cursor-help">
                      {product.basePath}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Base Path: {product.basePath}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{product.endpoints.length}</span> endpoint{product.endpoints.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {/* Single View Details Button */}
          <Button 
            className="w-full"
            onClick={() => onViewDetails?.(product)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Creator view with comprehensive data
  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/20 hover:bg-card/60 transition-all duration-200 h-full flex flex-col">
        <CardHeader className="pb-3">
          {/* Product Header with Avatar and Basic Info */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-border/50">
              <AvatarImage src={product.logo} alt={product.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {product.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-semibold text-foreground truncate cursor-help">
                      {product.name}
                    </h3>
                  </TooltipTrigger>
                  {product.name.length > 25 && (
                    <TooltipContent>
                      <p>{product.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              
              {/* Status and Privacy Badges */}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(product.status)}>
                  {getStatusText(product.status)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={product.isPublic 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }
                >
                  {product.isPublic ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground cursor-help">
                  {truncateDescription(product.description, 100)}
                </p>
              </TooltipTrigger>
              {product.description.length > 100 && (
                <TooltipContent className="max-w-sm">
                  <p>{product.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="pt-0 flex-1">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{formatNumber(product.totalCalls || 0)}</p>
                <p className="text-muted-foreground">Calls</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Users className="h-4 w-4 text-green-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{formatNumber(product.totalSubscribers || 0)}</p>
                <p className="text-muted-foreground">Users</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Activity className="h-4 w-4 text-purple-400" />
              <div className="text-xs">
                <p className="font-medium text-foreground">{(product.successRate || 0).toFixed(1)}%</p>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Base Path and Endpoints */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">base path:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono text-muted-foreground truncate cursor-help">
                      {product.basePath}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Base Path: {product.basePath}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{product.endpoints.length}</span> endpoint{product.endpoints.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {/* Single Manage Button */}
          <Button 
            className="w-full"
            onClick={handleManage}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Product
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}