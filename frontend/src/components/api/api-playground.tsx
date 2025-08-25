'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Play,
  Copy,
  Clock,
  CheckCircle,
  AlertTriangle,
  Code,
  Eye,
  EyeOff,
  Key,
  Zap
} from 'lucide-react';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: {
    example: object;
    schema: string;
  };
  planRestrictions: string[];
}

interface ApiPlan {
  id: string;
  name: string;
  type: 'free' | 'pro' | 'enterprise';
  price: number;
  quota: number;
  rateLimit: string;
  features: string[];
  isCurrentPlan: boolean;
}

interface CreatorInfo {
  id: string;
  name: string;
  company: string;
  logo: string;
  description: string;
  website: string;
  email: string;
  verified: boolean;
  totalProducts: number;
  averageRating: number;
  joinedDate: string;
}

interface ApiDetails {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'maintenance' | 'deprecated';
  provider: string;
  category: string;
  rating: number;
  totalUsers: number;
  basePath: string;
  supportEmail: string;
  documentation: string;
  creator: CreatorInfo;
  currentSubscription?: {
    planId: string;
    planName: string;
    usage: {
      current: number;
      quota: number;
      resetDate: string;
    };
    nextBilling: string;
    status: 'active' | 'cancelled';
  };
  endpoints: ApiEndpoint[];
  plans: ApiPlan[];
}

interface ApiPlaygroundProps {
  apiDetails: ApiDetails;
  currentPlan?: ApiPlan;
}

// Mock API keys for demonstration
const mockApiKeys = [
  { id: '1', name: 'Production Key', key: 'pk_live_1234567890abcdef', env: 'production' },
  { id: '2', name: 'Development Key', key: 'pk_test_abcdef1234567890', env: 'development' },
];

export function ApiPlayground({ apiDetails, currentPlan }: ApiPlaygroundProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiDetails.endpoints[0]);
  const [selectedApiKey, setSelectedApiKey] = useState(mockApiKeys[1].id);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [mode, setMode] = useState<'demo' | 'personal'>('demo');
  const [demoRequestCount, setDemoRequestCount] = useState(0);
  const maxDemoRequests = 5;

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleMakeRequest = async () => {
    if (mode === 'demo' && demoRequestCount >= maxDemoRequests) {
      toast.error('Demo quota exceeded. Switch to Personal mode to continue testing.');
      return;
    }

    // Check if endpoint requires upgrade
    const requiresUpgrade = selectedEndpoint.planRestrictions.length > 0 &&
      !selectedEndpoint.planRestrictions.includes(currentPlan?.type || 'free');

    if (mode === 'personal' && requiresUpgrade) {
      toast.error(`This endpoint requires a ${selectedEndpoint.planRestrictions.join(' or ')} plan. Please upgrade to continue.`);
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      if (mode === 'demo') {
        setDemoRequestCount(prev => prev + 1);
        setResponse({
          ...selectedEndpoint.response.example,
          _demo: true,
          _note: "This is demo data. Switch to Personal mode for live responses."
        });
      } else {
        setResponse(selectedEndpoint.response.example);
      }

      setResponseTime(Date.now() - startTime);
      toast.success('Request completed successfully!');
    } catch (error) {
      toast.error('Request failed. Please try again.');
      setResponse({ error: 'Request failed', message: 'Please check your parameters and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    const selectedKey = mockApiKeys.find(key => key.id === selectedApiKey);
    const baseUrl = `https://api.proxyapi.com${apiDetails.basePath}${selectedEndpoint.path}`;
    const queryParams = Object.entries(parameters)
      .filter(([_, value]) => value.trim())
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    const curlCommand = `curl -X ${selectedEndpoint.method} "${url}" \\\n  -H "Authorization: Bearer ${selectedKey?.key || 'your_api_key'}" \\\n  -H "Content-Type: application/json"`;

    navigator.clipboard.writeText(curlCommand);
    toast.success('cURL command copied to clipboard!');
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'POST':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'PUT':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Testing Mode</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to test the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-colors ${mode === 'demo'
                  ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                  : 'bg-muted/20 hover:bg-muted/30'
                }`}
              onClick={() => setMode('demo')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-current flex-shrink-0">
                    {mode === 'demo' && <div className="w-full h-full rounded-full bg-current scale-50" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Demo Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Sample responses ({maxDemoRequests - demoRequestCount} requests left)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-colors ${mode === 'personal'
                  ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                  : 'bg-muted/20 hover:bg-muted/30'
                }`}
              onClick={() => setMode('personal')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-current flex-shrink-0">
                    {mode === 'personal' && <div className="w-full h-full rounded-full bg-current scale-50" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Personal Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Live responses with your API key
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Request Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your API request parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Endpoint Selection */}
            <div className="space-y-2">
              <Label htmlFor="endpoint" className="text-sm font-medium">Endpoint</Label>
              <Select value={selectedEndpoint.path} onValueChange={(path) => {
                const endpoint = apiDetails.endpoints.find(e => e.path === path);
                if (endpoint) {
                  setSelectedEndpoint(endpoint);
                  setParameters({});
                  setResponse(null);
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {apiDetails.endpoints.map((endpoint) => (
                    <SelectItem key={endpoint.path} value={endpoint.path}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <span>{endpoint.path}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* API Key Selection (Personal Mode Only) */}
            {mode === 'personal' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-sm font-medium">API Key</Label>
                <div className="space-y-2">
                  <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockApiKeys.map((key) => (
                        <SelectItem key={key.id} value={key.id}>
                          <div className="flex items-center space-x-2">
                            <Key className="h-3 w-3" />
                            <span>{key.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {key.env}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedApiKey && (
                    <div className="flex items-center space-x-2 p-2 bg-muted/20 rounded">
                      <code className="text-sm flex-1">
                        {showApiKey
                          ? mockApiKeys.find(k => k.id === selectedApiKey)?.key
                          : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parameters */}
            {selectedEndpoint.parameters.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Parameters</Label>
                {selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={param.name} className="text-sm">
                        {param.name}
                        {param.required && <span className="text-red-400 ml-1">*</span>}
                      </Label>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                      </div>
                    </div>
                    <Input
                      id={param.name}
                      placeholder={param.description}
                      value={parameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      required={param.required}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Endpoint Restrictions Warning */}
            {selectedEndpoint.planRestrictions.length > 0 &&
              !selectedEndpoint.planRestrictions.includes(currentPlan?.type || 'free') && (
                <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4" />
                  <div>
                    <span className="font-medium">Plan upgrade required.</span>
                    <span className="ml-1">This endpoint requires a {selectedEndpoint.planRestrictions.join(' or ')} plan.</span>
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleMakeRequest}
                disabled={isLoading || (mode === 'demo' && demoRequestCount >= maxDemoRequests)}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                    Making Request...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Make Request
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCopyCurl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy cURL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Response</span>
              </CardTitle>
              {responseTime && (
                <Badge variant="outline" className="text-green-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {responseTime}ms
                </Badge>
              )}
            </div>
            <CardDescription>
              API response will appear here after making a request
            </CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                {mode === 'demo' && response._demo && (
                  <div className="flex items-center space-x-2 text-sm text-blue-400 bg-blue-500/10 p-3 rounded border border-blue-500/20">
                    <AlertTriangle className="h-4 w-4" />
                    <span>This is sample demo data. Switch to Personal mode for live responses.</span>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Response Body</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                        toast.success('Response copied to clipboard!');
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <pre className="text-sm text-foreground overflow-x-auto">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Make a request to see the response here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}