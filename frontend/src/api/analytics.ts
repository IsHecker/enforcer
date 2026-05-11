/**
 * Analytics endpoints contracts
 */

export const analyticsEndpoints = {
  getSubscriptionStat: {
    path: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/stats`,
    method: 'GET',
  },
  getPlanStat: {
    path: (planId: string) => `/api/plans/${planId}/stats`,
    method: 'GET',
  },
  listEndpointStats: {
    path: '/api/analytics/endpoint-stats',
    method: 'GET',
  },
  getApiServiceStat: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/stats`,
    method: 'GET',
  },
  rateApiService: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/rate`,
    method: 'POST',
  },
} as const;
