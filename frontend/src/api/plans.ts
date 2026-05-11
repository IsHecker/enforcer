/**
 * Plans management contract
 */

export const plansEndpoints = {
  createPlan: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/plans`,
    method: 'POST',
  },
  listPlansForService: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/plans`,
    method: 'GET',
  },
  deletePlan: {
    path: (planId: string) => `/api/plans/${planId}`,
    method: 'DELETE',
  },
  getPlanById: {
    path: (planId: string) => `/api/plans/${planId}`,
    method: 'GET',
  },
  updatePlan: {
    path: (planId: string) => `/api/plans/${planId}`,
    method: 'PUT',
  },
} as const;
