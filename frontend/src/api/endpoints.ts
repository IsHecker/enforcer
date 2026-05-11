/**
 * API Endpoints management contract
 */

export const endpointsEndpoints = {
  createEndpoints: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/endpoints`,
    method: 'POST',
  },
  listEndpointsForService: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}/endpoints`,
    method: 'GET',
  },
  deleteEndpoint: {
    path: (endpointId: string) => `/api/endpoints/${endpointId}`,
    method: 'DELETE',
  },
  getEndpointById: {
    path: (endpointId: string) => `/api/endpoints/${endpointId}`,
    method: 'GET',
  },
  updateEndpoint: {
    path: (endpointId: string) => `/api/endpoints/${endpointId}`,
    method: 'PUT',
  },
  listEndpointsForPlan: {
    path: (planId: string) => `/api/plans/${planId}/endpoints`,
    method: 'GET',
  },
} as const;
