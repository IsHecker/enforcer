'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Code, FileText, Globe, Key, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { RouteDisplay } from '@/components/ui/route-display';
import type { ApiEndpoint, ApiProduct } from '@/types/api';

interface EndpointDetailProps {
  endpoint: ApiEndpoint;
  apiProduct: ApiProduct;
}

export function EndpointDetail({ endpoint, apiProduct }: EndpointDetailProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
            <h2 className="text-2xl font-bold tracking-tight">{endpoint.title || endpoint.path}</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm pt-2">
            <RouteDisplay route={`${apiProduct.basePath || ''}${endpoint.path}`} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={endpoint.isActive ? "outline" : "secondary"} className={endpoint.isActive ? "text-green-500 border-green-500/20" : ""}>
            {endpoint.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {endpoint.requiredPlan && (
            <Badge variant="outline" className="capitalize">
              {endpoint.requiredPlan} Plan
            </Badge>
          )}
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {endpoint.description || "No description provided for this endpoint."}
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{endpoint.responseTime || 0}ms</div>
                    <p className="text-xs text-muted-foreground">Average response time</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{endpoint.errorRate || 0}%</div>
                    <p className="text-xs text-muted-foreground">Error rate (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-purple-500" />
                  Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {endpoint.rateLimit?.enabled ? `${endpoint.rateLimit.value}/${endpoint.rateLimit.period.charAt(0)}` : '∞'}
                    </div>
                    <p className="text-xs text-muted-foreground">Rate limit</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{endpoint.callsToday || 0}</div>
                    <p className="text-xs text-muted-foreground">Calls today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/20 border-border/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Technical Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Base Path: </span>
                  <code className="text-primary">{apiProduct.basePath}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Endpoint ID: </span>
                  <code className="text-xs">{endpoint.id}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="pt-4">
          <div className="space-y-6">
            {endpoint.pathParameters && endpoint.pathParameters.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Path Parameters
                </h3>
                <Card className="border-border/10">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {endpoint.pathParameters.map((param) => (
                        <TableRow key={param.id}>
                          <TableCell className="font-mono text-xs font-semibold">{param.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px] uppercase">{param.type}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{param.description || 'No description'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Query/Body Parameters
              </h3>
              {endpoint.parameters && endpoint.parameters.length > 0 ? (
                <Card className="border-border/10">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {endpoint.parameters.map((param, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs font-semibold">{param.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px] uppercase">{param.type}</Badge></TableCell>
                          <TableCell>
                            {param.required ? (
                              <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">REQUIRED</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">OPTIONAL</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{param.description || 'No description'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <p className="text-sm text-muted-foreground italic pl-6">No request parameters defined.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="pt-4">
          <div className="space-y-4">
            {endpoint.responses && endpoint.responses.length > 0 ? (
              endpoint.responses.map((resp) => (
                <Card key={resp.id} className="border-border/10">
                  <CardHeader className="py-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={resp.statusCode >= 400 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                          {resp.statusCode}
                        </Badge>
                        <span className="font-semibold text-sm">{resp.statusDescription}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{resp.contentType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{resp.description}</p>
                    {resp.example && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Example</div>
                        <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto border border-border/10">
                          {resp.example}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground italic text-center py-8">No response types documented.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="pt-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-purple-500" />
                Example Requests
              </h3>
              <div className="grid gap-4">
                {(endpoint.exampleRequests || endpoint.examples || []).map((ex, i) => (
                  <Card key={i} className="bg-black/40 border-border/10 overflow-hidden">
                    <div className="px-4 py-2 border-b border-border/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{ex.language}</span>
                      <Badge variant="secondary" className="text-[10px]">CURL</Badge>
                    </div>
                    <CardContent className="p-0">
                      <pre className="p-4 text-blue-400 font-mono text-xs overflow-x-auto">
                        {ex.code}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
