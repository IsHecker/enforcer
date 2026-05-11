'use client';

import { useAuth } from '@/contexts/auth-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  TrendingUp,
  Zap,
  Globe,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user.name}`;
  };

  const getRoleSpecificContent = () => {
    // Admin gets special treatment
    if (user.role === 'admin') {
      return {
        title: 'Admin Dashboard',
        subtitle: 'Platform administration and user management',
        quickActions: [
          { label: 'User Management', icon: Plus, href: '/admin/users' },
          { label: 'Platform Analytics', icon: TrendingUp, href: '/admin/analytics' },
          { label: 'Content Management', icon: Globe, href: '/admin/content' },
        ],
      };
    }

    // Consumer-focused dashboard for all regular users
    const consumerActions = [
      { label: 'Browse API Marketplace', icon: Globe, href: '/marketplace' },
      { label: 'View Usage Stats', icon: TrendingUp, href: '/usage' },
      { label: 'Manage API Keys', icon: Zap, href: '/keys' },
    ];

    return {
      title: 'Dashboard',
      subtitle: 'Monitor your API subscriptions and usage',
      quickActions: consumerActions,
    };
  };

  const roleContent = getRoleSpecificContent();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getWelcomeMessage()}
            </h1>
            <p className="text-muted-foreground mt-1">
              {roleContent.subtitle}
            </p>
          </div>
        </div>

        <StatsCards role={user.role} />

        {(user.role !== 'admin') && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Quota Usage</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monthly API call usage across all subscriptions
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">3,420</div>
                  <div className="text-sm text-muted-foreground">of 5,000 calls</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={68.4} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">68.4% used</span>
                  <span className="text-muted-foreground">1,580 remaining</span>
                </div>
                {68.4 > 80 && (
                  <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <span>Approaching quota limit. Consider upgrading your plan.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart role={user.role} />
          </div>
          <div>
            <RecentActivity role={user.role} />
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {roleContent.quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center space-x-2 h-auto p-4 justify-start bg-background/50 hover:bg-background/80 border-border/50"
                    onClick={() => window.location.href = action.href}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}