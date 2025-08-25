'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Shield,
  AlertTriangle,
  Bell,
  Ban,
  Clock,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Zap,
  UserMinus,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

interface SecurityAlert {
  id: string;
  type: 'suspicious_activity' | 'rate_limit_exceeded' | 'unauthorized_access' | 'quota_exceeded';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

interface RateLimitRule {
  id: string;
  name: string;
  endpoint: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  isActive: boolean;
  actionOnExceed: 'block' | 'throttle' | 'notify';
  exemptPlans: string[];
}

interface IpBlacklist {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'removed';
  blockedRequests: number;
}

interface SecuritySettingsProps {
  product: ApiProduct;
}

export function SecuritySettings(product) {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'suspicious_activity',
      title: `Suspicious Activity on ${product.name}`,
      description: 'Unusual request patterns detected from multiple IP addresses',
      severity: 'high',
      timestamp: '2024-06-21T14:30:00Z',
      source: '192.168.1.100',
      status: 'new',
    },
    {
      id: '2',
      type: 'rate_limit_exceeded',
      title: 'Rate Limit Exceeded',
      description: `Consumer has exceeded rate limits for ${product.name}`,
      severity: 'medium',
      timestamp: '2024-06-21T13:45:00Z',
      source: 'john@devcompany.com',
      status: 'acknowledged',
    },
  ]);

  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>([
    {
      id: '1',
      name: `${product.name} - Free Plan`,
      endpoint: '/current',
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 1000,
      isActive: true,
      actionOnExceed: 'throttle',
      exemptPlans: ['pro', 'enterprise'],
    },
    {
      id: '2',
      name: `${product.name} - Pro Plan`,
      endpoint: '*',
      requestsPerMinute: 100,
      requestsPerHour: 5000,
      requestsPerDay: 50000,
      isActive: true,
      actionOnExceed: 'notify',
      exemptPlans: [],
    },
  ]);

  const [ipBlacklist, setIpBlacklist] = useState<IpBlacklist[]>([
    {
      id: '1',
      ipAddress: '192.168.1.100',
      reason: 'Suspicious activity and repeated unauthorized access attempts',
      blockedAt: '2024-06-21T14:30:00Z',
      expiresAt: '2024-06-28T14:30:00Z',
      status: 'active',
      blockedRequests: 1240,
    },
  ]);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    toast.success('Alert resolved');
  };

  const handleToggleRateLimit = (ruleId: string) => {
    setRateLimitRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success('Rate limit rule updated');
  };

  const handleBlockIp = (ipAddress: string) => {
    const newBlock: IpBlacklist = {
      id: Date.now().toString(),
      ipAddress,
      reason: 'Manually blocked by administrator',
      blockedAt: new Date().toISOString(),
      expiresAt: null,
      status: 'active',
      blockedRequests: 0,
    };

    setIpBlacklist(prev => [newBlock, ...prev]);
    toast.success(`IP address ${ipAddress} has been blocked`);
  };

  const handleUnblockIp = (ipId: string) => {
    setIpBlacklist(prev => prev.map(ip =>
      ip.id === ipId ? { ...ip, status: 'removed' } : ip
    ));
    toast.success('IP address has been unblocked');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'acknowledged': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expired': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'removed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const newAlerts = alerts.filter(alert => alert.status === 'new').length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && alert.status === 'new').length;
  const activeBlocks = ipBlacklist.filter(ip => ip.status === 'active').length;
  const activeRules = rateLimitRules.filter(rule => rule.isActive).length;

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{newAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Blocks</CardTitle>
            <Ban className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeBlocks}</div>
            <p className="text-xs text-muted-foreground">Blocked IP addresses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Rules</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeRules}</div>
            <p className="text-xs text-muted-foreground">Active protection rules</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limiting</TabsTrigger>
          <TabsTrigger value="ip-blocking">IP Management</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Security Alerts for {product.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span>•</span>
                          <span>{formatDate(alert.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {alert.status === 'new' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limits" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Rate Limiting Rules for {product.name}</span>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimitRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted/30 px-2 py-1 rounded">
                          {rule.endpoint}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{rule.requestsPerMinute}/min</div>
                          <div>{rule.requestsPerHour}/hour</div>
                          <div>{rule.requestsPerDay}/day</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {rule.actionOnExceed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => handleToggleRateLimit(rule.id)}
                          />
                          <span className="text-sm">
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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

        <TabsContent value="ip-blocking" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ban className="h-5 w-5" />
                  <span>IP Address Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter IP address to block..."
                    className="w-48"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value) {
                          handleBlockIp(target.value);
                          target.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked At</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Blocked Requests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipBlacklist.map((ip) => (
                    <TableRow key={ip.id}>
                      <TableCell>
                        <code className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                          {ip.ipAddress}
                        </code>
                      </TableCell>
                      <TableCell className="text-sm">{ip.reason}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(ip.blockedAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ip.expiresAt ? formatDate(ip.expiresAt) : 'Never'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {ip.blockedRequests.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ip.status)}>
                          {ip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {ip.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnblockIp(ip.id)}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
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

        <TabsContent value="policies" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle>API Access Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require API Key Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      All requests must include a valid API key
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow requests from whitelisted IPs
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Threat Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      AI-powered detection of suspicious patterns
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>DDoS Protection</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatic blocking of DDoS attacks
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle>Alert Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send security alerts to your email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Critical alerts via SMS
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhook Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts to external systems
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - All alerts</SelectItem>
                      <SelectItem value="medium">Medium - Important alerts only</SelectItem>
                      <SelectItem value="high">High - Critical alerts only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}