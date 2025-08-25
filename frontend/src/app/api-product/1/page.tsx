'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { SecuritySettings } from '@/components/products/security-settings';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Package,
  Settings,
  BarChart3,
  Globe,
  Shield,
  Key,
  Users,
  Activity,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Database,
  Code,
  FileText,
  Save,
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  isActive: boolean;
  planRestrictions: string[];
  rateLimit: number;
  quotaLimit: number;
  backendUrl: string;
  responseTime: number;
  errorRate: number;
  callsToday: number;
}

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  basePath: string;
  backendUrl: string;
  logo: string;
  isPublic: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  version: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  totalSubscribers: number;
  totalRevenue: number;
  totalCalls: number;
  successRate: number;
  endpoints: ApiEndpoint[];
  createdBy: string;
  plans: string[];
}

const mockApiProduct: ApiProduct = {
  id: '1',
  name: 'Weather API',
  description: 'Real-time weather data and forecasts for any location worldwide with historical data access',
  basePath: '/weather',
  backendUrl: 'https://api.weather.com',
  logo: '',
  isPublic: true,
  status: 'active',
  version: 'v1.2.1',
  category: 'Weather & Environment',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-15T00:00:00Z',
  totalSubscribers: 89,
  totalRevenue: 12400,
  totalCalls: 245680,
  successRate: 99.2,
  endpoints: [
    {
      id: '1',
      path: '/current',
      method: 'GET',
      description: 'Get current weather conditions for a specific location',
      isActive: true,
      planRestrictions: [],
      rateLimit: 100,
      quotaLimit: 1000,
      backendUrl: 'https://api.weather.com/v1/current',
      responseTime: 120,
      errorRate: 0.5,
      callsToday: 1240,
    },
    {
      id: '2',
      path: '/forecast',
      method: 'GET',
      description: 'Get weather forecast for up to 7 days',
      isActive: true,
      planRestrictions: ['pro', 'enterprise'],
      rateLimit: 50,
      quotaLimit: 500,
      backendUrl: 'https://api.weather.com/v1/forecast',
      responseTime: 180,
      errorRate: 0.8,
      callsToday: 650,
    },
    {
      id: '3',
      path: '/historical',
      method: 'GET',
      description: 'Access historical weather data',
      isActive: true,
      planRestrictions: ['enterprise'],
      rateLimit: 25,
      quotaLimit: 100,
      backendUrl: 'https://api.weather.com/v1/historical',
      responseTime: 350,
      errorRate: 1.2,
      callsToday: 89,
    },
    {
      id: '4',
      path: '/alerts',
      method: 'POST',
      description: 'Set up weather alerts and notifications',
      isActive: false,
      planRestrictions: ['pro', 'enterprise'],
      rateLimit: 10,
      quotaLimit: 50,
      backendUrl: 'https://api.weather.com/v1/alerts',
      responseTime: 200,
      errorRate: 2.1,
      callsToday: 0,
    },
  ],
  createdBy: "Admin Creator",
  plans: ["free", "pro"]
};

const usageData = [
  { name: 'Mon', calls: 2400, errors: 12, responseTime: 120 },
  { name: 'Tue', calls: 1398, errors: 8, responseTime: 115 },
  { name: 'Wed', calls: 9800, errors: 45, responseTime: 135 },
  { name: 'Thu', calls: 3908, errors: 21, responseTime: 125 },
  { name: 'Fri', calls: 4800, errors: 18, responseTime: 110 },
  { name: 'Sat', calls: 3800, errors: 15, responseTime: 108 },
  { name: 'Sun', calls: 4300, errors: 22, responseTime: 118 },
];

export default function ApiProductDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [apiProduct, setApiProduct] = useState<ApiProduct>(mockApiProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    path: '',
    method: 'GET' as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    description: '',
    backendUrl: '',
  });
  const { user } = useAuth();

  if (!user) return null;

  const handleSaveProduct = () => {
    toast.success('API product updated successfully');
    setIsEditing(false);
  };

  const handleToggleEndpoint = (endpointId: string) => {
    setApiProduct(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint =>
        endpoint.id === endpointId
          ? { ...endpoint, isActive: !endpoint.isActive }
          : endpoint
      ),
    }));
    toast.success('Endpoint status updated');
  };

  const handleAddEndpoint = () => {
    if (!newEndpoint.path || !newEndpoint.description || !newEndpoint.backendUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const endpoint: ApiEndpoint = {
      id: Date.now().toString(),
      path: newEndpoint.path,
      method: newEndpoint.method,
      description: newEndpoint.description,
      isActive: true,
      planRestrictions: [],
      rateLimit: 100,
      quotaLimit: 1000,
      backendUrl: newEndpoint.backendUrl,
      responseTime: 0,
      errorRate: 0,
      callsToday: 0,
    };

    setApiProduct(prev => ({
      ...prev,
      endpoints: [...prev.endpoints, endpoint],
    }));

    setNewEndpoint({
      path: '',
      method: 'GET',
      description: '',
      backendUrl: '',
    });

    toast.success('New endpoint added successfully');
  };

  const handleDeleteEndpoint = (endpointId: string) => {
    setApiProduct(prev => ({
      ...prev,
      endpoints: prev.endpoints.filter(endpoint => endpoint.id !== endpointId),
    }));
    toast.success('Endpoint deleted successfully');
  };

  const copyEndpointUrl = (endpoint: ApiEndpoint) => {
    const url = `https://api.proxyapi.dev${apiProduct.basePath}${endpoint.path}`;
    navigator.clipboard.writeText(url);
    toast.success('Endpoint URL copied to clipboard');
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PATCH': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {apiProduct.name}
                  </h1>
                  <Badge className={getStatusColor(apiProduct.status)}>
                    {apiProduct.status}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {apiProduct.version}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {apiProduct.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>Category: {apiProduct.category}</span>
                  <span>•</span>
                  <span>Base Path: {apiProduct.basePath}</span>
                  <span>•</span>
                  <span>Subscribers: {apiProduct.totalSubscribers}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button onClick={handleSaveProduct}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="security">Security & Controls</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Performance Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{apiProduct.totalSubscribers}</div>
                    <p className="text-xs text-muted-foreground">Active subscriptions</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <Zap className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(apiProduct.totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                    <Activity className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {apiProduct.totalCalls.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Total requests</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {apiProduct.successRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">Uptime reliability</p>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Chart */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    role='consumer'
                    data={usageData}
                    dataKey="calls"
                    className="h-80"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              {/* Add New Endpoint */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Endpoint</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="endpointPath">Path</Label>
                      <Input
                        id="endpointPath"
                        placeholder="/new-endpoint"
                        value={newEndpoint.path}
                        onChange={(e) => setNewEndpoint(prev => ({ ...prev, path: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endpointMethod">Method</Label>
                      <Select
                        value={newEndpoint.method}
                        onValueChange={(value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') =>
                          setNewEndpoint(prev => ({ ...prev, method: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endpointBackend">Backend URL</Label>
                      <Input
                        id="endpointBackend"
                        placeholder="https://api.example.com/endpoint"
                        value={newEndpoint.backendUrl}
                        onChange={(e) => setNewEndpoint(prev => ({ ...prev, backendUrl: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddEndpoint} className="w-full">
                        Add Endpoint
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endpointDescription">Description</Label>
                    <Textarea
                      id="endpointDescription"
                      placeholder="Describe what this endpoint does..."
                      value={newEndpoint.description}
                      onChange={(e) => setNewEndpoint(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints List */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Plan Access</TableHead>
                        <TableHead>Rate Limit</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Today's Calls</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiProduct.endpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{apiProduct.basePath}{endpoint.path}</div>
                              <div className="text-sm text-muted-foreground">{endpoint.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMethodColor(endpoint.method)}>
                              {endpoint.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={endpoint.isActive}
                                onCheckedChange={() => handleToggleEndpoint(endpoint.id)}
                              />
                              <span className="text-sm">
                                {endpoint.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {endpoint.planRestrictions.length === 0 ? (
                              <Badge variant="outline">All Plans</Badge>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {endpoint.planRestrictions.map((plan) => (
                                  <Badge key={plan} variant="secondary" className="text-xs">
                                    {plan}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {endpoint.rateLimit}/min
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{endpoint.responseTime}ms</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {endpoint.errorRate < 1 ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                )}
                                <span className="text-sm">{endpoint.errorRate}% errors</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{endpoint.callsToday.toLocaleString()}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyEndpointUrl(endpoint)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEndpoint(endpoint.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Security & Operational Controls</h2>
              </div>

              <SecuritySettings product={mockApiProduct} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle>Endpoint Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiProduct.endpoints.map((endpoint) => (
                        <div key={endpoint.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <div className="font-medium">{endpoint.path}</div>
                            <div className="text-sm text-muted-foreground">
                              {endpoint.callsToday} calls today
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{endpoint.responseTime}ms</div>
                            <div className="text-sm text-muted-foreground">
                              {endpoint.errorRate}% error rate
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle>Subscriber Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      role='creator'
                      data={usageData}
                      dataKey="calls"
                      className="h-64"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle>API Product Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={apiProduct.name}
                        disabled={!isEditing}
                        onChange={(e) => setApiProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={apiProduct.description}
                        disabled={!isEditing}
                        onChange={(e) => setApiProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="basePath">Base Path</Label>
                      <Input
                        id="basePath"
                        value={apiProduct.basePath}
                        disabled={!isEditing}
                        onChange={(e) => setApiProduct(prev => ({ ...prev, basePath: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backendUrl">Backend URL</Label>
                      <Input
                        id="backendUrl"
                        value={apiProduct.backendUrl}
                        disabled={!isEditing}
                        onChange={(e) => setApiProduct(prev => ({ ...prev, backendUrl: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle>Security & Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public API</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this API discoverable in the marketplace
                        </p>
                      </div>
                      <Switch
                        checked={apiProduct.isPublic}
                        disabled={!isEditing}
                        onCheckedChange={(checked) =>
                          setApiProduct(prev => ({ ...prev, isPublic: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>API Status</Label>
                      <Select
                        value={apiProduct.status}
                        disabled={!isEditing}
                        onValueChange={(value: 'active' | 'inactive' | 'maintenance') =>
                          setApiProduct(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={apiProduct.version}
                        disabled={!isEditing}
                        onChange={(e) => setApiProduct(prev => ({ ...prev, version: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={apiProduct.category}
                        disabled={!isEditing}
                        onValueChange={(value) => setApiProduct(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weather & Environment">Weather & Environment</SelectItem>
                          <SelectItem value="Finance & Crypto">Finance & Crypto</SelectItem>
                          <SelectItem value="News & Media">News & Media</SelectItem>
                          <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                          <SelectItem value="Maps & Location">Maps & Location</SelectItem>
                          <SelectItem value="Communication">Communication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}