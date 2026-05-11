/**
 * API Services endpoints contract
 */

export const apiServicesEndpoints = {
  createApiService: {
    path: '/api/api-services',
    method: 'POST',
  },
  listApiServices: {
    path: '/api/api-services',
    method: 'GET',
  },
  deleteApiService: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}`,
    method: 'DELETE',
  },
  getApiServiceById: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}`,
    method: 'GET',
  },
  updateApiService: {
    path: (apiServiceId: string) => `/api/api-services/${apiServiceId}`,
    method: 'PUT',
  },
  listCreatorApiServices: {
    path: (userId: string) => `/api/users/${userId}/api-services`,
    method: 'GET',
  },
} as const;
