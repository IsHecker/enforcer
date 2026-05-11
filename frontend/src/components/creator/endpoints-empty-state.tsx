'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  FileText, 
  Plus,
  ArrowRight
} from 'lucide-react';

interface EndpointsEmptyStateProps {
  onImportOpenAPI: () => void;
  onCreateNew: () => void;
}

export function EndpointsEmptyState({
  onImportOpenAPI,
  onCreateNew
}: EndpointsEmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full border-2 border-dashed border-muted">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No endpoints defined yet</h3>
            <p className="text-muted-foreground text-sm">
              Get started by importing an OpenAPI specification or creating your first endpoint manually.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Option - Import OpenAPI */}
            <Button 
              onClick={onImportOpenAPI} 
              className="w-full"
              size="lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              Import via OpenAPI
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Secondary Option - Create Manually */}
            <Button 
              onClick={onCreateNew} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Endpoint
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-4 space-y-3">
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-start space-x-2">
                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Import via OpenAPI:</strong> Quickly import multiple endpoints from an existing OpenAPI (Swagger) specification
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Create New Endpoint:</strong> Manually define a single endpoint with complete configuration options
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}