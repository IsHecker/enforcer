'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { UserManagementTable } from '@/components/admin/user-management-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import {
  Shield,
  Users,
  Server,
  AlertTriangle,
  TrendingUp,
  Settings,
  Database,
  Globe,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20 max-w-md">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Access Denied
              </h3>
              <p className="text-muted-foreground">
                You don't have permission to access the admin dashboard
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'High API Usage',
      description: 'Weather API experiencing 300% increase in traffic',
      timestamp: '5 minutes ago',
    },
    {
      id: '2',
      type: 'info',
      title: 'System Maintenance',
      description: 'Scheduled maintenance window starts in 2 hours',
      timestamp: '1 hour ago',
    },
    {
      id: '3',
      type: 'success',
      title: 'Security Update',
      description: 'Authentication system updated successfully',
      timestamp: '3 hours ago',
    },
  ];

  const platformStats = {
    totalUsers: 12540,
    totalProducts: 156,
    totalRevenue: 85420,
    systemUptime: 99.8,
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      default:
        return <Server className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Platform administration and system monitoring
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <Server className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Admin Access
              </Badge>
            </div>
          </div>

          {/* Platform Overview Stats */}
          <StatsCards role="admin" />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Analytics Chart */}
            <div className="lg:col-span-2">
              <AnalyticsChart role="admin" />
            </div>

            {/* System Alerts */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Recent system notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getAlertBadge(alert.type)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {alert.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground">Admin Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Common administrative tasks and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Users className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">User Management</div>
                    <div className="text-xs text-muted-foreground">Manage user accounts</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Database className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">System Logs</div>
                    <div className="text-xs text-muted-foreground">View system logs</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Settings className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Platform Settings</div>
                    <div className="text-xs text-muted-foreground">Configure platform</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <Globe className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">API Management</div>
                    <div className="text-xs text-muted-foreground">Monitor APIs</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Management Table */}
          <UserManagementTable />

          {/* System Health */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Current system status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">99.8%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">45ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">2.1M</div>
                  <div className="text-sm text-muted-foreground">API Calls/day</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">12GB</div>
                  <div className="text-sm text-muted-foreground">Data Transfer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}