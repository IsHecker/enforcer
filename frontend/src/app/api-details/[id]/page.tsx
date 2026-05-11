'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api-service';
import { USER_CONFIG } from '@/config/user-config';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { ApiPlayground } from '@/components/api/api-playground';
import { PlanCard } from '@/components/plans/plan-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { RouteDisplay } from '@/components/ui/route-display';
import { StarRating } from '@/components/ui/star-rating';
import { toast } from 'sonner';
import {
  ApiServiceStatResponse,
  ApiUsageResponse,
  SubscriptionResponse,
} from '@/types/backend-api';
import {
  Package,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Code,
  BookOpen,
  Play,
  Globe,
  Shield,
  Users,
  Star,
  ExternalLink,
  Copy,
  Building,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  HelpCircle,
  Bug,
  History,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  X,
  Send,
} from 'lucide-react';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  name?: string;
  description?: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: {
    required: boolean;
    contentType: string;
    schema: object;
    example: object;
  };
  response?: {
    example: object;
    schema: string;
  };
  statusCodes?: {
    code: number;
    description: string;
    example?: object;
  }[];
  planRestrictions: string[];
  rateLimit?: string; // Override plan's rate limit if specified
}

interface ApiPlan {
  id: string;
  name: string;
  type: 'free' | 'pro' | 'enterprise';
  price: number;
  billingPeriod?: string;
  quota: number;
  quotaPeriod?: string;
  rateLimit: number;
  rateLimitPeriod?: string;
  features: string[];
  isCurrentPlan: boolean;
  badgeColor?: string; // Change to optional
  subscriptionsCount?: number;
  tierLevel?: number;
}

interface CreatorInfo {
  id: string;
  name: string;
  company: string;
  logo: string;
  description: string;
  website: string;
  email: string;
  verified: boolean;
  totalProducts: number;
  averageRating: number;
  joinedDate: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security' | 'improved';
    description: string;
  }[];
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ApiDetails {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'maintenance' | 'deprecated';
  category: string;
  rating: number;
  totalUsers: number;
  basePath: string;
  supportEmail: string;
  documentation: string;
  logo: string;
  creator: CreatorInfo;
  currentSubscription?: {
    planId: string;
    planName: string;
    usage: {
      current: number;
      quota: number;
      resetDate: string;
    };
    nextBilling: string;
    status: 'active' | 'cancelled';
  };
  apiKey?: string;
  endpoints: ApiEndpoint[];
  plans: ApiPlan[];
  changelog: ChangelogEntry[];
  faq: FaqItem[];
  errorCodes: {
    code: number;
    name: string;
    description: string;
    solution: string;
  }[];
}

// Enhanced mock data with complete consumer-focused information

export default function ApiDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('endpoints');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // New states for endpoints tab functionality  
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [testParameters, setTestParameters] = useState<Record<string, string>>({});
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);

  // Backend API integration states
  const [apiDetails, setApiDetails] = useState<ApiDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for backend endpoints
  const [backendEndpoints, setBackendEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState(false);
  const [backendPlans, setBackendPlans] = useState<ApiPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userSubscription, setUserSubscription] = useState<SubscriptionResponse | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [planStats, setPlanStats] = useState<Record<string, any>>({});

  // Stats Integration States
  const [stats, setStats] = useState<ApiServiceStatResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [realUsage, setRealUsage] = useState<ApiUsageResponse | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [isRating, setIsRating] = useState(false);

  const apiId = params.id as string;
  const source = searchParams?.get('source') || null; // 'marketplace' or 'subscriptions'

  // Function to refresh subscription data
  const refreshSubscriptionData = useCallback(async () => {
    if (!user) {
      setIsCheckingSubscription(false);
      return;
    }
    setIsCheckingSubscription(true);

    try {
      const response = await api.subscriptions.list();

      if (response.success && response.data) {
        // Find subscription for this API
        const subscription = response.data.find(sub => sub.apiServiceId === apiId && !sub.isCanceled && (!sub.expiresAt || new Date(sub.expiresAt) > new Date()));
        setUserSubscription(subscription || null);
        setIsSubscribed(!!subscription);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setIsCheckingSubscription(false);
    }
  }, [apiId, user]);

  // NEW: Fetch usage data if subscribed
  const refreshUsage = useCallback(async () => {
    if (!userSubscription?.id) return;

    setIsLoadingUsage(true);
    try {
      const response = await api.apiUsages.getSubscriptionApiUsage(userSubscription.id);
      if (response.success && response.data) {
        setRealUsage(response.data);
      }
    } catch (err) {
      console.error('Error fetching usage:', err);
    } finally {
      setIsLoadingUsage(false);
    }
  }, [userSubscription?.id]);

  useEffect(() => {
    if (isSubscribed) {
      refreshUsage();
    }
  }, [isSubscribed, refreshUsage]);

  // NEW: Fetch API Stats
  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await api.analytics.getApiServiceStat(apiId);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [apiId]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please log in to rate this API');
      return;
    }

    setIsRating(true);
    try {
      const response = await api.analytics.rateApiService(apiId, { rating });
      if (response.success) {
        toast.success('Thank you for your rating!');
        setUserRating(rating);
        // Persist user rating locally since backend doesn't provide a "get my rating" endpoint yet
        localStorage.setItem(`rating_${apiId}_${user.id || 'anonymous'}`, rating.toString());
        // Refresh stats to show updated average
        refreshStats();
      } else {
        toast.error(response.error?.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsRating(false);
    }
  };

  // NEW: Initial rating load
  useEffect(() => {
    if (user && apiId) {
      const savedRating = localStorage.getItem(`rating_${apiId}_${user.id || 'anonymous'}`);
      if (savedRating) {
        setUserRating(parseInt(savedRating));
      }
    }
  }, [user, apiId]);

  // Check user's subscription for this API
  useEffect(() => {
    refreshSubscriptionData();
  }, [refreshSubscriptionData]);

  // Fetch API details from backend
  useEffect(() => {
    const fetchApiDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.apiServices.getById(apiId);

        if (response.success && response.data) {
          const service = response.data;

          // Transform backend data to match the ApiDetails interface with defaults
          const transformedDetails: ApiDetails = {
            id: service.id,
            name: service.name || 'Unnamed API',
            description: service.description || 'No description available',
            version: service.version || '1.0.0',
            status: (service.status?.toLowerCase() as 'active' | 'maintenance' | 'deprecated') || 'active',
            category: service.category || 'Other',
            rating: stats?.averageRating || 0,
            totalUsers: stats?.totalSubscribers || 0,
            basePath: service.serviceKey || '/api',
            supportEmail: 'support@api.com',
            documentation: 'https://docs.api.com',
            logo: service.logoUrl || '',
            creator: {
              id: 'creator-1',
              name: 'API Creator',
              company: 'API Company',
              logo: '/api/placeholder/64/64',
              description: 'Trusted API provider',
              website: 'https://api.com',
              email: 'contact@api.com',
              verified: true,
              totalProducts: 1,
              averageRating: 4.5,
              joinedDate: '2024-01-01',
            },
            currentSubscription: userSubscription ? {
              planId: userSubscription.planId,
              planName: userSubscription.plan?.name || 'Unknown Plan',
              usage: {
                current: realUsage && userSubscription.plan?.quotaLimit
                  ? userSubscription.plan.quotaLimit - realUsage.quotasLeft
                  : 0,
                quota: userSubscription.plan?.quotaLimit || 0,
                resetDate: realUsage?.resetAt || userSubscription.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              },
              nextBilling: userSubscription.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: userSubscription.isCanceled ? 'cancelled' : 'active',
            } : undefined,
            apiKey: userSubscription?.apiKey || undefined,
            endpoints: [], // Populated from backend
            plans: [], // Populated from backend
            changelog: [],
            faq: [],
            errorCodes: [],
          };

          setApiDetails(transformedDetails);
          toast.success(`Synchronized ${service.name} data`);
        } else {
          const errorMsg = response.error?.message || 'Failed to load API details';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred while loading API details';
        console.error('Error fetching API details:', err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiDetails();
  }, [apiId, isSubscribed, stats, realUsage]);

  // Function to refresh plans
  const refreshPlans = useCallback(async () => {
    if (!apiId) return;

    setIsLoadingPlans(true);
    try {
      const response = await api.plans.listForService(apiId);

      if (response.success && response.data) {
        // Transform backend plans to ApiPlan format
        const transformedPlans: ApiPlan[] = response.data.map((plan) => {
          // Check if this plan matches the user's subscription
          const isUserCurrentPlan = userSubscription && userSubscription.planId === plan.id;

          return {
            id: plan.id,
            name: plan.name || 'Unnamed Plan',
            type: (plan.type?.toLowerCase() as 'free' | 'pro' | 'enterprise') || 'free',
            price: (plan.priceInCents || 0) / 100, // Convert from cents to dollars
            billingPeriod: plan.billingPeriod || 'monthly',
            quota: plan.quotaLimit,
            quotaPeriod: plan.quotaResetPeriod || 'Monthly',
            rateLimit: plan.rateLimit,
            rateLimitPeriod: plan.rateLimitWindow as unknown as string,
            features: plan.features || [],
            isCurrentPlan: !!isUserCurrentPlan,
            badgeColor: plan.type?.toLowerCase() === 'free'
              ? 'bg-gray-500/10 text-gray-400 border-gray-500/30'
              : plan.type?.toLowerCase() === 'pro'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            subscriptionsCount: 0,
            tierLevel: plan.tierLevel,
          };
        });

        setBackendPlans(transformedPlans);

        // Fetch stats for each plan to determine popularity
        response.data.forEach(async (plan) => {
          try {
            const statRes = await api.analytics.getPlanStat(plan.id);
            if (statRes.success && statRes.data) {
              setPlanStats(prev => ({ ...prev, [plan.id]: statRes.data! }));
            }
          } catch (err) {
            console.error(`Error fetching stats for plan ${plan.id}:`, err);
          }
        });
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      // Silently fail - we'll use mock plans as fallback
    } finally {
      setIsLoadingPlans(false);
    }
  }, [apiId, userSubscription]);

  // NEW: Fetch endpoints from backend
  const refreshEndpoints = useCallback(async () => {
    if (!apiId) return;

    setIsLoadingEndpoints(true);
    try {
      const response = await api.endpoints.listForService(apiId);
      if (response.success && response.data) {
        const transformedEndpoints: ApiEndpoint[] = response.data.map(ep => ({
          path: ep.publicPath || '',
          method: (ep.httpMethod?.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE') || 'GET',
          name: ep.publicPath?.split('/').pop() || 'Endpoint',
          description: `API endpoint for ${ep.publicPath}`,
          planRestrictions: [],
          parameters: [],
        }));
        setBackendEndpoints(transformedEndpoints);
      }
    } catch (err) {
      console.error('Error fetching endpoints:', err);
    } finally {
      setIsLoadingEndpoints(false);
    }
  }, [apiId]);

  // Fetch plans and endpoints from backend
  useEffect(() => {
    refreshPlans();
    refreshEndpoints();
  }, [refreshPlans, refreshEndpoints]);

  // Loading state - include subscription check
  if (isLoading || isCheckingSubscription) {
    return (
      <RoleGuard allowedRoles={['consumer', 'creator']}>
        <DashboardLayout>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading API details...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  // Error state
  if (error || !apiDetails) {
    return (
      <RoleGuard allowedRoles={['consumer', 'creator']}>
        <DashboardLayout>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                API Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                {error || `The API you're looking for (ID: ${apiId}) doesn't exist or has been removed.`}
              </p>
              <Button variant="outline" onClick={() => router.push('/marketplace')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  // Create a copy and override subscription data based on actual user subscription status
  let finalApiDetails = { ...apiDetails };
  if (!isSubscribed) {
    finalApiDetails = {
      ...finalApiDetails,
      currentSubscription: undefined,
      apiKey: undefined,
    };
  }
  // Use backend data exclusively
  const plansToUse = backendPlans;
  const endpointsToUse = backendEndpoints;
  const currentPlan = plansToUse.find(plan => plan.isCurrentPlan);

  // Calculate usage percentage with proper null checks
  const usagePercentage = (() => {
    if (!finalApiDetails.currentSubscription) return 0;
    const current = finalApiDetails.currentSubscription.usage.current || 0;
    const quota = finalApiDetails.currentSubscription.usage.quota || 1;
    if (quota === 0) return 0;
    return (current / quota) * 100;
  })();

  const isNearLimit = usagePercentage > 80;

  const handlePlanChange = async (newPlanId: string) => {
    if (!userSubscription) {
      toast.error('No active subscription found');
      return;
    }

    try {
      const response = await api.subscriptions.changePlan(userSubscription.id, {
        targetPlanId: newPlanId,
      });

      if (response.success) {
        // Immediately refresh subscription data
        await refreshSubscriptionData();

        // Refresh plans to show updated current plan
        await refreshPlans();

        toast.success('Plan updated successfully!');
      } else {
        toast.error(response.error?.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleCancelSubscription = async (planId: string) => {
    if (!userSubscription) {
      toast.error('No active subscription found');
      return;
    }

    try {
      const response = await api.subscriptions.cancel(userSubscription.id);

      if (response.success) {
        // Immediately refresh subscription data
        await refreshSubscriptionData();

        // Refresh plans to show updated state
        await refreshPlans();

        toast.success('Subscription canceled successfully');
      } else {
        toast.error(response.error?.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(`https://api.enforcer.com${finalApiDetails.basePath}`);
    toast.success('Base URL copied to clipboard!');
  };

  const handleCopyApiKey = () => {
    if (finalApiDetails.apiKey) {
      navigator.clipboard.writeText(finalApiDetails.apiKey);
      toast.success('API key copied to clipboard!');
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      toast.loading('Creating subscription...');

      const response = await api.subscriptions.create({
        planId: planId,
        apiServiceId: finalApiDetails.id,
      });

      if (response.success) {
        toast.success('Subscription created successfully!');
        // Redirect to subscriptions page to view the new subscription
        router.push('/subscriptions');
      } else {
        toast.error(response.error?.message || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleTestEndpoint = async (endpoint: ApiEndpoint) => {
    setIsTestingEndpoint(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '99',
          'X-RateLimit-Reset': '2024-01-30T13:00:00Z'
        },
        data: endpoint.response?.example
      };

      setTestResponse(JSON.stringify(mockResponse, null, 2));
      toast.success('Test request successful!');
    } catch (error) {
      setTestResponse(JSON.stringify({
        error: 'Failed to test endpoint',
        message: 'Please check your parameters and try again'
      }, null, 2));
      toast.error('Test request failed');
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  const buildRequestUrl = (endpoint: ApiEndpoint): string => {
    let url = `https://api.enforcer.com${finalApiDetails.basePath}${endpoint.path}`;

    // Replace path parameters with actual values or placeholders
    const pathParams = endpoint.path.match(/{([^}]+)}/g);
    if (pathParams) {
      pathParams.forEach(param => {
        const paramName = param.slice(1, -1);
        const value = testParameters[paramName] || `{${paramName}}`;
        url = url.replace(param, value);
      });
    }

    // Add query parameters for GET requests
    if (endpoint.method === 'GET') {
      const queryParams = (endpoint.parameters || []).filter(p => !pathParams?.includes(`{${p.name}}`));
      const params = new URLSearchParams();

      queryParams.forEach(param => {
        const value = testParameters[param.name];
        if (value) {
          params.append(param.name, value);
        }
      });

      if (params.toString()) {
        url += '?' + params.toString();
      }
    }

    return url;
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'POST':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'PUT':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'pro':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'enterprise':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getRequiredPlan = (planRestrictions: string[]) => {
    // If no restrictions, it's available to all plans (Free)
    if (!planRestrictions || planRestrictions.length === 0) {
      const freePlan = finalApiDetails.plans.find(p => p.type === 'free');
      return freePlan ? { name: freePlan.name, type: freePlan.type, badgeColor: freePlan.badgeColor } : { name: 'Free', type: 'free', badgeColor: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
    }

    // Check plan hierarchy - return the lowest tier that has access
    const planHierarchy = ['free', 'pro', 'enterprise'];

    // Find the lowest tier plan that has access from the restrictions
    for (const tier of planHierarchy) {
      if (planRestrictions.includes(tier)) {
        const plan = finalApiDetails.plans.find(p => p.type === tier);
        if (plan) {
          return { name: plan.name, type: plan.type, badgeColor: plan.badgeColor };
        }
      }
    }

    // If restrictions exist but don't match our hierarchy, default to Pro
    const proPlan = finalApiDetails.plans.find(p => p.type === 'pro');
    return proPlan ? { name: proPlan.name, type: proPlan.type, badgeColor: proPlan.badgeColor } : { name: 'Pro', type: 'pro', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'deprecated':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'changed':
      case 'improved':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'deprecated':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'removed':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'fixed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'security':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const hasAccessToEndpoint = (endpoint: ApiEndpoint): boolean => {
    if (!isSubscribed) return false;
    if (!endpoint.planRestrictions.length) return true;
    return endpoint.planRestrictions.includes(currentPlan?.type || 'free');
  };

  const separateParameters = (endpoint: ApiEndpoint) => {
    const pathParams = endpoint.path.match(/{([^}]+)}/g)?.map(p => p.slice(1, -1)) || [];

    return {
      pathParameters: (endpoint.parameters || []).filter(p => pathParams.includes(p.name)),
      queryParameters: (endpoint.parameters || []).filter(p => !pathParams.includes(p.name))
    };
  };

  if (!user) return null;

  return (
    <RoleGuard allowedRoles={['consumer', 'creator']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          {/* Header with API Info and Creator */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* API Information */}
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-border/50 overflow-hidden">
                {apiDetails.logo ? (
                  <img src={apiDetails.logo} alt={apiDetails.name} className="w-full h-full object-contain" />
                ) : (
                  <Package className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {finalApiDetails.name}
                  </h1>
                  <Badge variant="outline" className="text-yellow-400">
                    v{apiDetails.version}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                    {apiDetails.category}
                  </Badge>
                  <Badge variant="outline" className="text-foreground">
                    <Star className="h-3 w-3 mr-1 text-yellow-400" />
                    {apiDetails.rating.toFixed(1)}/5
                  </Badge>
                  <Badge variant="outline" className="text-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    {apiDetails.totalUsers.toLocaleString()} users
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 max-w-3xl">
                  {apiDetails.description}
                </p>

                {/* Star Rating Interaction */}
                {isSubscribed && (
                  <div className="flex flex-col space-y-2 mt-4 p-4 rounded-xl bg-muted/20 border border-border/50 max-w-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Rate this API</span>
                      {userRating > 0 && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-[10px] h-5">
                          My Rating: {userRating}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <StarRating
                        initialRating={userRating}
                        onRate={handleRate}
                        readonly={isRating}
                        size="md"
                      />
                      <span className="text-xs text-muted-foreground">
                        {stats?.totalRatings || 0} reviews
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Creator/Publisher Information */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20 w-full lg:w-80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Published by</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12 border border-border/50">
                    <AvatarImage src={apiDetails.creator.logo} alt={apiDetails.creator.company} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {apiDetails.creator.company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{apiDetails.creator.company}</h3>
                      {apiDetails.creator.verified && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{apiDetails.creator.name}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{apiDetails.creator.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">APIs</span>
                    <div className="text-foreground font-medium">{apiDetails.creator.totalProducts}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service Health</span>
                    <div className="text-foreground font-medium flex items-center">
                      <Zap className="h-3 w-3 text-green-400 mr-1" />
                      {stats ? `${stats.uptimePercentage.toFixed(1)}%` : '99.9%'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={apiDetails.creator.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-3 w-3 mr-1" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`mailto:${apiDetails.creator.email}`}>
                      <Mail className="h-3 w-3 mr-1" />
                      Contact
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Information Section - Base URL and API Key */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardContent className="pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Base URL</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <code className="text-sm bg-muted/50 px-3 py-2 rounded font-mono text-foreground">
                      https://api.enforcer.com{apiDetails.basePath}
                    </code>
                    <Button variant="ghost" size="sm" onClick={handleCopyBaseUrl}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {isSubscribed && apiDetails.apiKey ? (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Your API Key</Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <code className="text-sm bg-muted/50 px-3 py-2 rounded font-mono text-foreground flex-1">
                        {showApiKey ? apiDetails.apiKey : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCopyApiKey}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rate Limit</Label>
                    <div className="text-sm text-foreground mt-1">
                      {currentPlan?.rateLimit || 'Not subscribed'}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status - Different for Subscribed vs Unsubscribed */}
          {isSubscribed ? (
            /* Current Subscription & Usage Dashboard */
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Current Subscription</span>
                  </CardTitle>
                  <Badge variant="outline" className={getPlanColor(currentPlan?.type || 'free')}>
                    {currentPlan?.name || 'No Plan'}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {finalApiDetails.currentSubscription ? 'Monthly usage and quota information' : 'Subscription information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {finalApiDetails.currentSubscription ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="text-2xl font-bold text-foreground">
                          {finalApiDetails.currentSubscription.usage.current.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">API Calls Used</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="text-2xl font-bold text-foreground">
                          {((finalApiDetails.currentSubscription.usage.quota - finalApiDetails.currentSubscription.usage.current)).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Calls Remaining</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/20">
                        <div className="text-2xl font-bold text-foreground">
                          {Math.ceil((new Date(finalApiDetails.currentSubscription.usage.resetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Until Reset</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Usage</span>
                        <span className="text-foreground">
                          {usagePercentage.toFixed(1)}% of {finalApiDetails.currentSubscription.usage.quota.toLocaleString()} calls
                        </span>
                      </div>
                      <Progress
                        value={usagePercentage}
                        className={`h-2 ${isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                      />
                    </div>

                    {isNearLimit && (
                      <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                        <AlertTriangle className="h-4 w-4" />
                        <div>
                          <span className="font-medium">High usage detected.</span>
                          <span className="ml-1">Consider upgrading to avoid hitting quota limits.</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Billing Date</span>
                        <span className="text-foreground font-medium">
                          {new Date(finalApiDetails.currentSubscription.nextBilling).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan Rate Limit</span>
                        <span className="text-foreground font-medium">
                          {currentPlan?.rateLimit ? currentPlan.rateLimit : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No subscription information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Subscribe Call-to-Action */
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Start Using This API</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                    Not Subscribed
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  Subscribe to any plan to unlock full documentation, get your API key, and start making requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <div className="p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-primary mb-1">📖</div>
                    <div className="text-sm font-medium text-foreground">Full Documentation</div>
                    <div className="text-xs text-muted-foreground">Complete API reference</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-primary mb-1">🔑</div>
                    <div className="text-sm font-medium text-foreground">API Key Access</div>
                    <div className="text-xs text-muted-foreground">Authenticate your requests</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-primary mb-1">🚀</div>
                    <div className="text-sm font-medium text-foreground">Live Testing</div>
                    <div className="text-xs text-muted-foreground">Interactive playground</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => handleSubscribe('pro')} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Subscribe to Pro Plan - ${apiDetails.plans.find(p => p.id === 'pro')?.price}/month
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('plans')} className="flex-1">
                    Compare All Plans
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Free plan available • Start with {apiDetails.plans.find(p => p.id === 'free')?.quota.toLocaleString()} requests/month
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>



            {/* NEW: Comprehensive Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Endpoint Listing Sidebar */}
                <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Endpoints</span>
                    </CardTitle>
                    <CardDescription>
                      {apiDetails.endpoints.length} endpoints available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {apiDetails.endpoints.map((endpoint, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedEndpoint?.path === endpoint.path
                          ? 'bg-primary/10 border-primary/20'
                          : 'bg-muted/20 border-border/50 hover:bg-muted/30'
                          }`}
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setTestParameters({});
                          setTestResponse(null);
                        }}
                      >
                        {/* Top row: Endpoint name (left) and Plan type (right) */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-lg font-semibold text-foreground">
                            {endpoint.name || 'Untitled Endpoint'}
                          </div>
                          <Badge variant="outline" className={`${getRequiredPlan(endpoint.planRestrictions).badgeColor} text-xs`}>
                            {getRequiredPlan(endpoint.planRestrictions).name}
                          </Badge>
                        </div>

                        {/* HTTP method badge + route */}
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <div className="text-sm font-mono text-foreground">
                            <RouteDisplay route={endpoint.path} className="text-sm" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                          {endpoint.description}
                        </p>

                        {/* Rate limit badge at bottom right with spacing - only if endpoint overrides plan rate limit */}
                        {endpoint.rateLimit && (!currentPlan || !endpoint.rateLimit.includes(String(currentPlan.rateLimit))) && (
                          <div className="flex justify-end">
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                              {endpoint.rateLimit}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Endpoint Details & Testing */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedEndpoint ? (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className={getMethodColor(selectedEndpoint.method)}>
                              {selectedEndpoint.method}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground">
                              <RouteDisplay route={selectedEndpoint.path} />
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedEndpoint(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getRequiredPlan(selectedEndpoint.planRestrictions).badgeColor}`}>
                              {getRequiredPlan(selectedEndpoint.planRestrictions).name}
                            </Badge>
                            {isSubscribed && (
                              <Badge variant="outline" className={
                                hasAccessToEndpoint(selectedEndpoint)
                                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                              }>
                                {hasAccessToEndpoint(selectedEndpoint) ? 'Available' : 'Upgrade Required'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{selectedEndpoint.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <Tabs defaultValue="documentation" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="documentation">Documentation</TabsTrigger>
                            <TabsTrigger value="testing">Try It Out</TabsTrigger>
                          </TabsList>

                          {/* Documentation Tab Content */}
                          <TabsContent value="documentation" className="space-y-6">
                            {/* Endpoint Name at the Very Top */}
                            <div>
                              <h2 className="text-2xl font-bold text-foreground mb-6">{selectedEndpoint.name || 'Untitled Endpoint'}</h2>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-2">Request URL</h4>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <code className="text-sm text-foreground">
                                  https://api.enforcer.com{apiDetails.basePath}
                                  <RouteDisplay route={selectedEndpoint.path} />
                                </code>
                              </div>
                            </div>

                            {/* Path Parameters */}
                            {(() => {
                              const { pathParameters } = separateParameters(selectedEndpoint);
                              return pathParameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-foreground mb-2">Path Parameters</h4>
                                  <div className="space-y-2">
                                    {pathParameters.map((param, index) => (
                                      <div key={index} className="border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-3 mb-2">
                                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                            {param.name}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {param.type}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
                                            required
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{param.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Query Parameters */}
                            {(() => {
                              const { queryParameters } = separateParameters(selectedEndpoint);
                              return queryParameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-foreground mb-2">Query Parameters</h4>
                                  <div className="space-y-2">
                                    {queryParameters.map((param, index) => (
                                      <div key={index} className="border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-3 mb-2">
                                          <code className="text-sm text-foreground">{param.name}</code>
                                          <Badge variant="outline" className="text-xs">
                                            {param.type}
                                          </Badge>
                                          <Badge variant="outline" className={`text-xs ${param.required
                                            ? 'text-red-400 border-red-500/30'
                                            : 'text-muted-foreground'
                                            }`}>
                                            {param.required ? 'required' : 'optional'}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{param.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Request Body (if endpoint has one) */}
                            {selectedEndpoint.requestBody && (
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-2">Request Body</h4>
                                <div className="border border-border/50 rounded-lg p-4">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <Badge variant="outline" className="text-xs">
                                      {selectedEndpoint.requestBody.contentType}
                                    </Badge>
                                    <Badge variant="outline" className={`text-xs ${selectedEndpoint.requestBody.required
                                      ? 'text-red-400 border-red-500/30'
                                      : 'text-muted-foreground'
                                      }`}>
                                      {selectedEndpoint.requestBody.required ? 'required' : 'optional'}
                                    </Badge>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <h5 className="text-xs font-medium text-muted-foreground mb-2">Schema</h5>
                                      <div className="bg-muted/50 p-3 rounded">
                                        <pre className="text-xs text-foreground overflow-x-auto">
                                          <code>{JSON.stringify(selectedEndpoint.requestBody.schema, null, 2)}</code>
                                        </pre>
                                      </div>
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-medium text-muted-foreground mb-2">Example</h5>
                                      <div className="bg-muted/50 p-3 rounded">
                                        <pre className="text-xs text-foreground overflow-x-auto">
                                          <code>{JSON.stringify(selectedEndpoint.requestBody.example, null, 2)}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Response Example */}
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-2">Example Response</h4>
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <pre className="text-sm text-foreground overflow-x-auto">
                                  <code>{JSON.stringify(selectedEndpoint.response?.example, null, 2)}</code>
                                </pre>
                              </div>
                            </div>

                            {/* Status Codes */}
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-2">Response Status Codes</h4>
                              <div className="space-y-2">
                                {selectedEndpoint.statusCodes?.map((statusCode, index) => (
                                  <div key={index} className="border border-border/50 rounded-lg p-3">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <Badge variant="outline" className={`text-xs ${statusCode.code >= 200 && statusCode.code < 300
                                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                        : statusCode.code >= 400 && statusCode.code < 500
                                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                        }`}>
                                        {statusCode.code}
                                      </Badge>
                                      <span className="text-sm font-medium text-foreground">
                                        {statusCode.code >= 200 && statusCode.code < 300 ? 'Success' :
                                          statusCode.code >= 400 && statusCode.code < 500 ? 'Client Error' : 'Server Error'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {statusCode.description}
                                    </p>
                                    {statusCode.example && (
                                      <div>
                                        <h6 className="text-xs font-medium text-muted-foreground mb-1">Example Response</h6>
                                        <div className="bg-muted/50 p-2 rounded">
                                          <pre className="text-xs text-foreground overflow-x-auto">
                                            <code>{JSON.stringify(statusCode.example, null, 2)}</code>
                                          </pre>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          {/* Try It Out Tab Content */}
                          <TabsContent value="testing" className="space-y-6">
                            {!isSubscribed ? (
                              <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                                  <Play className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Subscribe to Test Endpoints</h3>
                                <p className="text-muted-foreground mb-4">
                                  Interactive testing requires an API key. Subscribe to any plan to unlock live endpoint testing.
                                </p>
                                <div className="flex gap-3 justify-center">
                                  <Button onClick={() => setActiveTab('plans')} variant="outline">
                                    View Plans
                                  </Button>
                                  <Button onClick={() => handleSubscribe('pro')}>
                                    Subscribe to Pro Plan
                                  </Button>
                                </div>
                              </div>
                            ) : !hasAccessToEndpoint(selectedEndpoint) ? (
                              <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-400 mb-4">
                                  <AlertTriangle className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Upgrade Required</h3>
                                <p className="text-muted-foreground mb-4">
                                  This endpoint requires {getRequiredPlan(selectedEndpoint.planRestrictions).name} plan or higher.
                                </p>
                                <Button onClick={() => setActiveTab('plans')}>
                                  Upgrade Plan
                                </Button>
                              </div>
                            ) : (
                              <div className="grid gap-6 lg:grid-cols-2">
                                {/* Request Configuration */}
                                <div className="space-y-4">
                                  <h4 className="text-lg font-semibold text-foreground">Configure Request</h4>

                                  {/* Request URL Display */}
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Request URL</Label>
                                    <div className="mt-1 p-2 bg-muted/50 rounded border text-sm font-mono">
                                      {selectedEndpoint ? buildRequestUrl(selectedEndpoint) : ''}
                                    </div>
                                  </div>

                                  {/* Parameter Inputs */}
                                  {(selectedEndpoint.parameters || []).map((param, index) => (
                                    <div key={index}>
                                      <Label className="text-sm font-medium text-foreground flex items-center space-x-2 mb-1">
                                        <span>{param.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {param.type}
                                        </Badge>
                                        {param.required && (
                                          <span className="text-red-400">*</span>
                                        )}
                                      </Label>
                                      <Input
                                        placeholder={`Enter ${param.name}`}
                                        value={testParameters[param.name] || ''}
                                        onChange={(e) => setTestParameters(prev => ({
                                          ...prev,
                                          [param.name]: e.target.value
                                        }))}
                                        className="bg-background/50 border-border/50"
                                      />
                                      {param.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {param.description}
                                        </p>
                                      )}
                                    </div>
                                  ))}

                                  <Button
                                    onClick={() => selectedEndpoint && handleTestEndpoint(selectedEndpoint)}
                                    disabled={isTestingEndpoint}
                                    className="w-full"
                                  >
                                    {isTestingEndpoint ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Testing...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Request
                                      </>
                                    )}
                                  </Button>
                                </div>

                                {/* Response Display */}
                                <div className="space-y-4">
                                  <h4 className="text-lg font-semibold text-foreground">Response</h4>

                                  {testResponse ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <span className="text-sm text-green-400 font-medium">200 OK</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            navigator.clipboard.writeText(testResponse);
                                            toast.success('Response copied to clipboard!');
                                          }}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <div className="bg-muted/50 p-4 rounded-lg max-h-96 overflow-auto">
                                        <pre className="text-sm text-foreground">
                                          <code>{testResponse}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-muted/20 p-8 rounded-lg text-center">
                                      <Play className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-muted-foreground">
                                        Configure parameters and send a request to see the response
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ) : (
                    /* Default state when no endpoint is selected */
                    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                      <CardContent className="pt-6">
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                            <Code className="h-8 w-8" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Select an Endpoint</h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            Choose an endpoint from the sidebar to view its documentation, parameters, and test it interactively.
                          </p>
                          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto text-sm mt-6">
                            <div className="p-4 rounded-lg bg-muted/20">
                              <div className="text-2xl mb-2">📖</div>
                              <div className="font-medium text-foreground">Complete Documentation</div>
                              <div className="text-muted-foreground">Parameters, examples, responses</div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/20">
                              <div className="text-2xl mb-2">🧪</div>
                              <div className="font-medium text-foreground">Interactive Testing</div>
                              <div className="text-sm text-foreground">Test with real parameters</div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/20">
                              <div className="text-2xl mb-2">📋</div>
                              <div className="font-medium text-foreground">Copy & Use</div>
                              <div className="text-muted-foreground">Ready-to-use examples</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6 mt-8">

              {isLoadingPlans ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground font-medium animate-pulse">Synchronizing plan data...</p>
                </div>
              ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {(() => {
                    const plansToDisplay = backendPlans.length > 0 ? backendPlans : apiDetails.plans;

                    // Sort plans by tier level (ascending - lowest to highest)
                    const sortedPlans = [...plansToDisplay].sort((a, b) => {
                      const tierA = a.tierLevel ?? (a.type === 'free' ? 0 : a.type === 'pro' ? 1 : 2);
                      const tierB = b.tierLevel ?? (b.type === 'free' ? 0 : b.type === 'pro' ? 1 : 2);
                      return tierA - tierB;
                    });

                    // Reusing the same popular plan logic from studio
                    const popularPlanId = sortedPlans.length > 0
                      ? (() => {
                        const statsArray = Object.values(planStats);
                        if (statsArray.length === 0) return sortedPlans.find(p => p.type === 'pro')?.id;
                        return statsArray.reduce((prev, curr) =>
                          (curr.activeSubscribers > (prev.activeSubscribers || 0)) ? curr : prev
                          , { activeSubscribers: -1, planId: null }).planId;
                      })()
                      : null;

                    return sortedPlans.map((plan) => {
                      const isThisCurrentPlan = isSubscribed && plan.id === userSubscription?.planId;
                      const currentPlanIndex = sortedPlans.findIndex(p => p.id === userSubscription?.planId);
                      const thisPlanIndex = sortedPlans.findIndex(p => p.id === plan.id);

                      const isUpgrade = isSubscribed && !isThisCurrentPlan && currentPlanIndex >= 0 && thisPlanIndex > currentPlanIndex;
                      const isDowngrade = isSubscribed && !isThisCurrentPlan && currentPlanIndex >= 0 && thisPlanIndex < currentPlanIndex;

                      const actionType = isThisCurrentPlan ? 'current' : isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'subscribe';

                      // Format for PlanCard
                      const cardPlan = {
                        id: plan.id,
                        name: plan.name,
                        type: plan.type,
                        price: plan.price,
                        billingPeriod: plan.billingPeriod || 'Monthly',
                        quotaLimit: plan.quota,
                        quotaPeriod: plan.quotaPeriod || 'Monthly',
                        rateLimit: plan.rateLimit,
                        rateLimitPeriod: plan.rateLimitPeriod || 'Minute',
                        features: plan.features,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                      };

                      return (
                        <div key={plan.id} className="h-full">
                          <PlanCard
                            plan={cardPlan as any}
                            onSubscribe={() => {
                              if (isSubscribed) {
                                handlePlanChange(plan.id);
                              } else {
                                handleSubscribe(plan.id);
                              }
                            }}
                            onCancel={() => handleCancelSubscription(plan.id)}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            userRole="consumer"
                            isCurrentPlan={isThisCurrentPlan}
                            isPopular={plan.id === popularPlanId}
                            actionType={actionType}
                            activeSubscribers={planStats[plan.id]?.activeSubscribers}
                            totalSubscribers={planStats[plan.id]?.totalSubscribers}
                          />
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </TabsContent>

            {/* Support & Community Tab */}
            <TabsContent value="support" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* FAQ Section */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {apiDetails.faq.map((item) => (
                      <div key={item.id} className="border border-border/50 rounded-lg">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/20 rounded-lg"
                          onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                        >
                          <span className="font-medium text-foreground">{item.question}</span>
                          {expandedFaq === item.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        {expandedFaq === item.id && (
                          <div className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Support Channels */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>Support Channels</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-3 mb-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Email Support</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Get help via email for technical and billing questions
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${apiDetails.supportEmail}`}>
                            Contact Support
                          </a>
                        </Button>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-3 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Documentation</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Comprehensive guides and API references
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={apiDetails.documentation} target="_blank" rel="noopener noreferrer">
                            View Docs
                          </a>
                        </Button>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-3 mb-2">
                          <Bug className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Report Issues</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Found a bug or have suggestions?
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${apiDetails.supportEmail}?subject=Bug Report - ${finalApiDetails.name}`}>
                            Report Issue
                          </a>
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Response times by plan:
                      </p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Free Plan:</span>
                          <span>48-72 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pro Plan:</span>
                          <span>12-24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enterprise:</span>
                          <span>2-4 hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Changelog Tab */}
            <TabsContent value="changelog" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Release History</span>
                  </CardTitle>
                  <CardDescription>
                    Track all updates, improvements, and fixes to this API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {apiDetails.changelog.map((release, index) => (
                      <div key={index} className="relative">
                        {index !== apiDetails.changelog.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-px bg-border/50" />
                        )}
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-foreground">
                                Version {release.version}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {new Date(release.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {release.changes.map((change, changeIndex) => (
                                <div key={changeIndex} className="flex items-start space-x-2">
                                  <Badge variant="outline" className={`${getChangeTypeColor(change.type)} text-xs flex-shrink-0`}>
                                    {change.type}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {change.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}