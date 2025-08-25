'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && (
            <Badge
              variant="outline"
              className={`flex items-center space-x-1 ${trend.isPositive
                  ? 'text-green-400 border-green-500/30 bg-green-500/10'
                  : 'text-red-400 border-red-500/30 bg-red-500/10'
                }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  role: 'creator' | 'consumer' | 'admin';
}

export function StatsCards({ role }: StatsCardsProps) {
  const getStatsForRole = () => {
    switch (role) {
      case 'creator':
        return [
          {
            title: 'Total API Calls',
            value: '45,231',
            description: 'Across all products',
            icon: <Activity className="h-4 w-4" />,
            trend: { value: 12.5, isPositive: true },
          },
          {
            title: 'Active Subscribers',
            value: '2,350',
            description: 'Paying customers',
            icon: <Users className="h-4 w-4" />,
            trend: { value: 8.3, isPositive: true },
          },
          {
            title: 'Monthly Revenue',
            value: '$12,450',
            description: 'This month',
            icon: <DollarSign className="h-4 w-4" />,
            trend: { value: 15.2, isPositive: true },
          },
          {
            title: 'API Products',
            value: '8',
            description: '3 active, 5 in development',
            icon: <Zap className="h-4 w-4" />,
            trend: { value: 25.0, isPositive: true },
          },
        ];

      case 'consumer':
        return [
          {
            title: 'API Calls Used',
            value: '3,420',
            description: 'This month (68% of quota)',
            icon: <Activity className="h-4 w-4" />,
            trend: { value: 23.1, isPositive: false },
          },
          {
            title: 'Active Subscriptions',
            value: '5',
            description: 'API products subscribed',
            icon: <Zap className="h-4 w-4" />,
            trend: { value: 40.0, isPositive: true },
          },
          {
            title: 'Monthly Spend',
            value: '$89.50',
            description: 'Current bill cycle',
            icon: <DollarSign className="h-4 w-4" />,
            trend: { value: 12.3, isPositive: false },
          },
          {
            title: 'Success Rate',
            value: '99.2%',
            description: 'API call success rate',
            icon: <TrendingUp className="h-4 w-4" />,
            trend: { value: 0.3, isPositive: true },
          },
        ];

      case 'admin':
        return [
          {
            title: 'Platform Users',
            value: '12,540',
            description: '8,350 consumers, 4,190 creators',
            icon: <Users className="h-4 w-4" />,
            trend: { value: 18.7, isPositive: true },
          },
          {
            title: 'Total API Calls',
            value: '2.5M',
            description: 'This month across platform',
            icon: <Activity className="h-4 w-4" />,
            trend: { value: 35.2, isPositive: true },
          },
          {
            title: 'Platform Revenue',
            value: '$85,420',
            description: 'Monthly recurring revenue',
            icon: <DollarSign className="h-4 w-4" />,
            trend: { value: 22.8, isPositive: true },
          },
          {
            title: 'API Products',
            value: '156',
            description: '134 active, 22 pending review',
            icon: <Zap className="h-4 w-4" />,
            trend: { value: 45.3, isPositive: true },
          },
        ];

      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}