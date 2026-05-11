import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Copy, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { RouteDisplay } from '@/components/ui/route-display';
import { EndpointsEmptyState } from '@/components/creator/endpoints-empty-state';
import type { ApiProduct, ApiEndpoint } from '@/types/api';

interface EndpointListProps {
  apiProduct: ApiProduct;
  onImportOpenAPI: () => void;
  onCreateNew: () => void;
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCopyUrl: (endpoint: ApiEndpoint) => void;
}

export function EndpointList({
  apiProduct,
  onImportOpenAPI,
  onCreateNew,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyUrl
}: EndpointListProps) {
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

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {apiProduct.endpoints.length === 0 ? (
        <EndpointsEmptyState
          onImportOpenAPI={onImportOpenAPI}
          onCreateNew={onCreateNew}
        />
      ) : (
        <Card className="rounded-xl border shadow bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader className="flex flex-col space-y-1.5 p-6">
            <CardTitle className="font-semibold leading-none tracking-tight flex items-center justify-between">
              <span>API Endpoints ({apiProduct.endpoints.length})</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={onImportOpenAPI}
                  className="bg-background border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Import via OpenAPI
                </Button>
                <Button
                  onClick={onCreateNew}
                  className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Endpoint
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="relative w-full overflow-auto">
              <Table className="w-full caption-bottom text-sm">
                <TableHeader className="[&_tr]:border-b">
                  <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Endpoint</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Method</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Plan Access</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Rate Limit</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Performance</TableHead>
                    <TableHead className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Today's Calls</TableHead>
                    <TableHead className="h-10 px-2 align-middle font-medium text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:last-child]:border-0">
                  {apiProduct.endpoints.map((endpoint) => (
                    <TableRow key={endpoint.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <TableCell className="p-2 align-middle">
                        <div className="space-y-3">
                          <div className="text-xl font-bold text-foreground leading-tight">
                            {endpoint.title}
                          </div>
                          <div className="font-mono text-sm text-muted-foreground">
                            {apiProduct?.basePath || ''}{endpoint?.path || ''}
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed max-w-md">
                            {endpoint.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <Badge className={`${getMethodColor(endpoint.method)} shadow-none hover:bg-primary/80`}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={endpoint.isActive}
                            onCheckedChange={() => onToggleStatus(endpoint.id)}
                            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9"
                          />
                          <span className="text-sm">Active</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <Badge className={`${getPlanColor(endpoint.requiredPlan || 'free')} shadow-none hover:bg-primary/80`}>
                          {(endpoint.requiredPlan || 'free').charAt(0).toUpperCase() + (endpoint.requiredPlan || 'free').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="text-sm">
                          {endpoint.rateLimit?.enabled
                            ? `${endpoint.rateLimit.value}/${endpoint.rateLimit.period}`
                            : 'Unlimited'
                          }
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{endpoint.responseTime || 0}ms</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{endpoint.errorRate || 0}% errors</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="font-medium">
                          {(endpoint.callsToday || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCopyUrl(endpoint)}
                            className="h-8 rounded-md px-3 text-xs"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(endpoint)}
                            className="h-8 rounded-md px-3 text-xs"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(endpoint.id)}
                            className="h-8 rounded-md px-3 text-xs"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
