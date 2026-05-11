/**
 * API Service Layer
 * Handles all backend API requests with proper error handling and loading states
 */

import { API_CONFIG, buildUrl, getAuthHeaders } from '@/config/api-config';
import { apiServicesEndpoints } from '@/api/api-services';
import { endpointsEndpoints } from '@/api/endpoints';
import { plansEndpoints } from '@/api/plans';
import { subscriptionsEndpoints } from '@/api/subscriptions';
import { analyticsEndpoints } from '@/api/analytics';
import { apiUsagesEndpoints } from '@/api/api-usages';
import type {
  ApiServiceResponse,
  CreateApiServiceRequest,
  UpdateApiServiceRequest,
  ListApiServicesParams,
  ListCreatorApiServicesParams,
  PagedResponse,
  ApiResponse,
  ApiError,
  EndpointResponse,
  CreateEndpointsRequest,
  UpdateEndpointRequest,
  PlanResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
  SubscriptionResponse,
  CreateSubscriptionRequest,
  ChangeSubscriptionPlanRequest,
  SubscriptionStatResponse,
  PlanStatResponse,
  EndpointStatResponse,
  ApiServiceStatResponse,
  RateApiServiceRequest,
  ApiUsageResponse,
} from '@/types/backend-api';

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const status = response.status;
    const success = response.ok;

    // Handle no content responses
    if (status === 204 || response.headers.get('content-length') === '0') {
      return {
        data: undefined as T,
        status,
        success,
      };
    }

    // Try to parse response body
    let data: T | undefined;
    let error: ApiError | undefined;

    try {
      const json = await response.json();
      if (success) {
        data = json as T;
      } else {
        error = {
          message: json.message || json.error || 'An error occurred',
          code: json.code,
          details: json.details,
        };
      }
    } catch (parseError) {
      if (!success) {
        error = {
          message: `HTTP ${status}: ${response.statusText}`,
        };
      }
    }

    return {
      data,
      error,
      status,
      success,
    };
  } catch (error) {
    console.warn('API request failed:', error instanceof Error ? error.message : String(error));
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
      },
      status: 0,
      success: false,
    };
  }
}

/**
 * API Services Module
 */
export const apiServicesApi = {
  /**
   * Create a new API service
   */
  async create(data: CreateApiServiceRequest): Promise<ApiResponse<string>> {
    const url = buildUrl(apiServicesEndpoints.createApiService.path);
    return apiFetch<string>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all API services with optional filters
   */
  async list(params?: ListApiServicesParams): Promise<ApiResponse<ApiServiceResponse[]>> {
    const url = buildUrl(apiServicesEndpoints.listApiServices.path, {
      PageNumber: params?.pageNumber,
      PageSize: params?.pageSize,
      Category: params?.category,
      IsPublic: params?.isPublic,
      Search: params?.search,
    });
    return apiFetch<ApiServiceResponse[]>(url, {
      method: 'GET',
    });
  },

  /**
   * Get a specific API service by ID
   */
  async getById(apiServiceId: string): Promise<ApiResponse<ApiServiceResponse>> {
    const url = buildUrl(apiServicesEndpoints.getApiServiceById.path(apiServiceId));
    return apiFetch<ApiServiceResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Update an API service
   */
  async update(
    apiServiceId: string,
    data: UpdateApiServiceRequest
  ): Promise<ApiResponse<void>> {
    const url = buildUrl(apiServicesEndpoints.updateApiService.path(apiServiceId));
    return apiFetch<void>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an API service
   */
  async delete(apiServiceId: string): Promise<ApiResponse<void>> {
    const url = buildUrl(apiServicesEndpoints.deleteApiService.path(apiServiceId));
    return apiFetch<void>(url, {
      method: 'DELETE',
    });
  },

  /**
   * List API services created by a specific user
   */
  async listByCreator(
    params: ListCreatorApiServicesParams
  ): Promise<ApiResponse<PagedResponse<ApiServiceResponse>>> {
    const url = buildUrl(apiServicesEndpoints.listCreatorApiServices.path(params.userId), {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    });
    return apiFetch<PagedResponse<ApiServiceResponse>>(url, {
      method: 'GET',
    });
  },
};

/**
 * Endpoints Module
 */
export const endpointsApi = {
  /**
   * Create endpoints for an API service
   */
  async create(apiServiceId: string, data: CreateEndpointsRequest): Promise<ApiResponse<string[]>> {
    const url = buildUrl(endpointsEndpoints.createEndpoints.path(apiServiceId));
    return apiFetch<string[]>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all endpoints for an API service
   */
  async listForService(apiServiceId: string): Promise<ApiResponse<EndpointResponse[]>> {
    const url = buildUrl(endpointsEndpoints.listEndpointsForService.path(apiServiceId));
    return apiFetch<EndpointResponse[]>(url, {
      method: 'GET',
    });
  },

  /**
   * Get a specific endpoint by ID
   */
  async getById(endpointId: string): Promise<ApiResponse<EndpointResponse>> {
    const url = buildUrl(endpointsEndpoints.getEndpointById.path(endpointId));
    return apiFetch<EndpointResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Update an endpoint
   */
  async update(endpointId: string, data: UpdateEndpointRequest): Promise<ApiResponse<void>> {
    const url = buildUrl(endpointsEndpoints.updateEndpoint.path(endpointId));
    return apiFetch<void>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an endpoint
   */
  async delete(endpointId: string): Promise<ApiResponse<void>> {
    const url = buildUrl(endpointsEndpoints.deleteEndpoint.path(endpointId));
    return apiFetch<void>(url, {
      method: 'DELETE',
    });
  },

  /**
   * List endpoints for a specific plan
   */
  async listForPlan(planId: string): Promise<ApiResponse<EndpointResponse[]>> {
    const url = buildUrl(endpointsEndpoints.listEndpointsForPlan.path(planId));
    return apiFetch<EndpointResponse[]>(url, {
      method: 'GET',
    });
  },
};

/**
 * Plans Module
 */
export const plansApi = {
  /**
   * Create a plan for an API service
   */
  async create(apiServiceId: string, data: CreatePlanRequest): Promise<ApiResponse<string>> {
    const url = buildUrl(plansEndpoints.createPlan.path(apiServiceId));
    return apiFetch<string>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all plans for an API service
   */
  async listForService(apiServiceId: string): Promise<ApiResponse<PlanResponse[]>> {
    const url = buildUrl(plansEndpoints.listPlansForService.path(apiServiceId));
    return apiFetch<PlanResponse[]>(url, {
      method: 'GET',
    });
  },

  /**
   * Get a specific plan by ID
   */
  async getById(planId: string): Promise<ApiResponse<PlanResponse>> {
    const url = buildUrl(plansEndpoints.getPlanById.path(planId));
    return apiFetch<PlanResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Update a plan
   */
  async update(planId: string, data: UpdatePlanRequest): Promise<ApiResponse<void>> {
    const url = buildUrl(plansEndpoints.updatePlan.path(planId));
    return apiFetch<void>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a plan
   */
  async delete(planId: string): Promise<ApiResponse<void>> {
    const url = buildUrl(plansEndpoints.deletePlan.path(planId));
    return apiFetch<void>(url, {
      method: 'DELETE',
    });
  },
};

/**
 * Subscriptions Module
 */
export const subscriptionsApi = {
  /**
   * Create a new subscription
   */
  async create(data: CreateSubscriptionRequest): Promise<ApiResponse<string>> {
    const url = buildUrl(subscriptionsEndpoints.createSubscription.path);
    return apiFetch<string>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List user subscriptions
   */
  async list(): Promise<ApiResponse<SubscriptionResponse[]>> {
    const url = buildUrl(subscriptionsEndpoints.listUserSubscriptions.path);
    return apiFetch<SubscriptionResponse[]>(url, {
      method: 'GET',
    });
  },

  /**
   * Get a specific subscription by ID
   */
  async getById(subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> {
    const url = buildUrl(subscriptionsEndpoints.getSubscriptionById.path(subscriptionId));
    return apiFetch<SubscriptionResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Cancel a subscription
   */
  async cancel(subscriptionId: string): Promise<ApiResponse<void>> {
    const url = buildUrl(subscriptionsEndpoints.cancelSubscription.path(subscriptionId));
    return apiFetch<void>(url, {
      method: 'PATCH',
    });
  },

  /**
   * Change subscription plan
   */
  async changePlan(
    subscriptionId: string,
    data: ChangeSubscriptionPlanRequest
  ): Promise<ApiResponse<void>> {
    const url = buildUrl(subscriptionsEndpoints.switchSubscriptionPlan.path(subscriptionId));
    return apiFetch<void>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * List subscribers for an API service
   */
  async listServiceSubscribers(apiServiceId: string): Promise<ApiResponse<SubscriptionResponse[]>> {
    const url = buildUrl(subscriptionsEndpoints.listServiceSubscribers.path(apiServiceId));
    return apiFetch<SubscriptionResponse[]>(url, {
      method: 'GET',
    });
  },
};

/**
 * Analytics Module
 */
export const analyticsApi = {
  /**
   * Get specific subscription stats
   */
  async getSubscriptionStat(subscriptionId: string): Promise<ApiResponse<SubscriptionStatResponse>> {
    const url = buildUrl(analyticsEndpoints.getSubscriptionStat.path(subscriptionId));
    return apiFetch<SubscriptionStatResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Get plan stats
   */
  async getPlanStat(planId: string): Promise<ApiResponse<PlanStatResponse>> {
    const url = buildUrl(analyticsEndpoints.getPlanStat.path(planId));
    return apiFetch<PlanStatResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * List stats for multiple endpoints
   */
  async listEndpointStats(endpointIds: string[]): Promise<ApiResponse<EndpointStatResponse[]>> {
    const url = new URL(analyticsEndpoints.listEndpointStats.path, API_CONFIG.BASE_URL);
    endpointIds.forEach(id => url.searchParams.append('EndpointIds', id));
    
    return apiFetch<EndpointStatResponse[]>(url.toString(), {
      method: 'GET',
    });
  },

  /**
   * Get aggregate stats for an API service
   */
  async getApiServiceStat(apiServiceId: string): Promise<ApiResponse<ApiServiceStatResponse>> {
    const url = buildUrl(analyticsEndpoints.getApiServiceStat.path(apiServiceId));
    return apiFetch<ApiServiceStatResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * Submit a rating for an API service
   */
  async rateApiService(apiServiceId: string, data: RateApiServiceRequest): Promise<ApiResponse<void>> {
    const url = buildUrl(analyticsEndpoints.rateApiService.path(apiServiceId));
    return apiFetch<void>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Api Usages Module
 */
export const apiUsagesApi = {
  /**
   * Get API usage details for a subscription
   */
  async getSubscriptionApiUsage(subscriptionId: string): Promise<ApiResponse<ApiUsageResponse>> {
    const url = buildUrl(apiUsagesEndpoints.getSubscriptionApiUsage.path(subscriptionId));
    return apiFetch<ApiUsageResponse>(url, {
      method: 'GET',
    });
  },
};

/**
 * Export all API modules
 */
export const api = {
  apiServices: apiServicesApi,
  endpoints: endpointsApi,
  plans: plansApi,
  subscriptions: subscriptionsApi,
  analytics: analyticsApi,
  apiUsages: apiUsagesApi,
};
