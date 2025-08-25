'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Globe, 
  Zap, 
  Users, 
  Activity,
  Settings,
  ExternalLink,
  Trash2,
  Edit,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

interface ProductCardProps {
  product: ApiProduct;
  onEdit?: (product: ApiProduct) => void;
  onDelete?: (product: ApiProduct) => void;
  onViewAnalytics?: (product: ApiProduct) => void;
  userRole: 'creator' | 'consumer' | 'admin';
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  userRole 
}: ProductCardProps) {
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

  const getStatsForRole = () => {
    if (userRole === 'consumer') {
      return {
        rating: 4.8,
        totalUsers: Math.floor(Math.random() * 10000) + 5000,
        uptime: 99.2 + Math.random() * 0.8,
      };
    } else {
      return {
        totalCalls: Math.floor(Math.random() * 50000) + 10000,
        subscribers: Math.floor(Math.random() * 1000) + 100,
        uptime: 99.2 + Math.random() * 0.8,
      };
    }
  };

  const stats = getStatsForRole();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20 hover:bg-card/60 transition-all duration-200 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={product.logo} alt={product.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {product.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(product.status)}>
                  {product.status}
                </Badge>
                {product.isPublic ? (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline">Private</Badge>
                )}
              </div>
            </div>
          </div>
          
          {userRole === 'creator' && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit?.(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete?.(product)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </CardDescription>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {userRole === 'consumer' ? (
            <>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.rating}⭐
                </div>
                <div className="text-xs text-muted-foreground">
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.uptime.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Uptime
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.totalCalls.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Activity className="h-3 w-3 mr-1" />
                  API Calls
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.subscribers}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  Subscribers
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {stats.uptime.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Uptime
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Base Path: {product.basePath}</span>
          <span>{product.endpoints.length} endpoints</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        {userRole === 'consumer' ? (
          <div className="flex items-center space-x-2 w-full">
            <Button 
              className="flex-1"
              onClick={() => onEdit?.(product)}
            >
              Subscribe
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = `/api-details/${product.id}?source=marketplace`}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.href = `/api-product/${product.id}`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewAnalytics?.(product)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}