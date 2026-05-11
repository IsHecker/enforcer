'use client';

/**
 * OpenAPI Documentation Editor - Clean Implementation
 * 
 * Focused solely on OpenAPI documentation without analytical features.
 * Integrates the comprehensive parser and structured card forms to provide
 * a complete editing experience for ALL OpenAPI 3.1.0 features.
 * 
 * KEY RULE: Never invents or displays values not present in document
 * No analytical nonsense - pure documentation focus
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import {
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw
} from 'lucide-react';

import {
  OpenAPIDocument,
  OpenAPIParser,
  ParseResult
} from '@/lib/openapi-parser';

import { StructuredCardForms } from './structured-card-forms';

interface OpenAPIDocumentationEditorProps {
  initialDocument?: OpenAPIDocument;
  onChange?: (document: OpenAPIDocument) => void;
  className?: string;
}

export const OpenAPIDocumentationEditor: React.FC<OpenAPIDocumentationEditorProps> = ({
  initialDocument,
  onChange,
  className
}) => {
  const [document, setDocument] = useState<OpenAPIDocument | null>(initialDocument || null);
  const [validationResult, setValidationResult] = useState<ParseResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize with minimal document if none provided - useMemo to prevent recreation
  const defaultDocument = useMemo<OpenAPIDocument>(() => ({
    openapi: '3.1.0',
    info: {
      title: 'New API',
      version: '1.0.0'
    }
  }), []);

  const currentDocument = document || defaultDocument;

  // Validate document when it changes
  const validateDocument = useCallback(async (doc: OpenAPIDocument) => {
    setIsValidating(true);
    
    try {
      const parser = new OpenAPIParser();
      const serialized = parser.serialize(doc);
      const result = parser.parse(serialized);
      
      setValidationResult(result);
      
      // Notify parent component if validation passes
      if (result.errors.length === 0 && onChange) {
        onChange(result.document);
      }
    } catch (error) {
      // Handle parser errors
      setValidationResult({
        document: doc,
        errors: [{ path: 'document', message: (error as Error).message, code: 'PARSER_ERROR' }],
        warnings: [],
        unresolvedRefs: []
      });
    } finally {
      setIsValidating(false);
    }
  }, [onChange]);

  // Handle document changes with validation
  const handleDocumentChange = useCallback((updatedDoc: OpenAPIDocument) => {
    setDocument(updatedDoc);
    
    // Validate after a short delay to avoid excessive validation
    const timer = setTimeout(() => {
      validateDocument(updatedDoc);
    }, 500);
    
    // No cleanup needed for this timeout pattern
  }, [validateDocument]);

  // Initialize validation on mount
  useEffect(() => {
    if (initialDocument) {
      setDocument(initialDocument);
      validateDocument(initialDocument);
    } else {
      validateDocument(defaultDocument);
    }
  }, [initialDocument, validateDocument, defaultDocument.info.title, defaultDocument.info.version]);

  // Manual validation trigger
  const triggerValidation = () => {
    validateDocument(currentDocument);
  };

  // Get validation stats
  const errorCount = validationResult?.errors.length || 0;
  const warningCount = validationResult?.warnings.length || 0;
  const unresolvedCount = validationResult?.unresolvedRefs.length || 0;

  // Get status badge
  const getStatusBadge = () => {
    if (isValidating) {
      return (
        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Validating
        </Badge>
      );
    }
    
    if (errorCount > 0) {
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {errorCount} Error{errorCount !== 1 ? 's' : ''}
        </Badge>
      );
    }
    
    if (warningCount > 0 || unresolvedCount > 0) {
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          {warningCount + unresolvedCount} Warning{warningCount + unresolvedCount !== 1 ? 's' : ''}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Valid
      </Badge>
    );
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>OpenAPI 3.1 Documentation</span>
                  {getStatusBadge()}
                </CardTitle>
                <CardDescription>
                  {currentDocument.info.title || 'Untitled API'} v{currentDocument.info.version || '1.0.0'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerValidation}
                disabled={isValidating}
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Validate</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Validation Summary */}
        {(errorCount > 0 || warningCount > 0 || unresolvedCount > 0) && (
          <>
            <Separator />
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {errorCount === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Errors</p>
                  <p className="text-2xl font-bold">{errorCount}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {warningCount === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Warnings</p>
                  <p className="text-2xl font-bold">{warningCount}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {unresolvedCount === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Unresolved</p>
                  <p className="text-2xl font-bold">{unresolvedCount}</p>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Validation Errors */}
      {validationResult && errorCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Validation Errors</span>
              <Badge variant="outline">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <CardDescription>
              Critical issues that must be resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {validationResult.errors.map((error, index) => (
                  <Alert key={index} className="border-red-500/30 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                            ERROR
                          </Badge>
                          <code className="text-xs font-mono text-muted-foreground">
                            {error.path || 'document'}
                          </code>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {error.message}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Validation Warnings */}
      {validationResult && warningCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Warnings</span>
              <Badge variant="outline">
                {warningCount} warning{warningCount !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <CardDescription>
              Recommendations for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-40">
              <div className="space-y-2">
                {validationResult.warnings.map((warning, index) => (
                  <Alert key={index} className="border-yellow-500/30 bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            WARNING
                          </Badge>
                          <code className="text-xs font-mono text-muted-foreground">
                            {warning.path || 'document'}
                          </code>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          {warning.message}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Unresolved References */}
      {validationResult && unresolvedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Unresolved References</span>
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {unresolvedCount} unresolved
              </Badge>
            </CardTitle>
            <CardDescription>
              $ref references that could not be resolved - these areas will be left empty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-40">
              <div className="space-y-2">
                {validationResult.unresolvedRefs.map((ref, index) => (
                  <Alert key={index} className="border-orange-500/30 bg-orange-500/10">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-mono bg-orange-500/20 px-1 py-0.5 rounded">
                            {ref.ref}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            at {ref.path}
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-400">
                          {ref.reason}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Main Editor */}
      <StructuredCardForms
        document={currentDocument}
        onChange={handleDocumentChange}
      />
    </div>
  );
};

export default OpenAPIDocumentationEditor;