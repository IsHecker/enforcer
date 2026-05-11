'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Info, PlayCircle, Terminal, FileCode2, Command } from 'lucide-react';
import { RouteDisplay } from '@/components/ui/route-display';
import type { ApiEndpoint, ApiProduct } from '@/types/api';

interface ApiPlaygroundProps {
  apiProduct: ApiProduct;
}

export function ApiPlayground({ apiProduct }: ApiPlaygroundProps) {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');
  const [sandboxResponse, setSandboxResponse] = useState<string>('');

  const endpoints = apiProduct.endpoints || [];
  const selectedEndpoint = endpoints.find(e => e.id === selectedEndpointId);

  const handleTestEndpoint = () => {
    setSandboxResponse('{\n  "status": "success",\n  "message": "This is a mocked playground response.",\n  "data": {\n    "id": "123",\n    "value": "Playground stub active"\n  }\n}');
  };

  if (endpoints.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardContent className="pt-6 text-center text-muted-foreground py-12">
          <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add endpoints to test them in the Interactive Playground.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 h-full">
      {/* Sidebar Selector */}
      <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Command className="h-4 w-4 text-purple-500" />
            <span>Select Endpoint</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Endpoint to Test</Label>
            <Select value={selectedEndpointId} onValueChange={setSelectedEndpointId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an endpoint..." />
              </SelectTrigger>
              <SelectContent>
                {endpoints.map(ep => (
                  <SelectItem key={ep.id} value={ep.id}>
                    <span className="font-mono text-xs mr-2 opacity-70">{ep.method}</span>
                    <span className="truncate">{ep.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEndpoint && (
            <div className="pt-4 border-t border-border/10 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Route</div>
                <RouteDisplay route={`${apiProduct.basePath || ''}${selectedEndpoint.path || ''}`} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Description</div>
                <p className="text-sm text-foreground/80">{selectedEndpoint.description}</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Authorization required</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Info className="h-3 w-3 mr-1" /> API Key ({selectedEndpoint.requiredPlan} plan minimum)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explorer / Playground Main Area */}
      <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <FileCode2 className="h-4 w-4 text-orange-500" />
            <span>Interactive Request</span>
          </CardTitle>
          <Button
            size="sm"
            onClick={handleTestEndpoint}
            disabled={!selectedEndpoint}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Send Request
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {selectedEndpoint ? (
            <div className="flex flex-col">
              <div className="p-4 bg-muted/30 border-b border-border/20 space-y-4">

                <div className="space-y-2">
                  <Label>Headers</Label>
                  <div className="flex items-center space-x-2">
                    <Input value="Authorization" readOnly className="w-1/3 bg-muted font-mono text-xs" />
                    <Input placeholder="Bearer <your_test_token>" className="font-mono text-xs" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input value="Content-Type" readOnly className="w-1/3 bg-muted font-mono text-xs" />
                    <Input value="application/json" readOnly className="font-mono text-xs bg-muted" />
                  </div>
                </div>

                {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                  <div className="space-y-2">
                    <Label>Request Body (JSON)</Label>
                    <textarea
                      className="w-full h-32 p-3 bg-secondary/30 rounded-md font-mono text-sm border border-border/20 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="{\n  // Enter JSON payload here\n}"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-black/40 min-h-[250px] relative">
                <span className="absolute top-2 right-4 text-xs font-mono text-green-400 opacity-70">
                  {sandboxResponse ? "200 OK - 42ms" : "Waiting for request..."}
                </span>
                <Label className="text-muted-foreground mb-2 block">Response</Label>
                {sandboxResponse ? (
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto p-4 rounded bg-black/50 border border-green-500/20">
                    {sandboxResponse}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
                    <span className="bg-muted/50 px-3 py-1 rounded">Click 'Send Request' to test</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground flex-col gap-2">
              <Terminal className="h-8 w-8 opacity-20" />
              <span>Select an endpoint to start</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
