'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import type { ApiEndpoint } from '@/types/api';

interface ImportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaceAll: () => void;
  onAddNewOnly: () => void;
  existingEndpoints: ApiEndpoint[];
  newEndpoints: ApiEndpoint[];
}

export function ImportConfirmationModal({
  isOpen,
  onClose,
  onReplaceAll,
  onAddNewOnly,
  existingEndpoints,
  newEndpoints
}: ImportConfirmationModalProps) {
  const conflictingEndpoints = newEndpoints.filter(newEndpoint => 
    existingEndpoints.some(existing => 
      existing.path === newEndpoint.path && existing.method === newEndpoint.method
    )
  );

  const newOnlyEndpoints = newEndpoints.filter(newEndpoint => 
    !existingEndpoints.some(existing => 
      existing.path === newEndpoint.path && existing.method === newEndpoint.method
    )
  );

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-card border-border">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Import Confirmation</span>
          </DialogTitle>
          <DialogDescription>
            You already have {existingEndpoints.length} endpoint{existingEndpoints.length !== 1 ? 's' : ''} defined. 
            How would you like to handle the {newEndpoints.length} endpoint{newEndpoints.length !== 1 ? 's' : ''} from your OpenAPI specification?
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide min-h-0">
          {/* Import Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Replace All Option */}
            <Card className="bg-red-500/10 border-red-500/20 hover:bg-red-500/15 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <RefreshCw className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Replace All Endpoints</h3>
                    <p className="text-sm text-muted-foreground">
                      Remove all {existingEndpoints.length} existing endpoint{existingEndpoints.length !== 1 ? 's' : ''} and 
                      replace with {newEndpoints.length} new endpoint{newEndpoints.length !== 1 ? 's' : ''} from the OpenAPI specification.
                    </p>
                    <div className="text-xs text-red-400 bg-red-500/10 rounded px-2 py-1 border border-red-500/20">
                      <strong>Warning:</strong> This action cannot be undone. All current endpoint configurations will be lost.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Only Option */}
            <Card className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Plus className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Add New Endpoints Only</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep all existing endpoints and add only the {newOnlyEndpoints.length} new endpoint{newOnlyEndpoints.length !== 1 ? 's' : ''} 
                      that don't conflict with existing ones.
                    </p>
                    {conflictingEndpoints.length > 0 && (
                      <div className="text-xs text-blue-400 bg-blue-500/10 rounded px-2 py-1 border border-blue-500/20">
                        {conflictingEndpoints.length} endpoint{conflictingEndpoints.length !== 1 ? 's' : ''} will be skipped due to conflicts.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conflict Analysis */}
          {conflictingEndpoints.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-medium flex items-center space-x-2 text-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span>Conflicting Endpoints ({conflictingEndpoints.length})</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  These endpoints already exist and would be affected by the import:
                </p>
              </div>
              
              {/* Structured Container for Endpoint List */}
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4">
                  <div className="grid gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                    {conflictingEndpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        </div>
                        <span className="text-sm text-muted-foreground">{endpoint.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* New Endpoints Preview */}
          {newOnlyEndpoints.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2 text-foreground">
                <Plus className="h-4 w-4 text-green-400" />
                <span>New Endpoints to Add ({newOnlyEndpoints.length})</span>
              </h4>
              
              {/* Structured Container for Endpoint List */}
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4">
                  <div className="grid gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                    {newOnlyEndpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        </div>
                        <span className="text-sm text-muted-foreground">{endpoint.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary */}
          <div className="bg-muted/30 border border-border rounded-lg p-5">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <h4 className="font-medium text-foreground">Import Summary</h4>
              </div>
              
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Current endpoints</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground text-base">{existingEndpoints.length}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Endpoints in OpenAPI spec</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground text-base">{newEndpoints.length}</span>
                  </div>
                </div>
                
                <hr className="border-border/50" />
                
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Conflicting endpoints</span>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400 text-base">{conflictingEndpoints.length}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">New endpoints to add</span>
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-green-400 text-base">{newOnlyEndpoints.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between flex-shrink-0 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel Import
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={onAddNewOnly}
              disabled={newOnlyEndpoints.length === 0}
              className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Only ({newOnlyEndpoints.length})
            </Button>
            <Button 
              onClick={onReplaceAll}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Replace All ({newEndpoints.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}