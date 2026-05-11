/**
 * Common data schemas for Enforcer API
 */

export interface PagedResponse<T> {
  items: T[] | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum RateLimitWindow {
  Second = 0,
  Minute = 1,
  Hour = 2,
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

export interface PlanStatResponse {
  id: string;
  planId: string;
  totalSubscribers: number;
  activeSubscribers: number;
  cancellationsThisMonth: number;
  cancellationPercentage: number;
}

export interface SubscriptionStatResponse {
  id: string;
  subscriptionId: string;
  totalApiCalls: number;
  apiCallsUsedThisMonth: number;
}

export interface RateApiServiceRequest {
  rating?: number;
}

export interface ApiKeyBanResponse {
  apiKey?: string;
  reason?: string;
  duration?: string;
  bannedAt: string;
  bannedBy: string;
}

export interface ApiServiceResponse {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  serviceKey?: string;
  targetBaseUrl?: string;
  logoUrl?: string;
  isPublic: boolean;
  status?: string;
  apiDocId?: string;
  version?: string;
}

export interface ApiUsageResponse {
  id: string;
  subscriptionId: string;
  quotasLeft: number;
  overageUsed: number;
  resetAt: string;
}

export interface EndpointResponse {
  id: string;
  apiServiceId: string;
  planId: string;
  httpMethod?: string;
  publicPath?: string;
  targetPath?: string;
  rateLimit?: number;
  rateLimitWindow: RateLimitWindow;
  isActive: boolean;
}

export interface PlanResponse {
  id: string;
  apiServiceId: string;
  creatorId: string;
  name?: string;
  type?: string;
  priceInCents: number;
  billingPeriod?: string;
  quotaLimit: number;
  quotaResetPeriod?: string;
  rateLimit: number;
  rateLimitWindow: RateLimitWindow;
  features?: string[];
  overagePriceInCents?: number;
  maxOverage?: number;
  isActive: boolean;
  tierLevel: number;
}

export interface SubscriptionResponse {
  id: string;
  consumerId: string;
  planId: string;
  apiServiceId: string;
  apiKey?: string;
  subscribedAt: string;
  expiresAt?: string;
  isCanceled: boolean;
  plan: PlanResponse;
  apiUsage: ApiUsageResponse;
}

export interface BanApiKeyRequest {
  reason?: string;
  expiresAt?: string;
}

export interface CreateApiServiceRequest {
  name?: string;
  description?: string;
  category?: string;
  serviceKey?: string;
  targetBaseUrl?: string;
  logoUrl?: string;
  isPublic: boolean;
  status?: string;
}

export interface UpdateApiServiceRequest {
  name?: string;
  description?: string;
  category?: string;
  serviceKey?: string;
  targetBaseUrl?: string;
  logoUrl?: string;
  isPublic: boolean;
  status?: string;
  version?: string;
}

export interface EndpointCreationRequest {
  planId: string;
  httpMethod?: string;
  publicPath?: string;
  targetPath?: string;
  rateLimit?: number;
  rateLimitWindow?: string;
  isActive: boolean;
}

export interface CreateEndpointsRequest {
  endpoints?: EndpointCreationRequest[];
}

export interface UpdateEndpointRequest {
  planId: string;
  httpMethod?: string;
  publicPath?: string;
  targetPath?: string;
  rateLimit?: number;
  rateLimitWindow?: string;
  isActive: boolean;
}

export interface CreatePlanRequest {
  planType?: string;
  name?: string;
  priceInCents: number;
  billingPeriod?: string;
  quotaLimit: number;
  quotaResetPeriod?: string;
  rateLimit: number;
  rateLimitWindow?: string;
  features?: string[];
  overagePriceInCents?: number;
  maxOverage?: number;
  tierLevel: number;
}

export interface UpdatePlanRequest {
  planType?: string;
  name?: string;
  priceInCents: number;
  billingPeriod?: string;
  quotaLimit: number;
  quotaResetPeriod?: string;
  rateLimit: number;
  rateLimitWindow?: string;
  features?: string[];
  overagePriceInCents?: number;
  maxOverage?: number;
  tierLevel: number;
  isActive: boolean;
}

export interface CancelSubscriptionRequest {
  cancelImmediately: boolean;
}

export interface CreateSubscriptionRequest {
  apiServiceId: string;
  planId: string;
  promoCode?: string;
  returnUrl?: string;
}

export interface SwitchSubscriptionPlanRequest {
  targetPlanId: string;
}

export interface PaymentMethodResponse {
  id: string;
  type?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  isDefault: boolean;
  isActive: boolean;
  isVerified: boolean;
  billingAddress?: string;
  verifiedAt?: string;
  lastFailedAt?: string;
  lastFailureReason?: string;
  lastUsedAt?: string;
}

export interface PayoutResponse {
  payoutNumber?: string;
  creatorId: string;
  totalAmount: number;
  currency?: string;
  description?: string;
  status?: string;
  periodStart: string;
  periodEnd: string;
  scheduledDate: string;
  sentAt?: string;
  failureReason?: string;
}

export interface PromotionalCodeResponse {
  id: string;
  code?: string;
  type?: string;
  value: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
}

export interface SessionResponse {
  url?: string;
}

export interface WalletEntryResponse {
  id: string;
  walletId: string;
  type?: string;
  amount: number;
  currency?: string;
  referenceId?: string;
  description?: string;
  createdAt: string;
}

export interface WalletResponse {
  userId: string;
  balance: number;
  credits: number;
  lifetimeEarnings: number;
  currency?: string;
  lastPayoutAt?: string;
  isOnboardingComplete: boolean;
  isPayoutMethodConfigured: boolean;
}

export interface AddPaymentMethodRequest {
  returnUrl?: string;
}

export interface CreatePromotionalCodeRequest {
  apiServiceId: string;
  planId: string;
  code?: string;
  type?: string;
  value: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom: string;
  validUntil?: string;
}

export interface GetPromotionalCodeRequest {
  planId: string;
}

export interface CreateOnboardingSessionRequest {
  returnUrl?: string;
}

export interface WithdrawFromWalletRequest {
  amount: number;
}
