// Backend API Types based on OpenAPI 3.0.1 Specification
// ============================================
// API Services Module
// ============================================

export interface CreateApiServiceRequest {
  name: string | null;
  description: string | null;
  category: string | null;
  serviceKey: string | null;
  targetBaseUrl: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  status: string | null;
}

export interface UpdateApiServiceRequest {
  name: string | null;
  description: string | null;
  category: string | null;
  serviceKey: string | null;
  targetBaseUrl: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  status: string | null;
  version: string | null;
}

export interface ApiServiceResponse {
  id: string;
  name: string | null;
  description: string | null;
  category: string | null;
  serviceKey: string | null;
  targetBaseUrl: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  status: string | null;
  apiDocId: string | null;
  version: string | null;
}

export interface PagedResponse<T> {
  items: T[] | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ListApiServicesParams {
  pageNumber?: number;
  pageSize?: number;
  category?: string;
  isPublic?: boolean;
  search?: string;
}

export interface ListCreatorApiServicesParams {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

// ============================================
// Endpoints Module
// ============================================

export enum RateLimitWindow {
  Second = 0,
  Minute = 1,
  Hour = 2,
}

export interface EndpointResponse {
  id: string;
  apiServiceId: string;
  planId: string;
  httpMethod: string | null;
  publicPath: string | null;
  targetPath: string | null;
  rateLimit: number | null;
  rateLimitWindow: RateLimitWindow;
  isActive: boolean;
}

export interface EndpointCreationRequest {
  planId: string;
  httpMethod: string | null;
  publicPath: string | null;
  targetPath: string | null;
  rateLimit: number | null;
  rateLimitWindow: string | null;
  isActive: boolean;
}

export interface CreateEndpointsRequest {
  endpoints: EndpointCreationRequest[] | null;
}

export interface UpdateEndpointRequest {
  planId: string;
  httpMethod: string | null;
  publicPath: string | null;
  targetPath: string | null;
  rateLimit: number | null;
  rateLimitWindow: string | null;
  isActive: boolean;
}

// ============================================
// Plans Module
// ============================================

export interface PlanResponse {
  id: string;
  apiServiceId: string;
  creatorId: string;
  name: string | null;
  type: string | null;
  priceInCents: number;
  billingPeriod: string | null;
  quotaLimit: number;
  quotaResetPeriod: string | null;
  rateLimit: number;
  rateLimitWindow: RateLimitWindow;
  features: string[] | null;
  overagePriceInCents: number | null;
  maxOverage: number | null;
  isActive: boolean;
  tierLevel: number;
}

export interface CreatePlanRequest {
  planType: string | null;
  name: string | null;
  price: number | null;
  billingPeriod: string | null;
  quotaLimit: number;
  quotaResetPeriod: string | null;
  rateLimit: number;
  rateLimitWindow: string | null;
  features: string[] | null;
  overagePrice: number | null;
  maxOverage: number | null;
  tierLevel: number;
}

export interface UpdatePlanRequest {
  planType: string | null;
  name: string | null;
  price: number | null;
  billingPeriod: string | null;
  quotaLimit: number;
  quotaResetPeriod: string | null;
  rateLimit: number;
  rateLimitWindow: string | null;
  features: string[] | null;
  overagePrice: number | null;
  maxOverage: number | null;
  tierLevel: number;
  isActive: boolean;
}

// ============================================
// Analytics Module
// ============================================

export interface SubscriptionStatResponse {
  id: string;
  subscriptionId: string;
  totalApiCalls: number;
  apiCallsUsedThisMonth: number;
}

export interface PlanStatResponse {
  id: string;
  planId: string;
  totalSubscribers: number;
  activeSubscribers: number;
  cancellationsThisMonth: number;
  cancellationPercentage: number;
}

export interface EndpointStatResponse {
  id: string;
  endpointId: string;
  totalApiCalls: number;
  successfulApiCalls: number;
  failedApiCalls: number;
  dailyCallCount: number;
  successRate: number;
  errorRate: number;
  averageResponseTimeMs: number;
}

export interface ApiServiceStatResponse {
  id: string;
  apiServiceId: string;
  totalApiCalls: number;
  successfulApiCalls: number;
  failedApiCalls: number;
  uptimePercentage: number;
  averageResponseTimeMs: number;
  activeSubscribers: number;
  totalSubscribers: number;
  averageRating: number;
  totalRatings: number;
}

export interface RateApiServiceRequest {
  rating: number | null;
}

// ============================================
// Subscriptions Module
// ============================================

export interface ApiUsageResponse {
  id: string;
  subscriptionId: string;
  quotasLeft: number;
  overageUsed: number;
  resetAt: string;
}

export interface SubscriptionResponse {
  id: string;
  consumerId: string;
  planId: string;
  apiServiceId: string;
  apiKey: string | null;
  subscribedAt: string;
  expiresAt: string | null;
  isCanceled: boolean;
  plan: PlanResponse;
  apiUsage: ApiUsageResponse;
}

export interface CreateSubscriptionRequest {
  planId: string;
  apiServiceId: string;
}

export interface ChangeSubscriptionPlanRequest {
  targetPlanId: string;
}

// ============================================
// Common Error Response
// ============================================

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================
// API Response Wrapper
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
  success: boolean;
}
