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
  endpoints: ApiEndpoint[];
  createdBy: string;
  plans: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiEndpoint {
  id: string;
  productId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  rateLimit?: number;
  isActive: boolean;
  planRestrictions: string[];
  parameters?: EndpointParameter[];
  examples?: EndpointExample[];
}

export interface EndpointParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: string;
}

export interface EndpointExample {
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
  rateLimit: number;
  features: string[];
  isActive: boolean;
  overage?: {
    enabled: boolean;
    pricePerRequest: number;
    maxOverage: number;
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
  }>;
}