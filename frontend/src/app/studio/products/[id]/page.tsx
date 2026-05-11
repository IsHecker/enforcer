'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/auth-context';
import type { ApiProduct, ApiEndpoint } from '@/types/api';
import { api } from '@/services/api-service';
import { ApiServiceResponse } from '@/types/backend-api';

// Extracted Components
import { OverviewAnalytics } from '@/components/products/overview-analytics';
import { EndpointList } from '@/components/products/endpoint-list';
import { ProductSettingsForm } from '@/components/products/product-settings-form';
import { SecurityTab } from '@/components/products/security-tab';
import { MonetizationDashboard } from '@/components/products/monetization-dashboard';

import { EndpointManagementModal } from '@/components/creator/EndpointManagementModal';
import { OpenAPIImportModal } from '@/components/creator/openapi-import-modal';
import { ImportConfirmationModal } from '@/components/creator/import-confirmation-modal';

// Default empty data for newly created products
const defaultEmptyUsageData = [
  { name: 'Mon', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Tue', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Wed', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Thu', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Fri', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Sat', calls: 0, errors: 0, responseTime: 0 },
  { name: 'Sun', calls: 0, errors: 0, responseTime: 0 },
];

const mockUsageData = [
  { name: 'Mon', calls: 2400, errors: 12, responseTime: 120 },
  { name: 'Tue', calls: 1398, errors: 8, responseTime: 115 },
  { name: 'Wed', calls: 9800, errors: 45, responseTime: 135 },
  { name: 'Thu', calls: 3908, errors: 21, responseTime: 125 },
  { name: 'Fri', calls: 4800, errors: 18, responseTime: 110 },
  { name: 'Sat', calls: 3800, errors: 15, responseTime: 108 },
  { name: 'Sun', calls: 4300, errors: 22, responseTime: 118 },
];

const mapBackendServiceToApiProduct = (service: ApiServiceResponse): ApiProduct => {
  return {
    id: service.id,
    name: service.name || 'Unnamed API',
    description: service.description || 'No description available',
    basePath: service.serviceKey || '/api',
    backendUrl: service.targetBaseUrl || '',
    logo: service.logoUrl || undefined,
    isPublic: service.isPublic,
    status: (service.status?.toLowerCase() as any) || 'active',
    version: service.version || '1.0.0',
    category: service.category || 'Other',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubscribers: 0,
    totalRevenue: 0,
    totalCalls: 0,
    successRate: 100,
    createdBy: '',
    endpoints: [],
    plans: [],
  };
};

export default function StudioApiProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);

  // Modal States
  const [isEndpointModalOpen, setIsEndpointModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | undefined>(undefined);
  const [endpointModalMode, setEndpointModalMode] = useState<'create' | 'edit'>('create');
  const [isOpenAPIModalOpen, setIsOpenAPIModalOpen] = useState(false);
  const [isImportConfirmationOpen, setIsImportConfirmationOpen] = useState(false);
  const [pendingImportEndpoints, setPendingImportEndpoints] = useState<ApiEndpoint[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRealProduct = async () => {
      const productId = params.id as string;
      if (!productId) return;

      setIsLoading(true);
      try {
        // 1. Fetch Basic Service Info
        const serviceResponse = await api.apiServices.getById(productId);
        if (serviceResponse.success && serviceResponse.data) {
          const product = mapBackendServiceToApiProduct(serviceResponse.data);

          // 2. Fetch Endpoints
          const endpointResponse = await api.endpoints.listForService(productId);
          const endpoints: ApiEndpoint[] = endpointResponse.success && endpointResponse.data
            ? endpointResponse.data.map(ep => ({
              id: ep.id,
              path: ep.publicPath || '',
              method: (ep.httpMethod?.toUpperCase() as any) || 'GET',
              title: ep.publicPath?.split('/').pop() || 'Endpoint',
              description: `API endpoint for ${ep.publicPath}`,
              isActive: ep.isActive,
              parameters: [],
              pathParameters: [],
              responseSchema: '{}',
              requiredPlan: 'free',
              exampleRequests: [],
              exampleResponses: [],
              planRestrictions: [],
            }))
            : [];

          setApiProduct({
            ...product,
            endpoints
          });
          setIsNewProduct(false);
          toast.success(`Successfully loaded ${product.name}`);
        } else {
          toast.error(serviceResponse.error?.message || 'Failed to load product from backend');
          // Handle error - maybe redirect or show error state
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        toast.error('An unexpected error occurred while fetching API details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealProduct();
  }, [params.id]);

  if (!user || !apiProduct) return null;

  const handleSaveProduct = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setApiProduct(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
      toast.success('API product updated successfully!');
    } catch {
      toast.error('Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`API product deleted.`);
      router.push('/studio/products');
    } catch {
      toast.error('Failed to delete product.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Endpoint Actions */
  const handleToggleEndpoint = (endpointId: string) => {
    setApiProduct(prev => prev ? {
      ...prev,
      endpoints: prev.endpoints.map(e => e.id === endpointId ? { ...e, isActive: !e.isActive } : e),
    } : null);
    toast.success('Endpoint status updated');
  };

  const openCreateEndpointModal = () => {
    setSelectedEndpoint(undefined);
    setEndpointModalMode('create');
    setIsEndpointModalOpen(true);
  };

  const openEditEndpointModal = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setEndpointModalMode('edit');
    setIsEndpointModalOpen(true);
  };

  const handleSaveEndpoint = (endpointData: ApiEndpoint) => {
    setApiProduct(prev => {
      if (!prev) return prev;
      return endpointModalMode === 'create'
        ? { ...prev, endpoints: [...prev.endpoints, endpointData] }
        : { ...prev, endpoints: prev.endpoints.map(e => e.id === endpointData.id ? endpointData : e) };
    });
    setIsEndpointModalOpen(false);
  };

  const handleDeleteEndpoint = (endpointId: string) => {
    setApiProduct(prev => prev ? { ...prev, endpoints: prev.endpoints.filter(e => e.id !== endpointId) } : null);
    toast.success('Endpoint deleted successfully');
  };

  const copyEndpointUrl = (endpoint: ApiEndpoint) => {
    const url = `https://api.proxyapi.dev${apiProduct.basePath}${endpoint.path}`;
    navigator.clipboard.writeText(url);
    toast.success('Endpoint URL copied to clipboard');
  };

  /* OpenAPI Import Handlers */
  const handleOpenAPIImport = (endpoints: ApiEndpoint[]) => {
    if (apiProduct.endpoints.length === 0) {
      setApiProduct(prev => prev ? { ...prev, endpoints } : null);
      toast.success(`Successfully imported ${endpoints.length} endpoint${endpoints.length !== 1 ? 's' : ''}`);
    } else {
      setPendingImportEndpoints(endpoints);
      setIsImportConfirmationOpen(true);
    }
    setIsOpenAPIModalOpen(false);
  };

  const handleReplaceAllEndpoints = () => {
    setApiProduct(prev => prev ? { ...prev, endpoints: pendingImportEndpoints } : null);
    toast.success(`Replaced with ${pendingImportEndpoints.length} new endpoints`);
    setIsImportConfirmationOpen(false);
    setPendingImportEndpoints([]);
  };

  const handleAddNewEndpointsOnly = () => {
    const existing = apiProduct.endpoints;
    const newEps = pendingImportEndpoints.filter(ne => !existing.some(e => e.path === ne.path && e.method === ne.method));
    setApiProduct(prev => prev ? { ...prev, endpoints: [...prev.endpoints, ...newEps] } : null);
    toast.success(`Added ${newEps.length} endpoints`);
    setIsImportConfirmationOpen(false);
    setPendingImportEndpoints([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!user || !apiProduct) {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 h-[600px]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Synchronizing studio data...</p>
        </div>
      );
    }
    return null;
  }

  const usageData = defaultEmptyUsageData;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-foreground">{apiProduct.name}</h1>
              <Badge className={getStatusColor(apiProduct.status)}>{apiProduct.status}</Badge>
              <Badge variant="outline" className="text-muted-foreground">{apiProduct.version}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{apiProduct.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>Category: {apiProduct.category}</span>
              <span>•</span>
              <span>Base Path: {apiProduct.basePath}</span>
              <span>•</span>
              <span>Subscribers: {apiProduct.totalSubscribers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Architecture */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewAnalytics apiProduct={apiProduct} usageData={usageData} isNewProduct={isNewProduct} />
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <EndpointList
            apiProduct={apiProduct}
            onImportOpenAPI={() => setIsOpenAPIModalOpen(true)}
            onCreateNew={openCreateEndpointModal}
            onEdit={openEditEndpointModal}
            onDelete={handleDeleteEndpoint}
            onToggleStatus={handleToggleEndpoint}
            onCopyUrl={copyEndpointUrl}
          />
        </TabsContent>

        <TabsContent value="monetization">
          <MonetizationDashboard apiProduct={apiProduct} isNewProduct={isNewProduct} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            apiProduct={apiProduct}
            isNewProduct={isNewProduct}
          />
        </TabsContent>

        <TabsContent value="settings">
          <ProductSettingsForm
            apiProduct={apiProduct}
            isNewProduct={isNewProduct}
            isLoading={isLoading}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EndpointManagementModal
        isOpen={isEndpointModalOpen}
        onClose={() => setIsEndpointModalOpen(false)}
        endpoint={selectedEndpoint}
        mode={endpointModalMode}
        onSave={handleSaveEndpoint}
      />

      <OpenAPIImportModal
        isOpen={isOpenAPIModalOpen}
        onClose={() => setIsOpenAPIModalOpen(false)}
        onImport={handleOpenAPIImport}
      />

      <ImportConfirmationModal
        isOpen={isImportConfirmationOpen}
        onClose={() => setIsImportConfirmationOpen(false)}
        onReplaceAll={handleReplaceAllEndpoints}
        onAddNewOnly={handleAddNewEndpointsOnly}
        existingEndpoints={apiProduct.endpoints}
        newEndpoints={pendingImportEndpoints}
      />
    </div>
  );
}