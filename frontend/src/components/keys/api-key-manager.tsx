'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'development' | 'production' | 'staging';
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  usageCount: number;
  associatedApis: string[];
  permissions: string[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production App Key',
    key: 'pk_live_123456789abcdefghijklmnopqrstuvwxyz',
    environment: 'production',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2024-01-30T14:25:00Z',
    expiresAt: null,
    usageCount: 1250,
    associatedApis: ['Weather API', 'News API'],
    permissions: ['read', 'write'],
  },
  {
    id: '2',
    name: 'Development Testing',
    key: 'pk_test_abcdefghijklmnopqrstuvwxyz123456789',
    environment: 'development',
    status: 'active',
    createdAt: '2024-01-20T09:15:00Z',
    lastUsed: '2024-01-29T16:45:00Z',
    expiresAt: '2024-06-01T00:00:00Z',
    usageCount: 456,
    associatedApis: ['Crypto API'],
    permissions: ['read'],
  },
  {
    id: '3',
    name: 'Legacy API Key',
    key: 'pk_live_legacy123456789abcdefghijklmnop',
    environment: 'production',
    status: 'inactive',
    createdAt: '2023-12-01T08:00:00Z',
    lastUsed: '2024-01-10T12:30:00Z',
    expiresAt: null,
    usageCount: 2890,
    associatedApis: ['Weather API'],
    permissions: ['read'],
  },
];

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'development' | 'production' | 'staging'>('development');
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const { user } = useAuth();

  const availableApis = ['Weather API', 'Crypto API', 'News API', 'Image Processing API'];

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${keyName} copied to clipboard!`);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `pk_${newKeyEnvironment === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      environment: newKeyEnvironment,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt: null,
      usageCount: 0,
      associatedApis: selectedApis,
      permissions: ['read'],
    };

    setApiKeys([...apiKeys, newKey]);
    setIsCreateDialogOpen(false);
    setNewKeyName('');
    setSelectedApis([]);
    toast.success('New API key created successfully!');
  };

  const handleRotateKey = (keyId: string) => {
    setApiKeys(keys =>
      keys.map(key =>
        key.id === keyId
          ? {
            ...key,
            key: `pk_${key.environment === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          }
          : key
      )
    );
    toast.success('API key rotated successfully!');
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(keys =>
      keys.map(key =>
        key.id === keyId
          ? { ...key, status: 'inactive' as const }
          : key
      )
    );
    toast.success('API key revoked successfully!');
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(keys => keys.filter(key => key.id !== keyId));
    toast.success('API key deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'development':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'staging':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const isKeyExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for accessing subscribed services
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New API Key</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Generate a new API key for accessing your subscribed APIs
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="key-name" className="text-sm font-medium text-foreground">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production App Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="environment" className="text-sm font-medium text-foreground">
                  Environment
                </Label>
                <Select
                  value={newKeyEnvironment}
                  onValueChange={(value: 'development' | 'production' | 'staging') => setNewKeyEnvironment(value)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Associated APIs (Optional)
                </Label>
                <div className="mt-2 space-y-2">
                  {availableApis.map((api) => (
                    <div key={api} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={api}
                        checked={selectedApis.includes(api)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedApis([...selectedApis, api]);
                          } else {
                            setSelectedApis(selectedApis.filter(a => a !== api));
                          }
                        }}
                        className="rounded border-border bg-background"
                      />
                      <Label htmlFor={api} className="text-sm text-foreground">
                        {api}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateKey}>
                Create API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length > 0 ? (
          apiKeys.map((apiKey) => {
            const isExpired = isKeyExpired(apiKey.expiresAt);
            const isVisible = visibleKeys.has(apiKey.id);

            return (
              <Card key={apiKey.id} className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground flex items-center space-x-2">
                          <span>{apiKey.name}</span>
                          <Badge variant="outline" className={getEnvironmentColor(apiKey.environment)}>
                            {apiKey.environment}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Created on {formatDate(apiKey.createdAt)}
                          {apiKey.lastUsed && (
                            <span> • Last used {formatRelativeTime(apiKey.lastUsed)}</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(isExpired ? 'expired' : apiKey.status)}
                      >
                        {isExpired ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Expired
                          </>
                        ) : apiKey.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* API Key Display */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      API Key
                    </Label>
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                      <code className="flex-1 text-sm text-foreground font-mono">
                        {isVisible ? apiKey.key : apiKey.key.substring(0, 12) + '•'.repeat(20) + apiKey.key.slice(-4)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Key Statistics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-lg font-semibold text-foreground">
                        {apiKey.usageCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Uses</div>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-lg font-semibold text-foreground">
                        {apiKey.associatedApis.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Associated APIs</div>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-lg font-semibold text-foreground">
                        {apiKey.expiresAt ?
                          Math.max(0, Math.ceil((new Date(apiKey.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
                          '∞'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {apiKey.expiresAt ? 'Days Until Expiry' : 'Never Expires'}
                      </div>
                    </div>
                  </div>

                  {/* Associated APIs */}
                  {apiKey.associatedApis.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Associated APIs
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.associatedApis.map((api, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400">
                            <Globe className="h-3 w-3 mr-1" />
                            {api}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expiration Warning */}
                  {apiKey.expiresAt && !isExpired && (
                    (() => {
                      const daysUntilExpiry = Math.ceil((new Date(apiKey.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      if (daysUntilExpiry <= 7) {
                        return (
                          <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                            <AlertTriangle className="h-4 w-4" />
                            <div>
                              <span className="font-medium">Key expires soon.</span>
                              <span className="ml-1">This key will expire in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}

                  {/* Expired Warning */}
                  {isExpired && (
                    <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <span className="font-medium">This key has expired.</span>
                        <span className="ml-1">Generate a new key to continue accessing APIs.</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/usage?key=${apiKey.id}`}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Usage Analytics
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {apiKey.status === 'active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRotateKey(apiKey.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Rotate
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeKey(apiKey.id)}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No API Keys Found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start accessing subscribed services
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}