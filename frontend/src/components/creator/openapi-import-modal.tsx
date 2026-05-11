'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Code, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import type { ApiEndpoint } from '@/types/api';

interface OpenAPIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (endpoints: ApiEndpoint[]) => void;
}

export function OpenAPIImportModal({
  isOpen,
  onClose,
  onImport
}: OpenAPIImportModalProps) {
  const [openApiText, setOpenApiText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    endpointCount?: number;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || 
          file.type === 'application/x-yaml' ||
          file.type === 'text/yaml' ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.yaml') ||
          file.name.endsWith('.yml')) {
        setSelectedFile(file);
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setOpenApiText(content);
          validateOpenAPISpec(content);
        };
        reader.readAsText(file);
      } else {
        toast.error('Please select a valid JSON or YAML file');
        event.target.value = '';
      }
    }
  };

  const validateOpenAPISpec = (content: string) => {
    try {
      if (!content.trim()) {
        setValidationResult(null);
        return;
      }

      // Try to parse as JSON first, then YAML
      let spec: any;
      try {
        spec = JSON.parse(content);
      } catch {
        // If JSON parsing fails, assume it's YAML and show a simplified validation
        if (content.includes('openapi:') || content.includes('swagger:')) {
          setValidationResult({
            isValid: true,
            message: 'YAML format detected. Ready to import.',
            endpointCount: estimateEndpointsFromYAML(content)
          });
          return;
        } else {
          throw new Error('Invalid format');
        }
      }

      // Validate OpenAPI structure
      if (!spec.openapi && !spec.swagger) {
        setValidationResult({
          isValid: false,
          message: 'Missing OpenAPI or Swagger version field'
        });
        return;
      }

      if (!spec.paths || typeof spec.paths !== 'object') {
        setValidationResult({
          isValid: false,
          message: 'No valid paths found in specification'
        });
        return;
      }

      const endpointCount = countEndpoints(spec.paths);
      
      setValidationResult({
        isValid: true,
        message: `Valid OpenAPI specification found with ${endpointCount} endpoint${endpointCount !== 1 ? 's' : ''}`,
        endpointCount
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Invalid JSON/YAML format'
      });
    }
  };

  const estimateEndpointsFromYAML = (yamlContent: string): number => {
    const lines = yamlContent.split('\n');
    let count = 0;
    let inPaths = false;
    
    for (const line of lines) {
      if (line.trim() === 'paths:') {
        inPaths = true;
        continue;
      }
      
      if (inPaths) {
        if (line.match(/^[a-zA-Z]/)) {
          // New top-level section
          break;
        }
        
        if (line.match(/^\s{2}\/.*:/)) {
          // Found a path
          count++;
        }
      }
    }
    
    return count;
  };

  const countEndpoints = (paths: any): number => {
    let count = 0;
    for (const path in paths) {
      const pathObj = paths[path];
      for (const method in pathObj) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          count++;
        }
      }
    }
    return count;
  };

  // VALIDATION AND CORRECTION: Make non-compliant OpenAPI documents compliant
  const validateAndCorrectOpenAPISpec = (spec: any): any => {
    // Deep clone the spec to avoid mutating the original
    const correctedSpec = JSON.parse(JSON.stringify(spec));
    
    // Initialize components.schemas if it doesn't exist but we need it later
    if (!correctedSpec.components) {
      correctedSpec.components = {};
    }
    if (!correctedSpec.components.schemas) {
      correctedSpec.components.schemas = {};
    }

    // Process all paths and operations
    if (correctedSpec.paths && typeof correctedSpec.paths === 'object') {
      for (const [pathKey, pathItem] of Object.entries<any>(correctedSpec.paths)) {
        if (!pathItem || typeof pathItem !== 'object') continue;

        for (const [methodKey, operation] of Object.entries<any>(pathItem)) {
          if (!operation || typeof operation !== 'object') continue;
          
          // Skip if not an HTTP method
          if (!['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'].includes(methodKey.toLowerCase())) {
            continue;
          }

          // CORRECTION 1: Replace "body" with "requestBody" if found
          if (operation.body && !operation.requestBody) {
            operation.requestBody = operation.body;
            delete operation.body;
          }

          // CORRECTION 2: Ensure all responses contain both description and content field
          if (operation.responses && typeof operation.responses === 'object') {
            for (const [statusCode, response] of Object.entries<any>(operation.responses)) {
              if (!response || typeof response !== 'object') continue;
              
              // Add description if missing
              if (!response.description) {
                const statusNum = parseInt(statusCode, 10);
                if (statusCode.startsWith('2')) {
                  response.description = 'Successful response';
                } else if (statusNum === 400) {
                  response.description = 'Bad Request';
                } else if (statusNum === 401) {
                  response.description = 'Unauthorized';
                } else if (statusNum === 403) {
                  response.description = 'Forbidden';
                } else if (statusNum === 404) {
                  response.description = 'Not Found';
                } else if (statusNum === 500) {
                  response.description = 'Internal Server Error';
                } else {
                  response.description = `HTTP ${statusCode} response`;
                }
              }
              
              // Add content field if missing but schema exists at root level (misplaced)
              if (!response.content && response.schema) {
                response.content = {
                  'application/json': {
                    schema: response.schema
                  }
                };
                // Remove the misplaced schema
                delete response.schema;
              }
            }
          }

          // CORRECTION 3: Move misplaced schemas to components.schemas
          // Check for schemas defined inline that should be in components
          const moveSchemaToComponents = (schemaObj: any, suggectedName: string): any => {
            // Only move complex object schemas with properties
            if (schemaObj && 
                typeof schemaObj === 'object' && 
                schemaObj.type === 'object' && 
                schemaObj.properties && 
                Object.keys(schemaObj.properties).length > 2) {
              
              // Generate a unique name for this schema
              let schemaName = suggectedName;
              let counter = 1;
              while (correctedSpec.components.schemas[schemaName]) {
                schemaName = `${suggectedName}${counter}`;
                counter++;
              }
              
              // Move schema to components
              correctedSpec.components.schemas[schemaName] = { ...schemaObj };
              
              // Return reference to the moved schema
              return { $ref: `#/components/schemas/${schemaName}` };
            }
            
            return schemaObj;
          };

          // Move request body schemas if they're complex
          if (operation.requestBody && operation.requestBody.content) {
            for (const [contentType, contentObj] of Object.entries<any>(operation.requestBody.content)) {
              if (contentObj && contentObj.schema) {
                const movedSchema = moveSchemaToComponents(
                  contentObj.schema, 
                  `${operation.operationId || methodKey.charAt(0).toUpperCase() + methodKey.slice(1)}Request`
                );
                if (movedSchema !== contentObj.schema) {
                  contentObj.schema = movedSchema;
                }
              }
            }
          }

          // Move response schemas if they're complex
          if (operation.responses) {
            for (const [statusCode, response] of Object.entries<any>(operation.responses)) {
              if (response && response.content) {
                for (const [contentType, contentObj] of Object.entries<any>(response.content)) {
                  if (contentObj && contentObj.schema) {
                    const suffix = statusCode.startsWith('2') ? 'Response' : 'Error';
                    const movedSchema = moveSchemaToComponents(
                      contentObj.schema,
                      `${operation.operationId || methodKey.charAt(0).toUpperCase() + methodKey.slice(1)}${suffix}`
                    );
                    if (movedSchema !== contentObj.schema) {
                      contentObj.schema = movedSchema;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return correctedSpec;
  };

  // STRICT OPENAPI PARSING - Follow exact OpenAPI specification methodology
  const parseOpenAPIToEndpoints = (content: string): ApiEndpoint[] => {
    try {
      // 1. Parse JSON
      let spec = JSON.parse(content);
      
      // 2. VALIDATION AND CORRECTION: Make non-compliant OpenAPI documents compliant
      spec = validateAndCorrectOpenAPISpec(spec);
      
      const endpoints: ApiEndpoint[] = [];

      // 3. Check root object - must have openapi version and paths
      if (!spec.openapi && !spec.swagger) return endpoints;
      if (!spec.paths || typeof spec.paths !== 'object') return endpoints;

      // 4. Helper function to resolve schema references - only if they exist
      const resolveSchemaRef = (schema: any): any => {
        if (!schema) return null;
        
        if (schema.$ref) {
          const refPath = schema.$ref.replace('#/', '').split('/');
          let resolved = spec;
          for (const part of refPath) {
            resolved = resolved?.[part];
            if (!resolved) return null;
          }
          // Recursively resolve any nested $refs
          return resolveSchemaRef(resolved);
        }
        
        // Handle schemas with nested $refs in properties, items, etc. - only if they exist
        if (schema.properties) {
          const resolvedProperties: any = {};
          for (const [key, value] of Object.entries<any>(schema.properties)) {
            const resolved = resolveSchemaRef(value);
            if (resolved !== null) {
              resolvedProperties[key] = resolved;
            } else {
              resolvedProperties[key] = value;
            }
          }
          schema = { ...schema, properties: resolvedProperties };
        }
        
        if (schema.items) {
          const resolvedItems = resolveSchemaRef(schema.items);
          if (resolvedItems !== null) {
            schema = { ...schema, items: resolvedItems };
          }
        }
        
        return schema;
      };

      // 5. STRICT: ONLY use examples that exist in the spec - NEVER generate
      const getExampleFromSchema = (schema: any): any => {
        if (!schema || typeof schema !== 'object') return null;

        const resolvedSchema = resolveSchemaRef(schema);
        if (!resolvedSchema) return null;
        
        // STRICT: Use example ONLY if provided in OpenAPI spec
        if (resolvedSchema.example !== undefined) {
          return resolvedSchema.example;
        }
        
        // STRICT: Use default ONLY if provided in OpenAPI spec
        if (resolvedSchema.default !== undefined) {
          return resolvedSchema.default;
        }
        
        // STRICT: Use enum first value ONLY if provided in OpenAPI spec
        if (resolvedSchema.enum && resolvedSchema.enum.length > 0) {
          return resolvedSchema.enum[0];
        }
        
        // STRICT: Do NOT generate any examples - return null if none exist
        return null;
      };

      // 6. Parse paths - each key like "/users/register" is an endpoint path
      for (const [path, pathItem] of Object.entries<any>(spec.paths)) {
        if (!pathItem || typeof pathItem !== 'object') continue;
        
        // 7. Inside each path, each HTTP method (get, post, etc.) describes an operation
        for (const [method, operation] of Object.entries<any>(pathItem)) {
          // Skip if not a valid HTTP method
          if (!['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'].includes(method.toLowerCase())) {
            continue;
          }
          
          if (!operation || typeof operation !== 'object') continue;

          // 8. For each operation, read its details ONLY if they exist - STRICTLY NO GENERATION
          const endpoint: ApiEndpoint = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            path,
            method: method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
            // STRICT: Use summary if exists, otherwise operationId, otherwise empty - don't generate
            title: operation.summary || operation.operationId || '',
            // STRICT: Use description if exists, otherwise empty - don't generate
            description: operation.description || '',
            isActive: true,
            planRestrictions: [],
            parameters: [],
            pathParameters: [],
            exampleRequests: [],
            exampleResponses: [],
            responseSchema: '',
            requestSchema: '',
            errorCodes: [],
            requiredPlan: 'free',
            rateLimit: {
              enabled: false,
              value: 100,
              period: 'minute'
            },
            quota: {
              enabled: false,
              value: 1000,
              period: 'month'
            },
            backendUrl: path,
            responseTime: 120,
            errorRate: 0,
            callsToday: 0
          };

          // 8a. Check "security" - ONLY if it exists
          if (operation.security !== undefined) {
            // Security exists but we don't use it in our endpoint structure
            // Just acknowledge it exists in the spec
          }

          // 8b. Check "deprecated" flag - ONLY if it exists  
          if (operation.deprecated === true) {
            // Mark as inactive if deprecated
            endpoint.isActive = false;
          }

          // 9. Parse "parameters" - ONLY if it exists and is array
          if (operation.parameters && Array.isArray(operation.parameters)) {
            operation.parameters.forEach((param: any) => {
              if (!param) return;
              
              const resolvedParam = param.$ref ? resolveSchemaRef(param) : param;
              if (!resolvedParam || !resolvedParam.name || !resolvedParam.in) return;
              
              // Each parameter has fields: name, in, description (optional), required, schema
              if (resolvedParam.in === 'query' || resolvedParam.in === 'header' || resolvedParam.in === 'cookie') {
                endpoint.parameters?.push({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  name: resolvedParam.name, // REQUIRED field - must exist
                  type: resolvedParam.schema?.type || 'string', // Use schema.type if exists
                  required: Boolean(resolvedParam.required), // Use boolean value if exists, false if not
                  description: resolvedParam.description || '', // Use if exists, empty if not
                  example: resolvedParam.example || resolvedParam.schema?.example || '' // Use example if provided
                });
              } else if (resolvedParam.in === 'path') {
                endpoint.pathParameters?.push({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  name: resolvedParam.name,
                  type: resolvedParam.schema?.type === 'integer' ? 'integer' : 
                        resolvedParam.schema?.format === 'uuid' ? 'UUID' :
                        resolvedParam.schema?.type === 'boolean' ? 'boolean' : 'string',
                  description: resolvedParam.description || ''
                });
              }
            });
          }

          // 10. Parse "requestBody" if present - has description, required, content
          if (operation.requestBody && typeof operation.requestBody === 'object') {
            const requestBody = operation.requestBody.$ref ? resolveSchemaRef(operation.requestBody) : operation.requestBody;
            
            if (requestBody && requestBody.content && typeof requestBody.content === 'object') {
              // Content maps media types to schemas - only use what exists
              for (const [contentType, contentSpec] of Object.entries<any>(requestBody.content)) {
                if (contentSpec && contentSpec.schema) {
                  const resolvedSchema = resolveSchemaRef(contentSpec.schema);
                  if (resolvedSchema) {
                    endpoint.requestSchema = JSON.stringify(resolvedSchema, null, 2);
                    
                    // Use examples ONLY if they exist in the spec
                    let exampleData: any = null;
                    if (contentSpec.examples && typeof contentSpec.examples === 'object') {
                      const exampleKeys = Object.keys(contentSpec.examples);
                      if (exampleKeys.length > 0) {
                        exampleData = contentSpec.examples[exampleKeys[0]]?.value;
                      }
                    } else if (contentSpec.example !== undefined) {
                      exampleData = contentSpec.example;
                    }
                    
                    // STRICT: Only add example if one was actually provided in the spec
                    if (exampleData !== null) {
                      endpoint.exampleRequests?.push({
                        id: Date.now().toString(),
                        language: 'json',
                        code: JSON.stringify(exampleData, null, 2)
                      });
                    }
                    
                    // Found a schema, break out of the loop
                    break;
                  }
                }
              }
            }
          }

          // 11. Parse "responses" - maps status codes to responses
          if (operation.responses && typeof operation.responses === 'object') {
            let mainResponseSchema: any = null;
            const errorCodes: Array<{ 
              id: string; 
              code: string; 
              statusCode: number; 
              statusDescription?: string;
              description: string; 
              example: string; 
            }> = [];

            // Each key (200, 400, 500, etc.) is a status code with description and content
            for (const [statusCode, response] of Object.entries<any>(operation.responses)) {
              if (!response) continue;
              
              const resolvedResponse = response.$ref ? resolveSchemaRef(response) : response;
              if (!resolvedResponse) continue;
              
              const statusCodeNum = parseInt(statusCode, 10);
              
              if (statusCode.startsWith('2')) {
                // SUCCESS RESPONSES (2xx) - only extract if content exists
                if (resolvedResponse.content && typeof resolvedResponse.content === 'object') {
                  for (const [contentType, contentSpec] of Object.entries<any>(resolvedResponse.content)) {
                    if (contentSpec && contentSpec.schema) {
                      const resolvedSchema = resolveSchemaRef(contentSpec.schema);
                      if (resolvedSchema && !mainResponseSchema) {
                        mainResponseSchema = resolvedSchema;
                        
                        // Use example ONLY if provided in spec
                        let exampleData: any = null;
                        if (contentSpec.examples && typeof contentSpec.examples === 'object') {
                          const exampleKeys = Object.keys(contentSpec.examples);
                          if (exampleKeys.length > 0) {
                            exampleData = contentSpec.examples[exampleKeys[0]]?.value;
                          }
                        } else if (contentSpec.example !== undefined) {
                          exampleData = contentSpec.example;
                        }
                        
                        // Only add if example exists in spec
                        if (exampleData !== null) {
                          endpoint.exampleResponses?.push({
                            id: Date.now().toString() + statusCode,
                            language: 'json',
                            code: JSON.stringify(exampleData, null, 2)
                          });
                        }
                        break;
                      }
                    }
                  }
                }
              } else {
                // ERROR RESPONSES (non-2xx) - extract ONLY what exists
                let errorExample: any = null;
                
                if (resolvedResponse.content && typeof resolvedResponse.content === 'object') {
                  // Look for application/json content specifically
                  const jsonContent = resolvedResponse.content['application/json'];
                  if (jsonContent) {
                    if (jsonContent.examples && typeof jsonContent.examples === 'object') {
                      const exampleKeys = Object.keys(jsonContent.examples);
                      if (exampleKeys.length > 0) {
                        errorExample = jsonContent.examples[exampleKeys[0]]?.value;
                      }
                    } else if (jsonContent.example !== undefined) {
                      errorExample = jsonContent.example;
                    }
                  }
                }
                
                // Only add error code if we have required fields
                errorCodes.push({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  code: statusCode,
                  statusCode: statusCodeNum,
                  statusDescription: getStatusDescription(statusCodeNum),
                  description: resolvedResponse.description || '', // Use description if exists, empty if not
                  example: errorExample !== null ? JSON.stringify(errorExample, null, 2) : '' // Only use if exists
                });
              }
            }

            // Set response schema - only if we found one, otherwise leave empty
            endpoint.errorCodes = errorCodes;
            endpoint.responseSchema = mainResponseSchema ? 
              JSON.stringify(mainResponseSchema, null, 2) : '';
          }

          // 12. STRICT: Only generate basic code examples if servers exist in spec
          if (spec.servers && spec.servers.length > 0 && spec.servers[0].url) {
            const baseUrl = spec.servers[0].url;
            endpoint.exampleRequests?.push({
              id: Date.now().toString() + '1',
              language: 'curl',
              code: generateCurlExample(endpoint, baseUrl)
            });

            endpoint.exampleRequests?.push({
              id: Date.now().toString() + '2', 
              language: 'javascript',
              code: generateJavaScriptExample(endpoint, baseUrl)
            });
          }

          endpoints.push(endpoint);
        }
      }

      return endpoints;
    } catch (error) {
      throw new Error('Failed to parse OpenAPI specification: ' + (error as Error).message);
    }
  };

  // Helper function to get standard HTTP status descriptions
  const getStatusDescription = (statusCode: number): string => {
    const descriptions: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized', 
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout'
    };
    return descriptions[statusCode] || `HTTP ${statusCode}`;
  };

  const generateCurlExample = (endpoint: ApiEndpoint, baseUrl: string): string => {
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
    
    // STRICT: Add query parameters only if they have examples in the spec
    const queryParams = endpoint.parameters?.filter(p => p.required && p.example) || [];
    if (queryParams.length > 0) {
      const params = queryParams.map(p => `${p.name}=${p.example}`).join('&');
      curl = curl.replace(endpoint.path, `${endpoint.path}?${params}`);
    }
    
    curl += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    curl += ` \\\n  -H "Content-Type: application/json"`;
    
    // STRICT: Add request body only if requestSchema exists AND we have actual examples
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.requestSchema && endpoint.exampleRequests?.length) {
      const jsonExample = endpoint.exampleRequests.find(ex => ex.language === 'json');
      if (jsonExample) {
        curl += ` \\\n  -d '${jsonExample.code}'`;
      }
    }
    
    return curl;
  };

  const generateJavaScriptExample = (endpoint: ApiEndpoint, baseUrl: string): string => {
    let js = `const response = await fetch('${baseUrl}${endpoint.path}`;
    
    // STRICT: Add query parameters only if they have examples in the spec
    const queryParams = endpoint.parameters?.filter(p => p.required && p.example) || [];
    if (queryParams.length > 0) {
      const params = queryParams.map(p => `${p.name}=${encodeURIComponent(p.example)}`).join('&');
      js += `?${params}`;
    }
    
    js += `', {\n  method: '${endpoint.method}',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  }`;
    
    // STRICT: Add request body only if we have actual examples from the spec
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.exampleRequests?.length) {
      const jsonExample = endpoint.exampleRequests.find(ex => ex.language === 'json');
      if (jsonExample) {
        js += `,\n  body: JSON.stringify(${jsonExample.code})`;
      }
    }
    
    js += `\n});\n\nconst data = await response.json();\nconsole.log(data);`;
    
    return js;
  };

  // Helper function for generating examples (defined in parseOpenAPIToEndpoints scope)
  const generateExampleFromSchemaHelper = (schema: any): any => {
    if (!schema || typeof schema !== 'object') return null;
    
    switch (schema.type) {
      case 'string':
        return schema.example || 'string';
      case 'number':
      case 'integer':
        return schema.example || 123;
      case 'boolean':
        return schema.example !== undefined ? schema.example : true;
      case 'array':
        const itemExample = schema.items ? generateExampleFromSchemaHelper(schema.items) : 'item';
        return [itemExample];
      case 'object':
        const obj: any = {};
        if (schema.properties) {
          for (const [propName, propSchema] of Object.entries<any>(schema.properties)) {
            obj[propName] = generateExampleFromSchemaHelper(propSchema);
          }
        }
        return obj;
      default:
        return schema.example || null;
    }
  };

  const handleImport = async () => {
    if (!openApiText.trim()) {
      toast.error('Please provide an OpenAPI specification');
      return;
    }

    if (!validationResult?.isValid) {
      toast.error('Please fix validation errors before importing');
      return;
    }

    setIsProcessing(true);

    try {
      // For YAML content, we'll show a simplified import
      if (openApiText.includes('openapi:') || openApiText.includes('swagger:')) {
        if (!openApiText.includes('{')) {
          // This is likely YAML
          toast.error('YAML parsing is not fully implemented yet. Please convert to JSON format first.');
          setIsProcessing(false);
          return;
        }
      }

      const endpoints = parseOpenAPIToEndpoints(openApiText);
      
      if (endpoints.length === 0) {
        toast.error('No valid endpoints found in the specification');
        setIsProcessing(false);
        return;
      }

      toast.success(`Successfully parsed ${endpoints.length} endpoint${endpoints.length !== 1 ? 's' : ''}`);
      onImport(endpoints);
      onClose();
      
      // Reset form
      setOpenApiText('');
      setSelectedFile(null);
      setValidationResult(null);
    } catch (error) {
      toast.error('Failed to import OpenAPI specification');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOpenApiText('');
    setSelectedFile(null);
    setValidationResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>Import via OpenAPI</span>
          </DialogTitle>
          <DialogDescription>
            Import endpoints from an OpenAPI (Swagger) specification. You can paste JSON/YAML text or upload a file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="paste" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Paste Text</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload File</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openapi-text">OpenAPI Specification (JSON or YAML)</Label>
                <Textarea
                  id="openapi-text"
                  placeholder="Paste your OpenAPI specification here..."
                  value={openApiText}
                  onChange={(e) => {
                    setOpenApiText(e.target.value);
                    validateOpenAPISpec(e.target.value);
                  }}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload OpenAPI File</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a JSON or YAML file containing your OpenAPI specification
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".json,.yaml,.yml,application/json,application/x-yaml,text/yaml"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="openapi-file"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="openapi-file" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                    {selectedFile && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {openApiText && (
                <div className="space-y-2">
                  <Label>File Contents Preview</Label>
                  <Textarea
                    value={openApiText}
                    readOnly
                    className="min-h-[200px] font-mono text-sm bg-muted"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <Alert className={validationResult.isValid ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}>
            <div className="flex items-center space-x-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={validationResult.isValid ? 'text-green-700' : 'text-red-700'}>
                {validationResult.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!validationResult?.isValid || isProcessing}
            className="min-w-32"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Endpoints'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}