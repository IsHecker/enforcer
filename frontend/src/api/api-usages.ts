/**
 * Api Usage tracking contracts
 */

export const apiUsagesEndpoints = {
  getSubscriptionApiUsage: {
    path: (subscriptionId: string) => `/api/subscriptions/${subscriptionId}/api-usage`,
    method: 'GET',
  },
} as const;
