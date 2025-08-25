'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Key, 
  Users,
  Zap,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'New API subscription',
    description: 'Weather API - Pro Plan',
    timestamp: '2 minutes ago',
    user: {
      name: 'Alice Johnson',
      avatar: '',
    },
    metadata: { revenue: 29.99 },
  },
  {
    id: '2',
    type: 'warning',
    title: 'Rate limit exceeded',
    description: 'Crypto API endpoint /prices',
    timestamp: '5 minutes ago',
    metadata: { endpoint: '/api/crypto/prices', count: 1250 },
  },
  {
    id: '3',
    type: 'info',
    title: 'New API key generated',
    description: 'Development environment',
    timestamp: '10 minutes ago',
    user: {
      name: 'Bob Smith',
    },
  },
  {
    id: '4',
    type: 'success',
    title: 'Payment processed',
    description: 'Monthly subscription renewal',
    timestamp: '15 minutes ago',
    metadata: { amount: 89.99 },
  },
  {
    id: '5',
    type: 'error',
    title: 'API endpoint down',
    description: 'Maps API experiencing issues',
    timestamp: '20 minutes ago',
    metadata: { endpoint: '/api/maps/geocode', status: 500 },
  },
  {
    id: '6',
    type: 'info',
    title: 'Plan upgrade',
    description: 'Free to Pro upgrade completed',
    timestamp: '25 minutes ago',
    user: {
      name: 'Carol Davis',
    },
  },
  {
    id: '7',
    type: 'success',
    title: 'High API performance',
    description: '99.8% uptime this week',
    timestamp: '30 minutes ago',
  },
];

interface RecentActivityProps {
  role: 'creator' | 'consumer' | 'admin';
}

export function RecentActivity({ role }: RecentActivityProps) {
  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('payment') || title.toLowerCase().includes('subscription')) {
      return <DollarSign className="h-4 w-4" />;
    }
    if (title.toLowerCase().includes('api key')) {
      return <Key className="h-4 w-4" />;
    }
    if (title.toLowerCase().includes('user') || title.toLowerCase().includes('upgrade')) {
      return <Users className="h-4 w-4" />;
    }
    if (title.toLowerCase().includes('endpoint') || title.toLowerCase().includes('api')) {
      return <Zap className="h-4 w-4" />;
    }

    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'info':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getFilteredActivities = () => {
    // Filter activities based on user role
    switch (role) {
      case 'creator':
        return [
          {
            id: '1',
            type: 'success',
            title: 'New API subscription',
            description: 'Weather API - Pro Plan',
            timestamp: '2 minutes ago',
            user: {
              name: 'Alice Johnson',
              avatar: '',
            },
            metadata: { revenue: 29.99 },
          },
          {
            id: '2',
            type: 'warning',
            title: 'Rate limit exceeded',
            description: 'Crypto API endpoint /prices',
            timestamp: '5 minutes ago',
            metadata: { endpoint: '/api/crypto/prices', count: 1250 },
          },
          {
            id: '3',
            type: 'success',
            title: 'Product performance',
            description: 'Maps API - 99.8% uptime this week',
            timestamp: '10 minutes ago',
          },
          {
            id: '4',
            type: 'success',
            title: 'Payment received',
            description: 'Pro plan subscription - $29.99',
            timestamp: '15 minutes ago',
            metadata: { amount: 29.99 },
          },
          {
            id: '5',
            type: 'info',
            title: 'New subscriber',
            description: 'Weather API gained a new Pro subscriber',
            timestamp: '20 minutes ago',
            user: {
              name: 'Bob Wilson',
            },
          },
        ];
      
      case 'consumer':
        return [
          {
            id: '1',
            type: 'success',
            title: 'API call successful',
            description: 'Weather API - Current conditions',
            timestamp: '2 minutes ago',
            metadata: { endpoint: '/weather/current' },
          },
          {
            id: '2',
            type: 'info',
            title: 'Quota usage update',
            description: '68% of monthly quota used',
            timestamp: '5 minutes ago',
            metadata: { usage: '3,420 calls' },
          },
          {
            id: '3',
            type: 'success',
            title: 'New API key generated',
            description: 'Development environment key created',
            timestamp: '10 minutes ago',
          },
          {
            id: '4',
            type: 'success',
            title: 'Payment processed',
            description: 'Monthly subscription renewed - $89.50',
            timestamp: '15 minutes ago',
            metadata: { amount: 89.50 },
          },
          {
            id: '5',
            type: 'info',
            title: 'Subscription updated',
            description: 'Maps API - Upgraded to Pro plan',
            timestamp: '20 minutes ago',
          },
          {
            id: '6',
            type: 'success',
            title: 'API performance',
            description: '99.2% success rate this week',
            timestamp: '25 minutes ago',
          },
        ];
      
      case 'admin':
        return mockActivities;
      
      default:
        return [];
    }
  };

  const activities = getFilteredActivities();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest events and notifications
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getBadgeVariant(activity.type)}`}>
                  {getIcon(activity.type, activity.title)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground ml-2">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  {activity.user && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {activity.user.name}
                      </span>
                    </div>
                  )}

                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <Badge
                          key={key}
                          variant="outline"
                          className="text-xs bg-background/50"
                        >
                          {key === 'revenue' || key === 'amount' ? `$${value}` : 
                           key === 'count' ? `${value} calls` :
                           key === 'status' ? `Status: ${value}` :
                           `${key}: ${value}`}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}