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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Globe,
  Key,
  Phone,
  Mail,
  ExternalLink,
  X,
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

interface IpBlacklist {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expires: string;
  blockedRequests: number;
}

interface SecuritySettingsProps {
  product: ApiProduct;
  isNewProduct?: boolean;
}

export function SecuritySettings({ product, isNewProduct = false }: SecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState('policies');
  
  // Security Policy States - all off by default
  const [requireApiKey, setRequireApiKey] = useState(false);
  const [authMethod, setAuthMethod] = useState('API Key');
  const [tokenLifetime, setTokenLifetime] = useState('24');
  const [tokenLifetimeUnit, setTokenLifetimeUnit] = useState('hours');
  const [requireHttps, setRequireHttps] = useState(false);
  const [allowedOrigins, setAllowedOrigins] = useState('');
  const [allowedMethods, setAllowedMethods] = useState('');
  const [allowedHeaders, setAllowedHeaders] = useState('');
  
  // IP Blacklist States
  const [blacklistIps, setBlacklistIps] = useState<IpBlacklist[]>([]);
  const [isAddIpModalOpen, setIsAddIpModalOpen] = useState(false);
  const [newBlacklistIp, setNewBlacklistIp] = useState('');
  const [newBlacklistReason, setNewBlacklistReason] = useState('');
  const [newBlacklistExpires, setNewBlacklistExpires] = useState('');
  const [newBlacklistDuration, setNewBlacklistDuration] = useState('permanent');
  const [customDurationValue, setCustomDurationValue] = useState('1');
  const [customDurationUnit, setCustomDurationUnit] = useState('days');
  
  // Threat Protection States
  const [automaticThreatDetection, setAutomaticThreatDetection] = useState(false);
  const [ddosProtection, setDdosProtection] = useState(false);
  
  // Alert Notification States
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [alertPhone, setAlertPhone] = useState('');
  const [webhookIntegration, setWebhookIntegration] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('medium');

  const handleAddBlacklistIp = () => {
    if (!newBlacklistIp.trim()) {
      toast.error('Please enter a valid IP address');
      return;
    }

    let expiresDate = 'Permanent';
    if (newBlacklistDuration === 'custom') {
      const now = new Date();
      const duration = parseInt(customDurationValue);
      if (duration > 0) {
        if (customDurationUnit === 'hours') {
          now.setHours(now.getHours() + duration);
        } else if (customDurationUnit === 'days') {
          now.setDate(now.getDate() + duration);
        } else if (customDurationUnit === 'weeks') {
          now.setDate(now.getDate() + (duration * 7));
        } else if (customDurationUnit === 'years') {
          now.setFullYear(now.getFullYear() + duration);
        }
        expiresDate = now.toISOString();
      }
    }

    const newIp: IpBlacklist = {
      id: Date.now().toString(),
      ipAddress: newBlacklistIp.trim(),
      reason: newBlacklistReason.trim() || 'No reason specified',
      blockedAt: new Date().toISOString(),
      expires: expiresDate,
      blockedRequests: 0,
    };

    setBlacklistIps(prev => [newIp, ...prev]);
    setNewBlacklistIp('');
    setNewBlacklistReason('');
    setNewBlacklistExpires('');
    setNewBlacklistDuration('permanent');
    setCustomDurationValue('1');
    setCustomDurationUnit('days');
    setIsAddIpModalOpen(false);
    toast.success(`IP address ${newIp.ipAddress} added to blacklist`);
  };

  const handleRemoveBlacklistIp = (ipId: string) => {
    setBlacklistIps(prev => prev.filter(ip => ip.id !== ipId));
    toast.success('IP address removed from blacklist');
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

  // Calculate some summary stats for the overview cards
  const totalBlacklistedIps = blacklistIps.length;
  const activeSecurityPolicies = [
    requireApiKey,
    requireHttps,
    automaticThreatDetection,
    ddosProtection
  ].filter(Boolean).length;
  const activeNotifications = [
    emailAlerts,
    smsNotifications,
    webhookIntegration
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeSecurityPolicies}</div>
            <p className="text-xs text-muted-foreground">Security policies enabled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blacklisted IPs</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBlacklistedIps}</div>
            <p className="text-xs text-muted-foreground">Blocked IP addresses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeNotifications}</div>
            <p className="text-xs text-muted-foreground">Alert channels active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protection Level</CardTitle>
            <Lock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {activeSecurityPolicies > 2 ? 'High' : activeSecurityPolicies > 0 ? 'Medium' : 'Basic'}
            </div>
            <p className="text-xs text-muted-foreground">Current security level</p>
          </CardContent>
        </Card>
      </div>



      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="ip-management">API Key Management</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid gap-6">
            {/* API Access Policies Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-blue-500" />
                  <span>API Access Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require API Key Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        All requests must include a valid API key
                      </p>
                    </div>
                    <Switch checked={requireApiKey} onCheckedChange={setRequireApiKey} />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Authentication Method</Label>
                    <Select 
                      value={authMethod} 
                      onValueChange={setAuthMethod}
                      disabled={!requireApiKey}
                    >
                      <SelectTrigger className={!requireApiKey ? "opacity-50" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="API Key">API Key</SelectItem>
                        <SelectItem value="OAuth2">OAuth2</SelectItem>
                        <SelectItem value="JWT">JWT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Token Lifetime / Expiry</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={tokenLifetime}
                        onChange={(e) => setTokenLifetime(e.target.value)}
                        disabled={!requireApiKey}
                        className={`flex-1 ${!requireApiKey ? "opacity-50" : ""}`}
                        placeholder="24"
                        min="1"
                      />
                      <Select 
                        value={tokenLifetimeUnit} 
                        onValueChange={setTokenLifetimeUnit}
                        disabled={!requireApiKey}
                      >
                        <SelectTrigger className={`w-32 ${!requireApiKey ? "opacity-50" : ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require HTTPS</Label>
                      <p className="text-sm text-muted-foreground">
                        Only accept requests over HTTPS connections
                      </p>
                    </div>
                    <Switch checked={requireHttps} onCheckedChange={setRequireHttps} />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>CORS Settings</Label>
                      <p className="text-sm text-muted-foreground">
                        Configure Cross-Origin Resource Sharing permissions
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Allowed Origins</Label>
                        <Textarea
                          value={allowedOrigins}
                          onChange={(e) => setAllowedOrigins(e.target.value)}
                          placeholder="https://example.com&#10;https://app.example.com&#10;*"
                          className="min-h-[80px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter one origin per line. Use * to allow all origins.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Allowed Methods</Label>
                        <Input
                          value={allowedMethods}
                          onChange={(e) => setAllowedMethods(e.target.value)}
                          placeholder="GET, POST, PUT, DELETE"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Allowed Headers</Label>
                        <Input
                          value={allowedHeaders}
                          onChange={(e) => setAllowedHeaders(e.target.value)}
                          placeholder="Content-Type, Authorization, X-API-Key"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Threat Protection Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span>Threat Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Threat Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      AI-powered detection of suspicious request patterns
                    </p>
                  </div>
                  <Switch checked={automaticThreatDetection} onCheckedChange={setAutomaticThreatDetection} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>DDoS Protection</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatic detection and mitigation of DDoS attacks
                    </p>
                  </div>
                  <Switch checked={ddosProtection} onCheckedChange={setDdosProtection} />
                </div>
              </CardContent>
            </Card>

            {/* Alert Notifications Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  <span>Alert Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send security alerts to your email address
                      </p>
                    </div>
                    <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>
                  
                  {emailAlerts && (
                    <div className="ml-4 space-y-2">
                      <Label>Email Address</Label>
                      <div className="flex space-x-2">
                        <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          type="email"
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="security@company.com"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive critical security alerts via SMS
                      </p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                  
                  {smsNotifications && (
                    <div className="ml-4 space-y-2">
                      <Label>Phone Number</Label>
                      <div className="flex space-x-2">
                        <Phone className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          type="tel"
                          value={alertPhone}
                          onChange={(e) => setAlertPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Webhook Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts to external systems via webhooks
                      </p>
                    </div>
                    <Switch checked={webhookIntegration} onCheckedChange={setWebhookIntegration} />
                  </div>
                  
                  {webhookIntegration && (
                    <div className="ml-4 space-y-2">
                      <Label>Webhook URL</Label>
                      <div className="flex space-x-2">
                        <ExternalLink className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          type="url"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://api.example.com/webhooks/security"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Alert Threshold</Label>
                  <Select value={alertThreshold} onValueChange={setAlertThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Send all security alerts</SelectItem>
                      <SelectItem value="medium">Medium - Send important alerts only</SelectItem>
                      <SelectItem value="high">High - Send critical alerts only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Configure the minimum severity level for receiving alerts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ip-management" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ban className="h-5 w-5 text-red-500" />
                  <span>API Key Blacklist Management</span>
                </div>
                <Dialog open={isAddIpModalOpen} onOpenChange={setIsAddIpModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ban API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <Input
                          placeholder="sk_live_abcdefgh123456789"
                          value={newBlacklistIp}
                          onChange={(e) => setNewBlacklistIp(e.target.value)}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the API key to ban from accessing your endpoints
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input
                          placeholder="e.g., Malicious activity, Spam source, Security threat"
                          value={newBlacklistReason}
                          onChange={(e) => setNewBlacklistReason(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select value={newBlacklistDuration} onValueChange={setNewBlacklistDuration}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="permanent">Permanent</SelectItem>
                            <SelectItem value="custom">Custom Duration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {newBlacklistDuration === 'custom' && (
                        <div className="space-y-2">
                          <Label>Custom Duration</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              value={customDurationValue}
                              onChange={(e) => setCustomDurationValue(e.target.value)}
                              className="flex-1"
                              placeholder="1"
                              min="1"
                            />
                            <Select value={customDurationUnit} onValueChange={setCustomDurationUnit}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="weeks">Weeks</SelectItem>
                                <SelectItem value="years">Years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddIpModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAddBlacklistIp}
                          disabled={!newBlacklistIp.trim()}
                        >
                          Ban API Key
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Ban specific API keys from accessing your API endpoints. 
                Banned API keys will be automatically rejected.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blacklisted IPs List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Blacklisted API Keys</Label>
                </div>

                {blacklistIps.length > 0 ? (
                  <div className="border border-border/50 rounded-lg overflow-hidden bg-card/30">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/40">
                          <TableHead className="font-semibold text-foreground">API Key</TableHead>
                          <TableHead className="font-semibold text-foreground">Reason</TableHead>
                          <TableHead className="font-semibold text-foreground">Blocked At</TableHead>
                          <TableHead className="font-semibold text-foreground">Expires</TableHead>
                          <TableHead className="font-semibold text-foreground">Blocked Requests</TableHead>
                          <TableHead className="w-[100px] font-semibold text-foreground">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blacklistIps.map((ip) => (
                          <TableRow key={ip.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell>
                              <code className="font-mono text-sm bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                {ip.ipAddress}
                              </code>
                            </TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate text-white">
                              {ip.reason}
                            </TableCell>
                            <TableCell className="text-sm text-white">
                              {formatDate(ip.blockedAt)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {ip.expires === 'Permanent' ? (
                                <Badge className="bg-white text-black border-gray-300">
                                  Permanent
                                </Badge>
                              ) : (
                                <span className="text-white">{formatDate(ip.expires)}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm font-mono text-white">
                              {ip.blockedRequests.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBlacklistIp(ip.id)}
                                className="text-white hover:text-white hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                    <Ban className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No API keys banned
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Your API is currently accessible to all API keys. Ban specific API keys above to block access from compromised or malicious keys.
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p><strong>Example:</strong> sk_live_abcdefgh123456789</p>
                      <p><strong>Example:</strong> pk_test_xyz987654321</p>
                    </div>
                  </div>
                )}
              </div>


            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}