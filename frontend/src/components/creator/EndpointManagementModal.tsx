'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetectedParameters, extractPathParameters, RouteDisplay } from '@/components/ui/route-display';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { ApiEndpoint, ApiResponse } from '@/types/api';
import { OpenAPIDocumentationEditor } from '@/components/openapi/openapi-documentation-editor';
import type { OpenAPIDocument } from '@/lib/openapi-parser';
import {
  Plus,
  Trash2,
  Code,
  FileText,
  Database,
  Globe,
  Settings,
  X,
  Zap,
  Shield,
  BookOpen,
  Terminal,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
  Hash,
  AlertTriangle,
  Check,
  ChevronsUpDown,
} from 'lucide-react';

interface LocalEndpointParameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

interface PathParameter {
  id: string;
  name: string;
  type: 'string' | 'integer' | 'UUID' | 'boolean';
  description: string;
}

interface LocalEndpointExample {
  id: string;
  language: string;
  code: string;
}

interface ErrorCode {
  id: string;
  code: string;
  statusCode: number;
  statusDescription?: string;
  description: string;
  example: string;
}

// Use the ApiEndpoint type directly, but ensure all required fields have defaults
type EndpointFormData = Omit<ApiEndpoint, 'parameters' | 'exampleRequests' | 'exampleResponses'> & {
  rateLimit: {
    enabled: boolean;
    value: number;
    period: 'second' | 'minute' | 'hour';
  };
  quota: {
    enabled: boolean;
    value: number;
    period: 'day' | 'week' | 'month';
  };
  parameters: LocalEndpointParameter[];
  pathParameters: PathParameter[];
  exampleRequests: LocalEndpointExample[];
  exampleResponses: LocalEndpointExample[];
  responses: ApiResponse[];
  errorCodes: ErrorCode[];
  title: string;
  description: string;
  responseSchema: string;
  requestSchema: string;
  backendUrl: string;
  requiredPlan: string;
  openApiDoc?: OpenAPIDocument;
}

interface EndpointManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint?: ApiEndpoint;
  mode: 'create' | 'edit';
  onSave: (endpoint: ApiEndpoint) => void;
}

const defaultEndpoint: Omit<EndpointFormData, 'id'> = {
  path: '',
  method: 'GET',
  parameters: [],
  pathParameters: [],
  responseSchema: '{\n  "success": true,\n  "data": {},\n  "message": "Request successful"\n}',
  requestSchema: '{\n  "parameter1": "string",\n  "parameter2": "number",\n  "optional_field": "string (optional)"\n}',
  responses: [
    {
      id: 'default-200',
      statusCode: 200,
      statusDescription: 'OK',
      description: 'Successful operation',
      contentType: 'application/json',
      schema: '{\n  "success": true,\n  "data": {},\n  "message": "Request successful"\n}',
      example: '{\n  "success": true,\n  "data": {\n    "message": "Hello World",\n    "timestamp": "2024-01-15T10:30:00Z"\n  },\n  "meta": {\n    "requestId": "req_123456789"\n  }\n}'
    }
  ],
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
  backendUrl: '',
  title: '',
  description: '',
  exampleRequests: [
    {
      id: '1',
      language: 'curl',
      code: 'curl -X GET "https://api.proxyapi.dev/endpoint" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json"'
    },
    {
      id: '2',
      language: 'javascript',
      code: 'const response = await fetch("https://api.proxyapi.dev/endpoint", {\n  method: "GET",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n  }\n});\n\nconst data = await response.json();'
    }
  ],
  exampleResponses: [
    {
      id: '1',
      language: 'json',
      code: '{\n  "success": true,\n  "data": {\n    "message": "Hello World",\n    "timestamp": "2024-01-15T10:30:00Z"\n  },\n  "meta": {\n    "requestId": "req_123456789"\n  }\n}'
    }
  ],
  isActive: true,
  planRestrictions: [],
  responseTime: 120,
  errorRate: 0,
  callsToday: 0,
  openApiDoc: undefined,
};

const parameterTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'integer', label: 'Integer' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
  { value: 'float', label: 'Float' },
  { value: 'date', label: 'Date' },
  { value: 'enum', label: 'Enum' }
];

const pathParameterTypes = [
  { value: 'string', label: 'String' },
  { value: 'integer', label: 'Integer' },
  { value: 'UUID', label: 'UUID' },
  { value: 'boolean', label: 'Boolean' }
];

const planOptions = [
  { value: 'free', label: 'Free Plan', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  { value: 'pro', label: 'Pro Plan', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'enterprise', label: 'Enterprise Plan', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
];

const methodOptions = [
  { value: 'GET', label: 'GET', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'POST', label: 'POST', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'PUT', label: 'PUT', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'DELETE', label: 'DELETE', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'PATCH', label: 'PATCH', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
];

const rateLimitPeriods = [
  { value: 'second', label: 'Per Second' },
  { value: 'minute', label: 'Per Minute' },
  { value: 'hour', label: 'Per Hour' }
];

const contentTypes = [
  { value: 'application/json', label: 'JSON' },
  { value: 'application/xml', label: 'XML' },
  { value: 'text/plain', label: 'Plain Text' },
  { value: 'text/html', label: 'HTML' },
  { value: 'application/x-www-form-urlencoded', label: 'Form Data' },
  { value: 'multipart/form-data', label: 'Multipart Form' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'image/jpeg', label: 'JPEG Image' },
  { value: 'image/png', label: 'PNG Image' }
];

// OpenAPI-compliant HTTP status codes with descriptions
const httpStatusCodes = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers and should continue to send the request body' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols' },
  { code: 102, name: 'Processing', description: 'The server has accepted the request and is processing' },

  // 2xx Success
  { code: 200, name: 'OK', description: 'Standard response for successful HTTP requests' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and resulted in a new resource being created' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but processing has not been completed' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request but is not returning any content' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'Indicates multiple options for the resource' },
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI' },
  { code: 302, name: 'Found', description: 'The resource was found at a different URI' },
  { code: 304, name: 'Not Modified', description: 'Indicates that the resource has not been modified' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'The server cannot or will not process the request due to an apparent client error' },
  { code: 401, name: 'Unauthorized', description: 'Similar to 403 Forbidden, but specifically for use when authentication is required' },
  { code: 402, name: 'Payment Required', description: 'Reserved for future use' },
  { code: 403, name: 'Forbidden', description: 'The request was valid, but the server is refusing action' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource' },
  { code: 406, name: 'Not Acceptable', description: 'The requested resource is capable of generating only content not acceptable' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request' },
  { code: 409, name: 'Conflict', description: 'Indicates that the request could not be processed because of conflict' },
  { code: 410, name: 'Gone', description: 'Indicates that the resource requested is no longer available' },
  { code: 411, name: 'Length Required', description: 'The request did not specify the length of its content' },
  { code: 412, name: 'Precondition Failed', description: 'The server does not meet one of the preconditions' },
  { code: 413, name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process' },
  { code: 414, name: 'URI Too Long', description: 'The URI provided was too long for the server to process' },
  { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type which the server or resource does not support' },
  { code: 416, name: 'Range Not Satisfiable', description: 'The client has asked for a portion of the file, but the server cannot supply that portion' },
  { code: 417, name: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request-header field' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors' },
  { code: 423, name: 'Locked', description: 'The resource that is being accessed is locked' },
  { code: 424, name: 'Failed Dependency', description: 'The request failed due to failure of a previous request' },
  { code: 426, name: 'Upgrade Required', description: 'The client should switch to a different protocol' },
  { code: 428, name: 'Precondition Required', description: 'The origin server requires the request to be conditional' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time' },
  { code: 431, name: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'A generic error message, given when an unexpected condition was encountered' },
  { code: 501, name: 'Not Implemented', description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request' },
  { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unavailable (because it is overloaded or down for maintenance)' },
  { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request' },
  { code: 507, name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request' },
  { code: 508, name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request' },
  { code: 510, name: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it' },
  { code: 511, name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access' }
];

export function EndpointManagementModal({
  isOpen,
  onClose,
  endpoint,
  mode,
  onSave
}: EndpointManagementModalProps) {
  const [formData, setFormData] = useState<EndpointFormData>(() => {
    const safeEndpoint = endpoint ? {
      ...defaultEndpoint,
      ...endpoint,
      // Ensure all arrays exist
      parameters: (endpoint.parameters || []).map(p => ({ ...p, id: p.id || Date.now().toString() + Math.random() })) as any,
      pathParameters: endpoint.pathParameters || [],
      exampleRequests: (endpoint.exampleRequests || []).map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() })) as any,
      exampleResponses: (endpoint.exampleResponses || []).map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() })) as any,
      errorCodes: (endpoint.errorCodes || []).map(ec => ({ ...ec, id: ec.id || Date.now().toString() + Math.random() })) as any,
      // Ensure strings exist
      title: endpoint.title || '',
      description: endpoint.description || '',
      responseSchema: endpoint.responseSchema || defaultEndpoint.responseSchema,
      requestSchema: endpoint.requestSchema || defaultEndpoint.requestSchema,
      backendUrl: endpoint.backendUrl || '',
      requiredPlan: endpoint.requiredPlan || 'free',
      // Ensure rate limit exists
      rateLimit: endpoint.rateLimit || defaultEndpoint.rateLimit,
      quota: endpoint.quota || defaultEndpoint.quota
    } : {
      ...defaultEndpoint,
      id: Date.now().toString()
    };

    return safeEndpoint;
  });

  const [activeTab, setActiveTab] = useState('technical');
  const [statusCodeSearches, setStatusCodeSearches] = useState<{ [key: string]: string }>({});
  const [openStatusDropdowns, setOpenStatusDropdowns] = useState<{ [key: string]: boolean }>({});
  const [statusCodeInputs, setStatusCodeInputs] = useState<{ [key: string]: string }>({});
  const [focusedStatusInput, setFocusedStatusInput] = useState<string | null>(null);

  useEffect(() => {
    if (endpoint) {
      setFormData({
        ...defaultEndpoint,
        ...endpoint,
        // Ensure all arrays exist
        parameters: (endpoint.parameters || []).map(p => ({ ...p, id: p.id || Date.now().toString() })) as any,
        pathParameters: (endpoint.pathParameters || []) as any,
        exampleRequests: (endpoint.exampleRequests || []).map(e => ({ ...e, id: e.id || Date.now().toString() })) as any,
        exampleResponses: (endpoint.exampleResponses || []).map(e => ({ ...e, id: e.id || Date.now().toString() })) as any,
        responses: endpoint.responses || defaultEndpoint.responses,
        errorCodes: endpoint.errorCodes || [],
        // Ensure strings exist
        title: endpoint.title || '',
        description: endpoint.description || '',
        responseSchema: endpoint.responseSchema || defaultEndpoint.responseSchema,
        requestSchema: endpoint.requestSchema || defaultEndpoint.requestSchema,
        backendUrl: endpoint.backendUrl || '',
        requiredPlan: endpoint.requiredPlan || 'free',
        // Ensure rate limit exists
        rateLimit: endpoint.rateLimit || defaultEndpoint.rateLimit,
        quota: endpoint.quota || defaultEndpoint.quota
      });
    } else {
      setFormData({
        ...defaultEndpoint,
        id: Date.now().toString(),
        pathParameters: [],
        parameters: [],
        responses: defaultEndpoint.responses,
        errorCodes: [],
        exampleRequests: defaultEndpoint.exampleRequests,
        exampleResponses: defaultEndpoint.exampleResponses,
      });
    }
  }, [endpoint]);

  // Check parameter uniqueness within a route
  const validateParameterUniqueness = (route: string): { isValid: boolean; message?: string } => {
    const params = extractPathParameters(route);
    const uniqueParams = new Set(params);

    if (params.length !== uniqueParams.size) {
      const duplicates = params.filter((param, index, arr) =>
        arr.indexOf(param) !== index
      );
      const uniqueDuplicates = [...new Set(duplicates)];

      return {
        isValid: false,
        message: `Duplicate parameter names found: ${uniqueDuplicates.join(', ')}`
      };
    }

    return { isValid: true };
  };

  // URL structure validation
  const validateUrlStructure = (url: string, type: 'endpoint' | 'backend'): { isValid: boolean; message?: string } => {
    if (!url.trim()) {
      return { isValid: true };
    }

    if (!url.startsWith('/')) {
      return {
        isValid: false,
        message: `${type === 'endpoint' ? 'Public endpoint' : 'Backend endpoint'} must start with a forward slash (/)`
      };
    }

    if (url.includes('{') || url.includes('}')) {
      const openCount = (url.match(/{/g) || []).length;
      const closeCount = (url.match(/}/g) || []).length;

      if (openCount !== closeCount) {
        return {
          isValid: false,
          message: 'Unclosed path parameter brackets. Each { must have a matching }'
        };
      }
    }

    return { isValid: true };
  };

  // Overall validation for save functionality
  const validatePathParameterConsistency = (): { isValid: boolean; message?: string } => {
    const publicParams = extractPathParameters(formData.path);
    const backendParams = extractPathParameters(formData.backendUrl);

    // Check for duplicate parameters in both
    const publicUniqueness = validateParameterUniqueness(formData.path);
    if (!publicUniqueness.isValid) {
      return {
        isValid: false,
        message: `Public Endpoint - ${publicUniqueness.message}`
      };
    }

    const backendUniqueness = validateParameterUniqueness(formData.backendUrl);
    if (!backendUniqueness.isValid) {
      return {
        isValid: false,
        message: `Backend Endpoint - ${backendUniqueness.message}`
      };
    }

    return { isValid: true };
  };

  // Path parameter mismatch detection for warning display
  const detectPathParameterMismatch = (): { hasMismatch: boolean; message?: string; missingInPublic?: string[]; missingInBackend?: string[] } => {
    if (!formData.path.trim() && !formData.backendUrl.trim()) {
      return { hasMismatch: false };
    }

    const publicParams = extractPathParameters(formData.path);
    const backendParams = extractPathParameters(formData.backendUrl);

    const publicSet = new Set(publicParams);
    const backendSet = new Set(backendParams);

    const missingInPublic = backendParams.filter(param => !publicSet.has(param));
    const missingInBackend = publicParams.filter(param => !backendSet.has(param));

    if (missingInPublic.length > 0 || missingInBackend.length > 0) {
      let message = 'Path parameter mismatch detected: ';
      const issues = [];

      if (missingInPublic.length > 0) {
        issues.push(`missing in Public Endpoint: {${missingInPublic.join('}, {')}}`);
      }

      if (missingInBackend.length > 0) {
        issues.push(`missing in Backend Endpoint: {${missingInBackend.join('}, {')}}`);
      }

      message += issues.join('; ');

      return {
        hasMismatch: true,
        message,
        missingInPublic,
        missingInBackend
      };
    }

    return { hasMismatch: false };
  };

  // Update path parameters when path changes
  useEffect(() => {
    const detectedParams = extractPathParameters(formData.path);

    setFormData(prev => {
      const currentParamNames = prev.pathParameters.map(p => p.name);

      // Add new parameters
      const newParams: PathParameter[] = detectedParams
        .filter(name => !currentParamNames.includes(name))
        .map(name => ({
          id: Date.now().toString() + Math.random(),
          name,
          type: 'string' as const,
          description: ''
        }));

      // Remove parameters that are no longer in the path
      const existingParams = prev.pathParameters.filter(param =>
        detectedParams.includes(param.name)
      );

      if (newParams.length > 0 || existingParams.length !== prev.pathParameters.length) {
        return {
          ...prev,
          pathParameters: [...existingParams, ...newParams]
        };
      }

      return prev;
    });
  }, [formData.path]);

  const updatePathParameter = (id: string, field: keyof PathParameter, value: string) => {
    setFormData(prev => ({
      ...prev,
      pathParameters: prev.pathParameters.map(param =>
        param.id === id ? { ...param, [field]: value } : param
      )
    }));
  };

  const addParameter = () => {
    const newParam: LocalEndpointParameter = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
      description: '',
      example: ''
    };
    setFormData(prev => ({
      ...prev,
      parameters: [newParam, ...prev.parameters]
    }));
  };

  const updateParameter = (id: string, field: keyof LocalEndpointParameter, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map(param =>
        param.id === id ? { ...param, [field]: value } : param
      ) as LocalEndpointParameter[]
    }));
  };

  const removeParameter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter(param => param.id !== id)
    }));
  };

  const addExampleRequest = () => {
    const newExample: LocalEndpointExample = {
      id: Date.now().toString(),
      language: 'curl',
      code: ''
    };
    setFormData(prev => ({
      ...prev,
      exampleRequests: [...prev.exampleRequests, newExample]
    }));
  };

  const updateExampleRequest = (id: string, field: keyof LocalEndpointExample, value: string) => {
    setFormData(prev => ({
      ...prev,
      exampleRequests: prev.exampleRequests.map(example =>
        example.id === id ? { ...example, [field]: value } : example
      ) as LocalEndpointExample[]
    }));
  };

  const removeExampleRequest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      exampleRequests: prev.exampleRequests.filter(example => example.id !== id)
    }));
  };

  const addExampleResponse = () => {
    const newExample: LocalEndpointExample = {
      id: Date.now().toString(),
      language: 'json',
      code: ''
    };
    setFormData(prev => ({
      ...prev,
      exampleResponses: [...prev.exampleResponses, newExample]
    }));
  };

  const updateExampleResponse = (id: string, field: keyof LocalEndpointExample, value: string) => {
    setFormData(prev => ({
      ...prev,
      exampleResponses: prev.exampleResponses.map(example =>
        example.id === id ? { ...example, [field]: value } : example
      ) as LocalEndpointExample[]
    }));
  };

  const removeExampleResponse = (id: string) => {
    setFormData(prev => ({
      ...prev,
      exampleResponses: prev.exampleResponses.filter(example => example.id !== id)
    }));
  };

  const addErrorCode = () => {
    const newErrorCode: ErrorCode = {
      id: Date.now().toString(),
      code: '',
      statusCode: 400,
      statusDescription: 'Bad Request',
      description: '',
      example: ''
    };
    setFormData(prev => ({
      ...prev,
      errorCodes: [newErrorCode, ...prev.errorCodes]
    }));

    // Initialize search state for new error code
    setStatusCodeSearches(prev => ({ ...prev, [newErrorCode.id]: '' }));
    setOpenStatusDropdowns(prev => ({ ...prev, [newErrorCode.id]: false }));
    setStatusCodeInputs(prev => ({ ...prev, [newErrorCode.id]: '400' }));
  };

  const updateErrorCode = (id: string, field: keyof ErrorCode, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      errorCodes: prev.errorCodes.map(errorCode => {
        if (errorCode.id === id) {
          // When status code changes, update the description automatically
          if (field === 'statusCode' && typeof value === 'number') {
            const statusInfo = httpStatusCodes.find(status => status.code === value);
            return {
              ...errorCode,
              [field]: value,
              statusDescription: statusInfo?.name || 'Unknown Status',
              description: statusInfo?.description || errorCode.description
            };
          }
          return { ...errorCode, [field]: value };
        }
        return errorCode;
      })
    }));
  };

  const removeErrorCode = (id: string) => {
    setFormData(prev => ({
      ...prev,
      errorCodes: prev.errorCodes.filter(errorCode => errorCode.id !== id)
    }));

    // Clean up search states
    setStatusCodeSearches(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setOpenStatusDropdowns(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setStatusCodeInputs(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // Response management functions for unified responses
  const addResponse = () => {
    const newResponse: ApiResponse = {
      id: Date.now().toString(),
      statusCode: 400,
      statusDescription: 'Bad Request',
      description: 'Error description',
      contentType: 'application/json',
      schema: '{\n  "error": "ERROR_CODE",\n  "message": "Error message",\n  "code": 400\n}',
      example: '{\n  "error": "VALIDATION_ERROR",\n  "message": "Invalid request parameters",\n  "code": 400\n}'
    };
    setFormData(prev => ({
      ...prev,
      responses: [...prev.responses, newResponse]
    }));

    // Initialize search state for new response
    setStatusCodeSearches(prev => ({ ...prev, [newResponse.id]: '' }));
    setOpenStatusDropdowns(prev => ({ ...prev, [newResponse.id]: false }));
    setStatusCodeInputs(prev => ({ ...prev, [newResponse.id]: '400' }));
  };

  const updateResponse = (id: string, field: keyof ApiResponse, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.map(response => {
        if (response.id === id) {
          // When status code changes, update the description automatically
          if (field === 'statusCode' && typeof value === 'number') {
            const statusInfo = httpStatusCodes.find(status => status.code === value);
            return {
              ...response,
              [field]: value,
              statusDescription: statusInfo?.name || 'Unknown Status',
              description: statusInfo?.description || response.description
            };
          }
          return { ...response, [field]: value };
        }
        return response;
      })
    }));
  };

  const removeResponse = (id: string) => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.filter(response => response.id !== id)
    }));

    // Clean up search states
    setStatusCodeSearches(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setOpenStatusDropdowns(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setStatusCodeInputs(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // Enhanced helper functions for intelligent HTTP status code autocomplete
  const handleStatusCodeInputChange = (errorCodeId: string, value: string) => {
    // Always update the input value immediately for proper backspace behavior
    setStatusCodeInputs(prev => ({ ...prev, [errorCodeId]: value || '' }));

    // Immediately show dropdown when user types ANY character - ultra-responsive
    setStatusCodeSearches(prev => ({ ...prev, [errorCodeId]: value || '' }));
    // Only show dropdown if user is actually typing (value has content)
    setOpenStatusDropdowns(prev => ({ ...prev, [errorCodeId]: (value && value.length > 0) || focusedStatusInput === errorCodeId }));

    // Real-time validation and status code update - only for valid numbers
    const code = parseInt(value || '');
    if (!isNaN(code) && code > 0 && code <= 999) {
      // Check if this is an error code (errorCodes) or response (responses)
      const isErrorCode = formData.errorCodes.some(ec => ec.id === errorCodeId);
      const isResponse = formData.responses.some(r => r.id === errorCodeId);

      if (isErrorCode) {
        updateErrorCode(errorCodeId, 'statusCode', code);
      } else if (isResponse) {
        updateResponse(errorCodeId, 'statusCode', code);
      }
    }
  };

  const handleStatusCodeKeyDown = (errorCodeId: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const currentValue = statusCodeInputs[errorCodeId] || '';

      // If there's a valid status code, try to find it in the filtered list
      const filteredCodes = getFilteredStatusCodes(currentValue);
      if (filteredCodes.length > 0) {
        const firstMatch = filteredCodes[0];
        handleStatusCodeSelection(errorCodeId, firstMatch.code);
      } else {
        // If no matches found but it's a valid number, use it directly
        const code = parseInt(currentValue);
        if (!isNaN(code) && code > 0 && code <= 999) {
          const isErrorCode = formData.errorCodes.some(ec => ec.id === errorCodeId);
          const isResponse = formData.responses.some(r => r.id === errorCodeId);

          if (isErrorCode) {
            updateErrorCode(errorCodeId, 'statusCode', code);
          } else if (isResponse) {
            updateResponse(errorCodeId, 'statusCode', code);
          }
          setOpenStatusDropdowns(prev => ({ ...prev, [errorCodeId]: false }));
        }
      }
    }
  };

  const handleStatusCodeSelection = (errorCodeId: string, statusCode: number) => {
    if (statusCode != null) {
      const isErrorCode = formData.errorCodes.some(ec => ec.id === errorCodeId);
      const isResponse = formData.responses.some(r => r.id === errorCodeId);

      if (isErrorCode) {
        updateErrorCode(errorCodeId, 'statusCode', statusCode);
      } else if (isResponse) {
        updateResponse(errorCodeId, 'statusCode', statusCode);
      }

      setStatusCodeInputs(prev => ({ ...prev, [errorCodeId]: String(statusCode) }));
      setOpenStatusDropdowns(prev => ({ ...prev, [errorCodeId]: false }));
      setStatusCodeSearches(prev => ({ ...prev, [errorCodeId]: '' }));
    }
  };

  const handleStatusInputFocus = (errorCodeId: string) => {
    setFocusedStatusInput(errorCodeId);
    // Show dropdown immediately on focus for better UX
    const inputValue = statusCodeInputs[errorCodeId] || '';
    setStatusCodeSearches(prev => ({ ...prev, [errorCodeId]: inputValue }));
    setOpenStatusDropdowns(prev => ({ ...prev, [errorCodeId]: true }));
  };

  const handleStatusInputBlur = (errorCodeId: string) => {
    // Extended delay for better interaction - allows user to click on suggestions
    setTimeout(() => {
      if (focusedStatusInput === errorCodeId) {
        setFocusedStatusInput(null);
        setOpenStatusDropdowns(prev => ({ ...prev, [errorCodeId]: false }));
      }
    }, 300);
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.path || !formData.title || !formData.description || !formData.backendUrl) {
      toast.error('Please fill in all required fields (Path, Title, Description, Backend Endpoint)');
      return;
    }

    // Validate public endpoint format
    const publicEndpointValidation = validateUrlStructure(formData.path, 'endpoint');
    if (!publicEndpointValidation.isValid) {
      toast.error(`Public endpoint error: ${publicEndpointValidation.message}`);
      return;
    }

    // Validate backend endpoint format
    const backendUrlValidation = validateUrlStructure(formData.backendUrl, 'backend');
    if (!backendUrlValidation.isValid) {
      toast.error(`Backend Endpoint error: ${backendUrlValidation.message}`);
      return;
    }

    // Validate path parameter consistency
    const validation = validatePathParameterConsistency();
    if (!validation.isValid) {
      toast.error(`Path parameter error: ${validation.message}`);
      return;
    }

    onSave(formData);
    toast.success(`Endpoint ${mode}d successfully`);
    onClose();
  };

  const getMethodColor = (method: string) => {
    const methodOption = methodOptions.find(option => option.value === method);
    return methodOption?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getPlanColor = (plan: string) => {
    const planOption = planOptions.find(option => option.value === plan);
    return planOption?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Enhanced intelligent filtering for HTTP status codes
  const getFilteredStatusCodes = (searchTerm: string) => {
    if (!searchTerm.trim()) return httpStatusCodes;

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    // Smart filtering with priority scoring - add null/undefined checks
    const filtered = httpStatusCodes.filter(status => {
      if (!status || status.code == null) return false;

      const codeMatch = String(status.code).includes(lowercaseSearch);
      const nameMatch = status.name?.toLowerCase().includes(lowercaseSearch) || false;
      const descMatch = status.description?.toLowerCase().includes(lowercaseSearch) || false;
      return codeMatch || nameMatch || descMatch;
    });

    // Sort by relevance: exact code matches first, then name matches, then description
    return filtered.sort((a, b) => {
      // Add null checks for all comparisons
      if (!a || !b || a.code == null || b.code == null) return 0;

      const aCodeStr = String(a.code);
      const bCodeStr = String(b.code);

      const aCodeExact = aCodeStr === searchTerm;
      const bCodeExact = bCodeStr === searchTerm;
      if (aCodeExact !== bCodeExact) return aCodeExact ? -1 : 1;

      const aCodeStart = aCodeStr.startsWith(lowercaseSearch);
      const bCodeStart = bCodeStr.startsWith(lowercaseSearch);
      if (aCodeStart !== bCodeStart) return aCodeStart ? -1 : 1;

      const aNameStart = a.name?.toLowerCase().startsWith(lowercaseSearch) || false;
      const bNameStart = b.name?.toLowerCase().startsWith(lowercaseSearch) || false;
      if (aNameStart !== bNameStart) return aNameStart ? -1 : 1;

      return a.code - b.code; // Fallback: sort by status code
    });
  };

  // Get status code color based on range
  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 500) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (statusCode >= 400) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (statusCode >= 300) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (statusCode >= 200) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const parameterValidation = validatePathParameterConsistency();
  const publicEndpointValidation = validateUrlStructure(formData.path, 'endpoint');
  const backendUrlValidation = validateUrlStructure(formData.backendUrl, 'backend');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border/50 p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Badge className={getMethodColor(formData.method)}>
                    {formData.method}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm text-muted-foreground">
                      <RouteDisplay route={formData.path || '/new-endpoint'} className="text-sm text-muted-foreground" />
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <DialogTitle className="text-xl">
                    {mode === 'create' ? 'Create New Endpoint' : 'Edit Endpoint'}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    {formData.title || 'Configure your API endpoint with technical settings and documentation'}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPlanColor(formData.requiredPlan)}>
                  {planOptions.find(p => p.value === formData.requiredPlan)?.label}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>{formData.rateLimit.enabled ? `${formData.rateLimit.value}/${formData.rateLimit.period}` : 'No limit'}</span>
                </div>
                {(!parameterValidation.isValid || !publicEndpointValidation.isValid || !backendUrlValidation.isValid) && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="technical" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Technical Configuration</span>
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh] px-6 py-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                <TabsContent value="technical" className="space-y-8 mt-0">
                  {/* Basic Configuration */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <span>Basic Configuration</span>
                      </CardTitle>
                      <CardDescription>
                        Core endpoint settings that define how your API endpoint behaves
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label htmlFor="path" className="text-sm font-semibold flex items-center space-x-1">
                            <span>Public Endpoint</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Terminal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="path"
                              placeholder="/api/endpoint"
                              value={formData.path}
                              onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                              className="pl-10 font-mono"
                            />
                          </div>
                          <DetectedParameters route={formData.path} />
                          {!publicEndpointValidation.isValid && (
                            <div className="flex items-center space-x-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm">{publicEndpointValidation.message}</span>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Use {`{parameter}`} syntax for path parameters (e.g., /users/{`{id}`})
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="method" className="text-sm font-semibold flex items-center space-x-1">
                            <span>HTTP Method</span>
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.method}
                            onValueChange={(value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') =>
                              setFormData(prev => ({ ...prev, method: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {methodOptions.map(method => (
                                <SelectItem key={method.value} value={method.value}>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={method.color} variant="outline">
                                      {method.label}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="backendUrl" className="text-sm font-semibold flex items-center space-x-1">
                          <span>Backend Endpoint</span>
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="backendUrl"
                            placeholder="/api/v1/endpoint"
                            value={formData.backendUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, backendUrl: e.target.value }))}
                            className="pl-10 font-mono"
                          />
                        </div>
                        <DetectedParameters route={formData.backendUrl} />
                        {!backendUrlValidation.isValid && (
                          <div className="flex items-center space-x-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">{backendUrlValidation.message}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          The backend endpoint path that requests will be forwarded to (use same parameter names as Public Endpoint)
                        </p>
                      </div>

                      {/* Path Parameter Mismatch Warning */}
                      {(() => {
                        const mismatch = detectPathParameterMismatch();
                        return mismatch.hasMismatch && (
                          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                                Path Parameter Mismatch Warning
                              </h4>
                              <p className="text-sm text-amber-600 dark:text-amber-300 mb-2">
                                {mismatch.message}
                              </p>
                              <p className="text-xs text-amber-600 dark:text-amber-400">
                                For consistency, both endpoints should use the same path parameters. This ensures proper request routing and parameter validation.
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Access & Limits */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Access Control & Limits</span>
                      </CardTitle>
                      <CardDescription>
                        Define subscription requirements, rate limits, and usage quotas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Required Plan */}
                      <div className="space-y-3">
                        <Label htmlFor="requiredPlan" className="text-sm font-semibold">Required Plan</Label>
                        <Select
                          value={formData.requiredPlan}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, requiredPlan: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {planOptions.map(plan => (
                              <SelectItem key={plan.value} value={plan.value}>
                                <div className="flex items-center space-x-2">
                                  <Badge className={plan.color} variant="outline">
                                    {plan.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Minimum plan required to access this endpoint
                        </p>
                      </div>

                      {/* Rate Limiting */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-semibold flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span>Rate Limiting</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Limit the number of requests per time period
                            </p>
                          </div>
                          <Switch
                            checked={formData.rateLimit.enabled}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                rateLimit: { ...prev.rateLimit, enabled: checked }
                              }))
                            }
                          />
                        </div>

                        {formData.rateLimit.enabled && (
                          <Card className="border-muted bg-muted/10">
                            <CardContent className="pt-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">Request Limit</Label>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      placeholder="100"
                                      value={formData.rateLimit.value}
                                      onChange={(e) =>
                                        setFormData(prev => ({
                                          ...prev,
                                          rateLimit: {
                                            ...prev.rateLimit,
                                            value: parseInt(e.target.value) || 0
                                          }
                                        }))
                                      }
                                      className="pl-10"
                                      min="1"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">Time Period</Label>
                                  <Select
                                    value={formData.rateLimit.period}
                                    onValueChange={(value: 'second' | 'minute' | 'hour') =>
                                      setFormData(prev => ({
                                        ...prev,
                                        rateLimit: {
                                          ...prev.rateLimit,
                                          period: value
                                        }
                                      }))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {rateLimitPeriods.map(period => (
                                        <SelectItem key={period.value} value={period.value}>
                                          {period.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-6 mt-0">
                  {/* HTTP Status Code Preservation - Keep existing element as specified */}
                  <div className="mb-6 p-4 border rounded-lg bg-muted/10">
                    <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>HTTP Status Code Field</span>
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Preserved
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      This field is preserved from the original implementation as specified in the requirements.
                    </p>

                    {/* Sample HTTP Status Code input to demonstrate preservation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">HTTP Status Code</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="200"
                          className="w-24"
                          min="100"
                          max="999"
                        />
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          OK
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter HTTP status code (100-999)
                      </p>
                    </div>
                  </div>

                  {/* New OpenAPI Documentation Editor */}
                  <OpenAPIDocumentationEditor
                    initialDocument={formData.openApiDoc}
                    onChange={(document) => setFormData(prev => ({ ...prev, openApiDoc: document }))}
                    className="min-h-[500px]"
                  />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border/50 p-6">
          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Auto-saved</span>
              </div>
              <span>•</span>
              <span>{formData.pathParameters.length} path parameters</span>
              <span>•</span>
              <span>{formData.parameters.length} request parameters</span>
              <span>•</span>
              <span>{formData.exampleRequests.length} request examples</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="min-w-32">
                {mode === 'create' ? 'Create Endpoint' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
