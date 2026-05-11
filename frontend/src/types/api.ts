export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  basePath: string;
  backendUrl: string;
  logo?: string;
  documentation?: string;
  isPublic: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  createdBy: string;
  endpoints: ApiEndpoint[];
  plans: string[];
  createdAt: string;
  updatedAt: string;
  version?: string;
  category?: string;
  totalSubscribers?: number;
  totalRevenue?: number;
  totalCalls?: number;
  successRate?: number;
  rating?: number;
}

export interface PathParameter {
  id: string;
  name: string;
  type: 'string' | 'integer' | 'UUID' | 'boolean';
  description: string;
}

// OpenAPI-compliant response structure
export interface ApiResponse {
  id: string;
  statusCode: number;
  statusDescription?: string;
  description: string;
  contentType: string;
  schema: string;
  example: string;
}

export interface ApiEndpoint {
  id: string;
  productId?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  title?: string;
  rateLimit?: {
    enabled: boolean;
    value: number;
    period: 'second' | 'minute' | 'hour';
  };
  quota?: {
    enabled: boolean;
    value: number;
    period: 'day' | 'week' | 'month';
  };
  isActive: boolean;
  planRestrictions: string[];
  parameters?: EndpointParameter[];
  pathParameters?: PathParameter[];
  examples?: EndpointExample[];
  exampleRequests?: EndpointExample[];
  exampleResponses?: EndpointExample[];
  // New unified responses structure following OpenAPI specification
  responses?: ApiResponse[];
  // Legacy fields for backward compatibility
  responseSchema?: string;
  requestSchema?: string;
  errorCodes?: Array<{
    id: string;
    code: string;
    statusCode: number;
    statusDescription?: string;
    description: string;
    example: string;
  }>;
  requiredPlan?: string;
  backendUrl?: string;
  responseTime?: number;
  errorRate?: number;
  callsToday?: number;
}

export interface EndpointParameter {
  id?: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: string;
}

export interface EndpointExample {
  id?: string;
  language: string;
  code: string;
}

export interface Plan {
  id: string;
  name: string;
  type: 'free' | 'pro' | 'enterprise';
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'usage';
  quotaLimit: number;
  quotaPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  rateLimit: number;
  rateLimitPeriod: 'second' | 'minute' | 'hour';
  features: string[];
  isActive: boolean;
  overage?: {
    enabled: boolean;
    pricePerRequest: number;
    maxOverage?: number;
  };
  createdAt: string;
}

export interface Usage {
  productId: string;
  endpointId?: string;
  requests: number;
  date: string;
  userId: string;
  planId: string;
}

export interface Analytics {
  totalRequests: number;
  activeUsers: number;
  revenue: number;
  topProducts: Array<{
    id: string;
    name: string;
    requests: number;
    revenue: number;
  }>;
  usageData: Array<{
    date: string;
    requests: number;
    revenue: number;
  }>;
}