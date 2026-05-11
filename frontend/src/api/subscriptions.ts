/**
 * Subscriptions management contract
 */

export const subscriptionsEndpoints = {
  cancelSubscription: {
    path: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/cancel`,
    method: 'PATCH',
  },
  createSubscription: {
    path: '/api/subscriptions',
    method: 'POST',
  },
  listUserSubscriptions: {
    path: '/api/subscriptions',
    method: 'GET',
  },
  getSubscriptionById: {
    path: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}`,
    method: 'GET',
  },
  listServiceSubscribers: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/subscribers`,
    method: 'GET',
  },
  switchSubscriptionPlan: {
    path: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/switch-plan`,
    method: 'PATCH',
  },
} as const;
