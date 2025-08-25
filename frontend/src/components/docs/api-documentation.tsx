'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  Play,
  Copy,
  Code,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { ApiProduct, ApiEndpoint } from '@/types/api';

const mockProduct: ApiProduct = {
  id: '1',
  name: 'Weather API',
  description: 'Real-time weather data for any location worldwide',
  basePath: '/weather',
  backendUrl: 'https://api.weather.com',
  isPublic: true,
  status: 'active',
  createdBy: 'creator-1',
  plans: ['free', 'pro'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  endpoints: [
    {
      id: '1',
      productId: '1',
      path: '/current',
      method: 'GET',
      description: 'Get current weather for a location',
      rateLimit: 100,
      isActive: true,
      planRestrictions: [],
      parameters: [
        { name: 'lat', type: 'number', required: true, description: 'Latitude coordinate', example: '40.7128' },
        { name: 'lon', type: 'number', required: true, description: 'Longitude coordinate', example: '-74.0060' },
        { name: 'units', type: 'string', required: false, description: 'Temperature units (metric, imperial)', example: 'metric' },
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X GET "https://proxy.example.com/weather/current?lat=40.7128&lon=-74.0060&units=metric" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        },
        {
          language: 'javascript',
          code: `const response = await fetch('https://proxy.example.com/weather/current?lat=40.7128&lon=-74.0060&units=metric', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();
console.log(data);`,
        },
        {
          language: 'python',
          code: `import requests

url = "https://proxy.example.com/weather/current"
params = {
    "lat": 40.7128,
    "lon": -74.0060,
    "units": "metric"
}
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)`,
        },
      ],
    },
    {
      id: '2',
      productId: '1',
      path: '/forecast',
      method: 'GET',
      description: 'Get weather forecast for a location',
      rateLimit: 50,
      isActive: true,
      planRestrictions: ['pro'],
      parameters: [
        { name: 'lat', type: 'number', required: true, description: 'Latitude coordinate', example: '40.7128' },
        { name: 'lon', type: 'number', required: true, description: 'Longitude coordinate', example: '-74.0060' },
        { name: 'days', type: 'number', required: false, description: 'Number of forecast days (1-7)', example: '5' },
      ],
      examples: [
        {
          language: 'curl',
          code: `curl -X GET "https://proxy.example.com/weather/forecast?lat=40.7128&lon=-74.0060&days=5" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        },
      ],
    },
  ],
};

interface ApiDocumentationProps {
  product?: ApiProduct;
}

export function ApiDocumentation({ product = mockProduct }: ApiDocumentationProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [testParameters, setTestParameters] = useState<Record<string, string>>({});
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [openEndpoints, setOpenEndpoints] = useState<string[]>([]);

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-green-500/20 text-green-400 border-green-500/30',
      POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PUT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
      PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[method as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const toggleEndpoint = (endpointId: string) => {
    setOpenEndpoints(prev =>
      prev.includes(endpointId)
        ? prev.filter(id => id !== endpointId)
        : [...prev, endpointId]
    );
  };

  const handleTestEndpoint = async (endpoint: ApiEndpoint) => {
    setIsTestingEndpoint(true);

    try {
      // Build query string from test parameters
      const queryParams = new URLSearchParams();
      endpoint.parameters?.forEach(param => {
        const value = testParameters[param.name];
        if (value) {
          queryParams.append(param.name, value);
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse = {
        status: 200,
        data: {
          location: {
            lat: 40.7128,
            lon: -74.0060,
            name: "New York, NY"
          },
          current: {
            temperature: 22,
            humidity: 65,
            description: "Partly cloudy",
            wind_speed: 12
          },
          timestamp: new Date().toISOString()
        }
      };

      setTestResponse(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      setTestResponse(JSON.stringify({ error: 'Failed to test endpoint' }, null, 2));
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Sidebar Navigation */}
      <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-foreground">{product.name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                API Documentation
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Overview</h3>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-sm"
                  onClick={() => setSelectedEndpoint(null)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Getting Started
                </Button>
              </div>

              <Separator />

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Endpoints</h3>
                {product.endpoints.map((endpoint) => (
                  <div key={endpoint.id}>
                    <Collapsible
                      open={openEndpoints.includes(endpoint.id)}
                      onOpenChange={() => toggleEndpoint(endpoint.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between h-auto p-2 text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getMethodBadge(endpoint.method)}>
                              {endpoint.method}
                            </Badge>
                            <span className="text-left">{endpoint.path}</span>
                          </div>
                          {openEndpoints.includes(endpoint.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-7 text-xs"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <Code className="h-3 w-3 mr-2" />
                          Documentation
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-7 text-xs"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Try it out
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {selectedEndpoint ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getMethodBadge(selectedEndpoint.method)}>
                    {selectedEndpoint.method}
                  </Badge>
                  <CardTitle className="text-foreground">
                    {selectedEndpoint.path}
                  </CardTitle>
                </div>
                {selectedEndpoint.planRestrictions.length > 0 && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Pro Only
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground">
                {selectedEndpoint.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="documentation" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="testing">Try it out</TabsTrigger>
                </TabsList>

                <TabsContent value="documentation" className="space-y-6">
                  {/* Parameters */}
                  {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Parameters</h3>
                      <div className="space-y-3">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index} className="border border-border/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <code className="bg-muted px-2 py-1 rounded text-sm text-foreground">
                                  {param.name}
                                </code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required ? (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                    required
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    optional
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {param.description}
                            </p>
                            {param.example && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">Example: </span>
                                <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                                  {param.example}
                                </code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Examples */}
                  {selectedEndpoint.examples && selectedEndpoint.examples.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Code Examples</h3>
                      <Tabs defaultValue={selectedEndpoint.examples[0].language}>
                        <TabsList>
                          {selectedEndpoint.examples.map((example, index) => (
                            <TabsTrigger key={index} value={example.language} className="capitalize">
                              {example.language}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {selectedEndpoint.examples.map((example, index) => (
                          <TabsContent key={index} value={example.language}>
                            <div className="relative">
                              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto">
                                <code className="text-foreground">{example.code}</code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 p-0"
                                onClick={() => copyToClipboard(example.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="testing" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Request Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Request</h3>

                      {selectedEndpoint.parameters?.map((param, index) => (
                        <div key={index}>
                          <label className="text-sm font-medium text-foreground flex items-center space-x-2 mb-1">
                            <span>{param.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <span className="text-red-400">*</span>
                            )}
                          </label>
                          <Input
                            placeholder={param.example || `Enter ${param.name}`}
                            value={testParameters[param.name] || ''}
                            onChange={(e) => setTestParameters(prev => ({
                              ...prev,
                              [param.name]: e.target.value
                            }))}
                            className="bg-background/50 border-border/50"
                          />
                          {param.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {param.description}
                            </p>
                          )}
                        </div>
                      ))}

                      <Button
                        onClick={() => handleTestEndpoint(selectedEndpoint)}
                        disabled={isTestingEndpoint}
                        className="w-full"
                      >
                        {isTestingEndpoint ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Response */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Response</h3>

                      {testResponse ? (
                        <div className="relative">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-400 font-medium">200 OK</span>
                          </div>
                          <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                            <code className="text-foreground">{testResponse}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-8 right-2 h-8 w-8 p-0"
                            onClick={() => copyToClipboard(testResponse)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted/20 p-8 rounded-lg text-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            Configure parameters and send a request to see the response
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground">Getting Started</CardTitle>
              <CardDescription className="text-muted-foreground">
                Learn how to integrate with {product.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <div className="relative">
                  <pre className="bg-muted/50 p-4 rounded-lg text-sm">
                    <code className="text-foreground">Authorization: Bearer YOUR_API_KEY</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Base URL</h3>
                <p className="text-muted-foreground mb-4">
                  All API endpoints are relative to the base URL:
                </p>
                <div className="relative">
                  <pre className="bg-muted/50 p-4 rounded-lg text-sm">
                    <code className="text-foreground">https://proxy.example.com{product.basePath}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => copyToClipboard(`https://proxy.example.com${product.basePath}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Rate Limits</h3>
                <p className="text-muted-foreground">
                  API rate limits depend on your subscription plan. When you exceed the rate limit,
                  you'll receive a 429 Too Many Requests response. Check the response headers for
                  rate limit information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}