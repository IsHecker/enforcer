'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  UserMinus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Mail,
  Calendar,
  MoreHorizontal,
  Shield,
  AlertTriangle,
} from 'lucide-react';

interface Consumer {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  lastActive: string;
  totalApiCalls: number;
  monthlySpend: number;
  subscriptions: {
    apiId: string;
    apiName: string;
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    revenue: number;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'suspended';
}

const mockConsumers: Consumer[] = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@devcompany.com',
    joinedAt: '2024-01-15T00:00:00Z',
    lastActive: '2024-06-20T14:30:00Z',
    totalApiCalls: 45620,
    monthlySpend: 89.00,
    subscriptions: [
      {
        apiId: '1',
        apiName: 'Weather API',
        plan: 'Pro',
        status: 'active',
        revenue: 29.00,
      },
      {
        apiId: '2',
        apiName: 'Crypto Prices API',
        plan: 'Enterprise',
        status: 'active',
        revenue: 60.00,
      },
    ],
    riskLevel: 'low',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Analytics',
    email: 'sarah@startup.io',
    joinedAt: '2024-02-08T00:00:00Z',
    lastActive: '2024-06-19T09:15:00Z',
    totalApiCalls: 128350,
    monthlySpend: 149.00,
    subscriptions: [
      {
        apiId: '1',
        apiName: 'Weather API',
        plan: 'Enterprise',
        status: 'active',
        revenue: 99.00,
      },
      {
        apiId: '3',
        apiName: 'Maps API',
        plan: 'Pro',
        status: 'active',
        revenue: 50.00,
      },
    ],
    riskLevel: 'low',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Builder',
    email: 'mike@buildtools.com',
    joinedAt: '2024-03-12T00:00:00Z',
    lastActive: '2024-06-10T16:45:00Z',
    totalApiCalls: 8920,
    monthlySpend: 29.00,
    subscriptions: [
      {
        apiId: '2',
        apiName: 'Crypto Prices API',
        plan: 'Pro',
        status: 'cancelled',
        revenue: 0.00,
      },
    ],
    riskLevel: 'medium',
    status: 'active',
  },
  {
    id: '4',
    name: 'Lisa Enterprise',
    email: 'lisa@bigcorp.com',
    joinedAt: '2024-01-05T00:00:00Z',
    lastActive: '2024-06-21T11:20:00Z',
    totalApiCalls: 356720,
    monthlySpend: 299.00,
    subscriptions: [
      {
        apiId: '1',
        apiName: 'Weather API',
        plan: 'Enterprise',
        status: 'active',
        revenue: 99.00,
      },
      {
        apiId: '2',
        apiName: 'Crypto Prices API',
        plan: 'Enterprise',
        status: 'active',
        revenue: 99.00,
      },
      {
        apiId: '3',
        apiName: 'Maps API',
        plan: 'Enterprise',
        status: 'active',
        revenue: 101.00,
      },
    ],
    riskLevel: 'low',
    status: 'active',
  },
  {
    id: '5',
    name: 'Alex Tester',
    email: 'alex@testingco.com',
    joinedAt: '2024-05-20T00:00:00Z',
    lastActive: '2024-06-01T08:30:00Z',
    totalApiCalls: 125600,
    monthlySpend: 0.00,
    subscriptions: [],
    riskLevel: 'high',
    status: 'suspended',
  },
];

export default function ConsumersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [consumers] = useState<Consumer[]>(mockConsumers);
  const { user } = useAuth();

  if (!user) return null;

  const filteredConsumers = consumers.filter(consumer => {
    const matchesSearch = consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consumer.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || consumer.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalRevenue = consumers.reduce((sum, consumer) => sum + consumer.monthlySpend, 0);
  const activeConsumers = consumers.filter(c => c.status === 'active').length;
  const totalApiCalls = consumers.reduce((sum, consumer) => sum + consumer.totalApiCalls, 0);

  const handleSuspendConsumer = (consumer: Consumer) => {
    toast.success(`${consumer.name} has been suspended`);
  };

  const handleActivateConsumer = (consumer: Consumer) => {
    toast.success(`${consumer.name} has been activated`);
  };

  const handleContactConsumer = (consumer: Consumer) => {
    window.open(`mailto:${consumer.email}?subject=Regarding your API subscription`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Consumer Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your API consumers, subscriptions, and revenue
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {filteredConsumers.length} consumers
              </Badge>
            </div>
          </div>

          {/* Consumer Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Consumers</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{activeConsumers}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="ml-1">this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+8%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {totalApiCalls.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all consumers
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Revenue/User</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalRevenue / activeConsumers)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per active consumer
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search consumers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-background/50 border-border/50"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-background/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32 bg-background/50 border-border/50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Consumers Table */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle>Consumer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Consumer</TableHead>
                    <TableHead>Subscriptions</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsumers.map((consumer) => (
                    <TableRow key={consumer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consumer.name}</div>
                          <div className="text-sm text-muted-foreground">{consumer.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined {formatDate(consumer.joinedAt)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {consumer.subscriptions.length === 0 ? (
                            <Badge variant="outline" className="text-gray-400 border-gray-500/30">
                              No subscriptions
                            </Badge>
                          ) : (
                            consumer.subscriptions.map((sub, index) => (
                              <div key={index} className="text-xs">
                                <span className="font-medium">{sub.apiName}</span>
                                <Badge
                                  className={`ml-1 text-xs ${sub.status === 'active'
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                      : sub.status === 'cancelled'
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}
                                >
                                  {sub.plan}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{consumer.totalApiCalls.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">total calls</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-green-600">
                          {formatCurrency(consumer.monthlySpend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskBadgeColor(consumer.riskLevel)}>
                          {consumer.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(consumer.status)}>
                          {consumer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(consumer.lastActive)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContactConsumer(consumer)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          {consumer.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspendConsumer(consumer)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateConsumer(consumer)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Risk Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Risk Analysis & Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <h4 className="font-medium text-red-600">High Risk Consumers</h4>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {consumers.filter(c => c.riskLevel === 'high').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require immediate attention or suspension
                  </p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-yellow-600" />
                    </div>
                    <h4 className="font-medium text-yellow-600">Churn Risk</h4>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">3</div>
                  <p className="text-sm text-muted-foreground">
                    Consumers with decreased usage patterns
                  </p>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-600">Growth Opportunity</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">7</div>
                  <p className="text-sm text-muted-foreground">
                    Consumers ready for plan upgrades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}