'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { ApiPlayground } from '@/components/api/api-playground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
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
} from 'lucide-react';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: {
    example: object;
    schema: string;
  };
  planRestrictions: string[];
}

interface ApiPlan {
  id: string;
  name: string;
  type: 'free' | 'pro' | 'enterprise';
  price: number;
  quota: number;
  rateLimit: string;
  features: string[];
  isCurrentPlan: boolean;
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
    type: 'added' | 'changed' | 'improved' | 'deprecated' | 'removed' | 'fixed' | 'security';
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
  provider: string;
  category: string;
  rating: number;
  totalUsers: number;
  basePath: string;
  supportEmail: string;
  documentation: string;
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
const mockApiDetails: { [key: string]: ApiDetails } = {
  '1': {
    id: '1',
    name: 'Weather API',
    description: 'Real-time weather data and forecasts for any location worldwide with historical data access and advanced meteorological insights. Perfect for mobile apps, websites, and IoT devices.',
    version: '2.1.0',
    status: 'active',
    provider: 'Weather Corp',
    category: 'Weather & Environment',
    rating: 4.8,
    totalUsers: 12500,
    basePath: '/weather',
    supportEmail: 'support@weatherapi.com',
    documentation: 'https://docs.weatherapi.com',
    creator: {
      id: 'weather-corp',
      name: 'Weather Corp',
      company: 'Weather Corporation Ltd.',
      logo: '/api/placeholder/64/64',
      description: 'Leading provider of weather data and meteorological services since 2015. Trusted by thousands of developers worldwide.',
      website: 'https://weathercorp.com',
      email: 'contact@weathercorp.com',
      verified: true,
      totalProducts: 8,
      averageRating: 4.7,
      joinedDate: '2020-03-15',
    },
    currentSubscription: {
      planId: 'pro',
      planName: 'Pro Plan',
      usage: {
        current: 1850,
        quota: 10000,
        resetDate: '2024-02-01T00:00:00Z',
      },
      nextBilling: '2024-02-15T00:00:00Z',
      status: 'active',
    },
    apiKey: 'wx_live_4f8b2a9d1e7c3f6a8b2d5e9c1a4b7e8f',
    endpoints: [
      {
        path: '/current',
        method: 'GET',
        description: 'Get current weather conditions for a specific location',
        parameters: [
          { name: 'city', type: 'string', required: true, description: 'City name or coordinates (lat,lon)' },
          { name: 'units', type: 'string', required: false, description: 'Temperature units: metric, imperial, or kelvin' },
        ],
        response: {
          example: {
            location: 'New York, NY',
            temperature: 22,
            condition: 'Sunny',
            humidity: 65,
            wind_speed: 12,
            visibility: 10,
            pressure: 1013.25
          },
          schema: 'WeatherResponse'
        },
        planRestrictions: [],
      },
      {
        path: '/forecast',
        method: 'GET',
        description: 'Get weather forecast for up to 14 days',
        parameters: [
          { name: 'city', type: 'string', required: true, description: 'City name or coordinates (lat,lon)' },
          { name: 'days', type: 'number', required: false, description: 'Number of forecast days (1-14, default: 7)' },
          { name: 'units', type: 'string', required: false, description: 'Temperature units: metric, imperial, or kelvin' },
        ],
        response: {
          example: {
            location: 'New York, NY',
            forecast: [
              { date: '2024-01-30', high: 25, low: 15, condition: 'Partly Cloudy', precipitation: 20 },
              { date: '2024-01-31', high: 23, low: 12, condition: 'Sunny', precipitation: 0 }
            ]
          },
          schema: 'ForecastResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/historical',
        method: 'GET',
        description: 'Access historical weather data for up to 10 years',
        parameters: [
          { name: 'city', type: 'string', required: true, description: 'City name or coordinates (lat,lon)' },
          { name: 'date', type: 'string', required: true, description: 'Date in YYYY-MM-DD format' },
          { name: 'units', type: 'string', required: false, description: 'Temperature units: metric, imperial, or kelvin' },
        ],
        response: {
          example: {
            location: 'New York, NY',
            date: '2024-01-15',
            temperature: 18,
            condition: 'Rainy',
            precipitation: 15.2,
            wind_speed: 8
          },
          schema: 'HistoricalResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/alerts',
        method: 'GET',
        description: 'Get severe weather alerts and warnings for a location',
        parameters: [
          { name: 'city', type: 'string', required: true, description: 'City name or coordinates (lat,lon)' },
          { name: 'severity', type: 'string', required: false, description: 'Filter by alert severity: minor, moderate, severe, extreme' },
        ],
        response: {
          example: {
            location: 'Miami, FL',
            alerts: [
              { id: '123', type: 'Hurricane Warning', severity: 'extreme', issued: '2024-01-30T10:00:00Z', expires: '2024-01-31T18:00:00Z' }
            ]
          },
          schema: 'AlertResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/premium/satellite',
        method: 'GET',
        description: 'Access high-resolution satellite imagery and radar data',
        parameters: [
          { name: 'lat', type: 'number', required: true, description: 'Latitude coordinate' },
          { name: 'lon', type: 'number', required: true, description: 'Longitude coordinate' },
          { name: 'zoom', type: 'number', required: false, description: 'Zoom level (1-10, default: 5)' },
        ],
        response: {
          example: {
            image_url: 'https://satellite.weatherapi.com/image/123',
            timestamp: '2024-01-30T12:00:00Z',
            resolution: '1km',
            coverage: 'North America'
          },
          schema: 'SatelliteResponse'
        },
        planRestrictions: ['enterprise'],
      },
      {
        path: '/premium/analytics',
        method: 'POST',
        description: 'Advanced weather analytics and custom weather models',
        parameters: [
          { name: 'regions', type: 'array', required: true, description: 'Array of coordinate pairs for analysis' },
          { name: 'model_type', type: 'string', required: true, description: 'Analysis model: temperature, precipitation, wind_patterns' },
          { name: 'timeframe', type: 'string', required: false, description: 'Analysis timeframe: 7d, 30d, 90d' },
        ],
        response: {
          example: {
            analysis_id: 'analytics_789',
            model: 'temperature',
            insights: { trend: 'warming', confidence: 0.87, anomalies: [] },
            processing_time: '2.4s'
          },
          schema: 'AnalyticsResponse'
        },
        planRestrictions: ['enterprise'],
      }
    ],
    plans: [
      {
        id: 'free',
        name: 'Free Plan',
        type: 'free',
        price: 0,
        quota: 1000,
        rateLimit: '10 requests/minute',
        features: ['Current weather only', 'Basic support', '1000 calls/month', 'Community access'],
        isCurrentPlan: false,
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        type: 'pro',
        price: 19.99,
        quota: 10000,
        rateLimit: '100 requests/minute',
        features: ['Current weather', '14-day forecast', 'Historical data', 'Email support', '10,000 calls/month', 'Priority support'],
        isCurrentPlan: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 99.99,
        quota: 100000,
        rateLimit: '1000 requests/minute',
        features: ['All endpoints', 'Priority support', 'Custom integrations', 'SLA guarantee', '100,000 calls/month', 'Dedicated account manager'],
        isCurrentPlan: false,
      }
    ],
    changelog: [
      {
        version: '2.1.0',
        date: '2024-01-20',
        changes: [
          { type: 'added', description: 'New precipitation probability field in forecast data' },
          { type: 'improved', description: 'Enhanced accuracy for European weather stations' },
          { type: 'fixed', description: 'Resolved timezone issues for Australian locations' }
        ]
      },
      {
        version: '2.0.5',
        date: '2024-01-10',
        changes: [
          { type: 'fixed', description: 'Fixed historical data pagination for large date ranges' },
          { type: 'added', description: 'Added wind direction data to current weather endpoint' }
        ]
      },
      {
        version: '2.0.0',
        date: '2023-12-01',
        changes: [
          { type: 'added', description: 'Historical weather data endpoint' },
          { type: 'improved', description: 'Faster response times (avg. 150ms)' },
          { type: 'changed', description: 'Updated response format for better consistency' }
        ]
      }
    ],
    faq: [
      {
        id: '1',
        question: 'What coordinate formats are supported?',
        answer: 'You can use decimal degrees (40.7128,-74.0060) or city names like "New York, NY". For best accuracy, use decimal coordinates.',
        category: 'Usage'
      },
      {
        id: '2',
        question: 'How often is weather data updated?',
        answer: 'Current weather data is updated every 10 minutes. Forecast data is updated every 6 hours with the latest meteorological models.',
        category: 'Data'
      },
      {
        id: '3',
        question: 'Can I cache the API responses?',
        answer: 'Yes, current weather can be cached for up to 10 minutes, and forecast data for up to 6 hours. Check the Cache-Control headers in responses.',
        category: 'Performance'
      },
      {
        id: '4',
        question: 'What happens if I exceed my quota?',
        answer: 'Requests beyond your quota will return a 429 status code. You can upgrade your plan or wait until your quota resets.',
        category: 'Billing'
      }
    ],
    errorCodes: [
      {
        code: 400,
        name: 'Bad Request',
        description: 'Invalid parameters or malformed request',
        solution: 'Check parameter formats and ensure all required fields are provided'
      },
      {
        code: 401,
        name: 'Unauthorized',
        description: 'Missing or invalid API key',
        solution: 'Ensure your API key is included in the Authorization header: Bearer your_api_key'
      },
      {
        code: 403,
        name: 'Forbidden',
        description: 'API key doesn\'t have access to this endpoint',
        solution: 'Upgrade your plan to access this endpoint or check your subscription status'
      },
      {
        code: 429,
        name: 'Too Many Requests',
        description: 'Rate limit exceeded or quota depleted',
        solution: 'Slow down your requests or upgrade to a higher plan for increased limits'
      },
      {
        code: 500,
        name: 'Internal Server Error',
        description: 'Server error, usually temporary',
        solution: 'Retry your request after a short delay. Contact support if the issue persists'
      }
    ],
  },
  '2': {
    id: '2',
    name: 'Crypto Prices API',
    description: 'Real-time cryptocurrency prices, market data, and trading information with comprehensive portfolio tracking and market analysis tools.',
    version: '1.4.7',
    status: 'active',
    provider: 'CryptoData Corp',
    category: 'Finance & Crypto',
    rating: 4.6,
    totalUsers: 15750,
    basePath: '/crypto',
    supportEmail: 'support@cryptodata.com',
    documentation: 'https://docs.cryptodata.com',
    creator: {
      id: 'cryptodata-corp',
      name: 'CryptoData Corp',
      company: 'CryptoData Corporation',
      logo: '/api/placeholder/64/64',
      description: 'Leading cryptocurrency data provider since 2017. Trusted by traders and developers worldwide.',
      website: 'https://cryptodata.com',
      email: 'contact@cryptodata.com',
      verified: true,
      totalProducts: 4,
      averageRating: 4.5,
      joinedDate: '2020-08-15',
    },
    // No subscription by default for demo
    currentSubscription: {
      planId: 'Free',
      planName: 'Free Plan',
      usage: {
        current: 2000,
        quota: 1000,
        resetDate: '2024-02-01T00:00:00Z',
      },
      nextBilling: '2024-02-15T00:00:00Z',
      status: 'active',
    },
    apiKey: undefined,
    endpoints: [
      {
        path: '/prices',
        method: 'GET',
        description: 'Get real-time cryptocurrency prices and market data',
        parameters: [
          { name: 'symbols', type: 'string', required: true, description: 'Comma-separated list of crypto symbols (BTC,ETH,ADA)' },
          { name: 'convert', type: 'string', required: false, description: 'Currency to convert to (USD, EUR, GBP)' },
          { name: 'include_24h_change', type: 'boolean', required: false, description: 'Include 24h price change data' },
        ],
        response: {
          example: {
            data: {
              BTC: { price: 45250.67, change_24h: 2.34, market_cap: 865000000000, volume_24h: 28500000000 },
              ETH: { price: 2890.12, change_24h: -1.25, market_cap: 347000000000, volume_24h: 15200000000 }
            },
            timestamp: '2024-01-30T12:00:00Z'
          },
          schema: 'CryptoPricesResponse'
        },
        planRestrictions: [],
      },
      {
        path: '/historical',
        method: 'GET',
        description: 'Access historical cryptocurrency price data',
        parameters: [
          { name: 'symbol', type: 'string', required: true, description: 'Cryptocurrency symbol (BTC, ETH, etc.)' },
          { name: 'start_date', type: 'string', required: true, description: 'Start date in YYYY-MM-DD format' },
          { name: 'end_date', type: 'string', required: false, description: 'End date in YYYY-MM-DD format' },
          { name: 'interval', type: 'string', required: false, description: 'Data interval: 1h, 1d, 1w' },
        ],
        response: {
          example: {
            symbol: 'BTC',
            data: [
              { date: '2024-01-29', open: 44500, high: 45800, low: 44200, close: 45250, volume: 28500000000 },
              { date: '2024-01-28', open: 44200, high: 44750, low: 43800, close: 44500, volume: 31200000000 }
            ]
          },
          schema: 'HistoricalDataResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/portfolio/track',
        method: 'POST',
        description: 'Track portfolio performance and get analytics',
        parameters: [
          { name: 'holdings', type: 'array', required: true, description: 'Array of holdings with symbol and amount' },
          { name: 'base_currency', type: 'string', required: false, description: 'Base currency for calculations (USD, EUR, etc.)' },
        ],
        response: {
          example: {
            portfolio_value: 125750.50,
            total_change_24h: 3250.75,
            percentage_change_24h: 2.66,
            holdings: [
              { symbol: 'BTC', amount: 2.5, value: 113126.68, change_24h: 2890.12 },
              { symbol: 'ETH', amount: 15, value: 43351.80, change_24h: -542.25 }
            ]
          },
          schema: 'PortfolioResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/alerts',
        method: 'POST',
        description: 'Set up price alerts for cryptocurrencies',
        parameters: [
          { name: 'symbol', type: 'string', required: true, description: 'Cryptocurrency symbol' },
          { name: 'threshold', type: 'number', required: true, description: 'Price threshold' },
          { name: 'condition', type: 'string', required: true, description: 'Alert condition: above, below' },
          { name: 'webhook_url', type: 'string', required: false, description: 'Webhook URL for notifications' },
        ],
        response: {
          example: {
            alert_id: 'alert_123456',
            symbol: 'BTC',
            threshold: 50000,
            condition: 'above',
            status: 'active',
            created_at: '2024-01-30T12:00:00Z'
          },
          schema: 'AlertResponse'
        },
        planRestrictions: ['enterprise'],
      }
    ],
    plans: [
      {
        id: 'free',
        name: 'Free Plan',
        type: 'free',
        price: 0,
        quota: 1000,
        rateLimit: '10 requests/minute',
        features: ['Real-time prices', 'Basic market data', 'Community support', '1,000 calls/month'],
        isCurrentPlan: false,
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        type: 'pro',
        price: 24.99,
        quota: 50000,
        rateLimit: '100 requests/minute',
        features: ['All price data', 'Historical data', 'Portfolio tracking', 'Email support', '50,000 calls/month'],
        isCurrentPlan: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 199.99,
        quota: 1000000,
        rateLimit: '1000 requests/minute',
        features: ['All features', 'Price alerts', 'Custom webhooks', 'Priority support', '1M calls/month'],
        isCurrentPlan: false,
      }
    ],
    changelog: [
      {
        version: '1.4.7',
        date: '2024-01-28',
        changes: [
          { type: 'added', description: 'New portfolio tracking endpoint with advanced analytics' },
          { type: 'improved', description: 'Enhanced price data accuracy and reduced latency' },
          { type: 'fixed', description: 'Resolved duplicate data issues in historical endpoint' }
        ]
      },
      {
        version: '1.4.5',
        date: '2024-01-15',
        changes: [
          { type: 'added', description: 'Support for 50+ new cryptocurrency pairs' },
          { type: 'fixed', description: 'Fixed rate limiting issues during high traffic periods' }
        ]
      }
    ],
    faq: [
      {
        id: '1',
        question: 'How often is price data updated?',
        answer: 'Price data is updated in real-time with sub-second latency. Historical data is updated every hour.',
        category: 'Data Freshness'
      },
      {
        id: '2',
        question: 'Which cryptocurrencies are supported?',
        answer: 'We support over 2000 cryptocurrencies including Bitcoin, Ethereum, and all major altcoins and DeFi tokens.',
        category: 'Coverage'
      },
      {
        id: '3',
        question: 'Can I track multiple portfolios?',
        answer: 'Yes, Pro and Enterprise plans support multiple portfolio tracking with detailed analytics and performance metrics.',
        category: 'Features'
      }
    ],
    errorCodes: [
      {
        code: 400,
        name: 'Bad Request',
        description: 'Invalid cryptocurrency symbol or malformed parameters',
        solution: 'Check that all cryptocurrency symbols are valid and parameters are correctly formatted'
      },
      {
        code: 404,
        name: 'Symbol Not Found',
        description: 'The requested cryptocurrency symbol is not supported',
        solution: 'Verify the symbol exists in our supported cryptocurrencies list'
      },
      {
        code: 429,
        name: 'Too Many Requests',
        description: 'Rate limit exceeded for your plan',
        solution: 'Slow down requests or upgrade to a plan with higher rate limits'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'News Aggregator API',
    description: 'Curated news articles from thousands of sources with sentiment analysis and categorization. Perfect for news apps, content platforms, and media monitoring services.',
    version: '1.8.3',
    status: 'active',
    provider: 'NewsFlow Corp',
    category: 'News & Media',
    rating: 4.6,
    totalUsers: 5420,
    basePath: '/news',
    supportEmail: 'support@newsflow.com',
    documentation: 'https://docs.newsflow.com',
    creator: {
      id: 'newsflow-corp',
      name: 'NewsFlow Corp',
      company: 'NewsFlow Corporation',
      logo: '/api/placeholder/64/64',
      description: 'Leading news aggregation and analysis platform since 2019. Trusted by media companies worldwide.',
      website: 'https://newsflow.com',
      email: 'contact@newsflow.com',
      verified: true,
      totalProducts: 3,
      averageRating: 4.5,
      joinedDate: '2021-03-10',
    },
    currentSubscription: {
      planId: 'pro',
      planName: 'Pro Plan',
      usage: {
        current: 450,
        quota: 25000,
        resetDate: '2024-02-01T00:00:00Z',
      },
      nextBilling: '2024-02-10T00:00:00Z',
      status: 'active',
    },
    apiKey: 'nw_live_7k9m3n8p2q5r1s4t6v8x0y3z5a7b9c2d',
    endpoints: [
      {
        path: '/articles',
        method: 'GET',
        description: 'Get latest news articles from multiple sources',
        parameters: [
          { name: 'query', type: 'string', required: false, description: 'Search query for articles' },
          { name: 'category', type: 'string', required: false, description: 'News category: business, tech, sports, etc.' },
          { name: 'country', type: 'string', required: false, description: 'Country code for regional news (US, UK, etc.)' },
        ],
        response: {
          example: {
            articles: [
              {
                title: 'Tech Industry Updates',
                description: 'Latest developments in technology sector',
                url: 'https://example.com/article/1',
                publishedAt: '2024-01-30T10:00:00Z',
                source: 'TechNews',
                sentiment: 'positive'
              }
            ],
            totalResults: 150
          },
          schema: 'ArticlesResponse'
        },
        planRestrictions: [],
      },
      {
        path: '/sentiment',
        method: 'POST',
        description: 'Analyze sentiment of news articles or text content',
        parameters: [
          { name: 'text', type: 'string', required: true, description: 'Text content to analyze' },
          { name: 'language', type: 'string', required: false, description: 'Language code (en, es, fr, etc.)' },
        ],
        response: {
          example: {
            sentiment: 'positive',
            confidence: 0.89,
            scores: {
              positive: 0.89,
              neutral: 0.08,
              negative: 0.03
            }
          },
          schema: 'SentimentResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/trending',
        method: 'GET',
        description: 'Get trending topics and hashtags in news',
        parameters: [
          { name: 'timeframe', type: 'string', required: false, description: 'Time range: 1h, 6h, 24h, 7d' },
          { name: 'region', type: 'string', required: false, description: 'Geographic region for trends' },
        ],
        response: {
          example: {
            trends: [
              { topic: 'AI Technology', mentions: 1250, growth: '+15%' },
              { topic: 'Climate Change', mentions: 980, growth: '+8%' }
            ]
          },
          schema: 'TrendsResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      }
    ],
    plans: [
      {
        id: 'free',
        name: 'Free Plan',
        type: 'free',
        price: 0,
        quota: 100,
        rateLimit: '10 requests/minute',
        features: ['Basic article search', 'Community support', '100 articles/month'],
        isCurrentPlan: false,
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        type: 'pro',
        price: 29.99,
        quota: 25000,
        rateLimit: '100 requests/minute',
        features: ['Full article access', 'Sentiment analysis', 'Trending topics', 'Email support', '25,000 articles/month'],
        isCurrentPlan: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 149.99,
        quota: 200000,
        rateLimit: '1000 requests/minute',
        features: ['All features', 'Custom sources', 'Priority support', 'Dedicated manager', '200,000 articles/month'],
        isCurrentPlan: false,
      }
    ],
    changelog: [
      {
        version: '1.8.3',
        date: '2024-01-25',
        changes: [
          { type: 'added', description: 'New trending topics endpoint' },
          { type: 'improved', description: 'Enhanced sentiment analysis accuracy' },
          { type: 'fixed', description: 'Resolved duplicate article filtering' }
        ]
      }
    ],
    faq: [
      {
        id: '1',
        question: 'How fresh is the news data?',
        answer: 'Articles are updated in real-time from thousands of sources. Most articles appear within minutes of publication.',
        category: 'Data Freshness'
      },
      {
        id: '2',
        question: 'Can I filter by specific news sources?',
        answer: 'Yes, Pro and Enterprise plans allow filtering by specific publications and source types.',
        category: 'Filtering'
      }
    ],
    errorCodes: [
      {
        code: 400,
        name: 'Bad Request',
        description: 'Invalid search parameters or malformed query',
        solution: 'Check your query parameters and ensure they match the API specification'
      },
      {
        code: 429,
        name: 'Too Many Requests',
        description: 'Rate limit exceeded',
        solution: 'Slow down requests or upgrade to a higher plan for increased limits'
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Image Processing API',
    description: 'Advanced image processing, optimization, and AI-powered analysis for modern applications. Transform, resize, optimize, and analyze images with cutting-edge technology.',
    version: '2.5.1',
    status: 'active',
    provider: 'PixelAI Labs',
    category: 'AI & Machine Learning',
    rating: 4.7,
    totalUsers: 3280,
    basePath: '/images',
    supportEmail: 'support@pixelai.com',
    documentation: 'https://docs.pixelai.com',
    creator: {
      id: 'pixelai-labs',
      name: 'PixelAI Labs',
      company: 'PixelAI Labs Inc.',
      logo: '/api/placeholder/64/64',
      description: 'Cutting-edge AI image processing technology since 2020. Powering apps for millions of users.',
      website: 'https://pixelai.com',
      email: 'contact@pixelai.com',
      verified: true,
      totalProducts: 6,
      averageRating: 4.6,
      joinedDate: '2022-01-15',
    },
    // No current subscription - unsubscribed user by default
    currentSubscription: undefined,
    apiKey: undefined,
    endpoints: [
      {
        path: '/resize',
        method: 'POST',
        description: 'Resize images while maintaining quality and aspect ratio',
        parameters: [
          { name: 'image', type: 'file', required: true, description: 'Image file to resize' },
          { name: 'width', type: 'number', required: true, description: 'Target width in pixels' },
          { name: 'height', type: 'number', required: false, description: 'Target height in pixels' },
          { name: 'quality', type: 'number', required: false, description: 'Quality (1-100, default: 85)' },
        ],
        response: {
          example: {
            url: 'https://cdn.pixelai.com/processed/abc123.jpg',
            width: 800,
            height: 600,
            format: 'jpeg',
            size: 45600
          },
          schema: 'ProcessedImageResponse'
        },
        planRestrictions: [],
      },
      {
        path: '/analyze',
        method: 'POST',
        description: 'AI-powered image analysis and object detection',
        parameters: [
          { name: 'image', type: 'file', required: true, description: 'Image file to analyze' },
          { name: 'features', type: 'array', required: false, description: 'Analysis features: objects, faces, text, colors' },
        ],
        response: {
          example: {
            objects: [
              { name: 'person', confidence: 0.95, bbox: [100, 200, 300, 500] },
              { name: 'car', confidence: 0.87, bbox: [400, 300, 700, 600] }
            ],
            dominant_colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            text_detected: 'STOP SIGN'
          },
          schema: 'AnalysisResponse'
        },
        planRestrictions: ['pro', 'enterprise'],
      },
      {
        path: '/enhance',
        method: 'POST',
        description: 'AI-powered image enhancement and upscaling',
        parameters: [
          { name: 'image', type: 'file', required: true, description: 'Image file to enhance' },
          { name: 'scale', type: 'number', required: false, description: 'Upscaling factor (2x, 4x)' },
          { name: 'enhance_type', type: 'string', required: false, description: 'Enhancement type: auto, portrait, landscape' },
        ],
        response: {
          example: {
            url: 'https://cdn.pixelai.com/enhanced/xyz789.jpg',
            original_size: [400, 300],
            enhanced_size: [1600, 1200],
            processing_time: '2.1s'
          },
          schema: 'EnhancedImageResponse'
        },
        planRestrictions: ['enterprise'],
      }
    ],
    plans: [
      {
        id: 'free',
        name: 'Free Plan',
        type: 'free',
        price: 0,
        quota: 50,
        rateLimit: '5 requests/minute',
        features: ['Basic resize', 'Community support', '50 images/month', 'Standard quality'],
        isCurrentPlan: false,
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        type: 'pro',
        price: 39.99,
        quota: 5000,
        rateLimit: '50 requests/minute',
        features: ['All resize options', 'AI analysis', 'Email support', '5,000 images/month', 'High quality'],
        isCurrentPlan: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 199.99,
        quota: 100000,
        rateLimit: '500 requests/minute',
        features: ['All features', 'AI enhancement', 'Priority support', 'Custom integrations', '100,000 images/month'],
        isCurrentPlan: false,
      }
    ],
    changelog: [
      {
        version: '2.5.1',
        date: '2024-01-28',
        changes: [
          { type: 'added', description: 'New AI enhancement endpoint for upscaling' },
          { type: 'improved', description: 'Faster processing times for large images' },
          { type: 'fixed', description: 'Memory optimization for batch processing' }
        ]
      }
    ],
    faq: [
      {
        id: '1',
        question: 'What image formats are supported?',
        answer: 'We support JPEG, PNG, WebP, and TIFF formats for input. Output can be JPEG, PNG, or WebP.',
        category: 'Formats'
      },
      {
        id: '2',
        question: 'What is the maximum file size?',
        answer: 'Free plan: 5MB, Pro plan: 20MB, Enterprise: 100MB per image.',
        category: 'Limits'
      }
    ],
    errorCodes: [
      {
        code: 413,
        name: 'Payload Too Large',
        description: 'Image file exceeds size limits for your plan',
        solution: 'Reduce image size or upgrade to a plan with higher limits'
      },
      {
        code: 422,
        name: 'Unprocessable Entity',
        description: 'Invalid image format or corrupted file',
        solution: 'Ensure image is in a supported format (JPEG, PNG, WebP, TIFF)'
      }
    ]
  }
};

export default function ApiDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  if (!user) return null;

  const apiId = params.id as string;

  // Get source from URL params to determine view context
  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get('source'); // 'marketplace' or 'subscriptions'

  // Enhanced subscription detection - simulate real user subscription status
  // In real implementation, this would check user's actual subscriptions
  const isSubscribedToApi = (apiId: string) => {
    // For demo: users coming from subscriptions are subscribed, marketplace users are not
    if (source === 'subscriptions') return true;
    if (source === 'marketplace') return false;

    // Default logic based on API ID for direct access - simulate some subscriptions
    return ['1', '2', '3'].includes(apiId); // Weather API and News API have subscriptions by default
  };

  const isSubscribed = isSubscribedToApi(apiId);

  // Get API details with better error handling - ensure we get the right API
  const apiDetails = mockApiDetails[apiId];

  // Debug logging to help identify the issue
  console.log('API Details Debug:', { apiId, source, isSubscribed, hasApiDetails: !!apiDetails, apiName: apiDetails?.name });

  if (!apiDetails) {
    // If API doesn't exist, show error message instead of falling back
    return (
      <RoleGuard allowedRoles={['consumer']}>
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
                The API you're looking for (ID: {apiId}) doesn't exist or has been removed.
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
  const currentPlan = finalApiDetails.plans.find(plan => plan.isCurrentPlan);
  const usagePercentage = finalApiDetails.currentSubscription
    ? (finalApiDetails.currentSubscription.usage.current / finalApiDetails.currentSubscription.usage.quota) * 100
    : 0;
  const isNearLimit = usagePercentage > 80;

  const handleUpgrade = (planId: string) => {
    toast.success('Redirecting to upgrade...');
    router.push(`/billing?upgrade=${planId}`);
  };

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(`https://api.proxyapi.com${finalApiDetails.basePath}${endpoint}`);
    toast.success('Endpoint URL copied to clipboard!');
  };

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(`https://api.proxyapi.com${finalApiDetails.basePath}`);
    toast.success('Base URL copied to clipboard!');
  };

  const handleCopyApiKey = () => {
    if (finalApiDetails.apiKey) {
      navigator.clipboard.writeText(finalApiDetails.apiKey);
      toast.success('API key copied to clipboard!');
    }
  };

  const handleSubscribe = (planId: string) => {
    toast.success('Redirecting to subscription...');
    router.push(`/billing?subscribe=${planId}&api=${finalApiDetails.id}`);
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
      return { name: 'Free', type: 'free' };
    }

    // Check plan hierarchy - return the lowest tier that has access
    const planHierarchy = ['free', 'pro', 'enterprise'];

    // Find the lowest tier plan that has access from the restrictions
    for (const tier of planHierarchy) {
      if (planRestrictions.includes(tier)) {
        switch (tier) {
          case 'free':
            return { name: 'Free', type: 'free' };
          case 'pro':
            return { name: 'Pro', type: 'pro' };
          case 'enterprise':
            return { name: 'Enterprise', type: 'enterprise' };
          default:
            return { name: 'Pro', type: 'pro' };
        }
      }
    }

    // If restrictions exist but don't match our hierarchy, default to Pro
    return { name: 'Pro', type: 'pro' };
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

  return (
    <RoleGuard allowedRoles={['consumer']}>
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
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {finalApiDetails.name}
                  </h1>
                  <Badge variant="outline" className={getStatusColor(apiDetails.status)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {apiDetails.status}
                  </Badge>
                  <Badge variant="outline" className="text-yellow-400">
                    v{apiDetails.version}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                    {apiDetails.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 max-w-3xl">
                  {apiDetails.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{apiDetails.totalUsers.toLocaleString()} users</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{apiDetails.rating}/5</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>by {apiDetails.provider}</span>
                  </span>
                </div>
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
                    <span className="text-muted-foreground">Rating</span>
                    <div className="text-foreground font-medium flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      {apiDetails.creator.averageRating}
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
                      https://api.proxyapi.com{apiDetails.basePath}
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
                    {apiDetails.currentSubscription!.planName}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  Monthly usage and quota information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-foreground">
                      {apiDetails.currentSubscription!.usage.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">API Calls Used</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-foreground">
                      {((apiDetails.currentSubscription!.usage.quota - apiDetails.currentSubscription!.usage.current)).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Calls Remaining</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-foreground">
                      {Math.ceil((new Date(apiDetails.currentSubscription!.usage.resetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Until Reset</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Usage</span>
                    <span className="text-foreground">
                      {usagePercentage.toFixed(1)}% of {apiDetails.currentSubscription!.usage.quota.toLocaleString()} calls
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
                      {new Date(apiDetails.currentSubscription!.nextBilling).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Rate Limit</span>
                    <span className="text-foreground font-medium">
                      {currentPlan?.rateLimit || 'N/A'}
                    </span>
                  </div>
                </div>
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="endpoints">Documentation</TabsTrigger>
              <TabsTrigger value="playground" disabled={!isSubscribed}>
                Try It Out {!isSubscribed && '🔒'}
              </TabsTrigger>
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardHeader>
                    <CardTitle className="text-foreground">API Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <Badge variant="outline">{apiDetails.version}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline">{apiDetails.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className={getStatusColor(apiDetails.status)}>
                          {apiDetails.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Users</span>
                        <span className="text-foreground font-medium">{apiDetails.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support</span>
                        <a href={`mailto:${apiDetails.supportEmail}`} className="text-primary hover:underline">
                          {apiDetails.supportEmail}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {currentPlan && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardHeader>
                      <CardTitle className="text-foreground">Your Plan Features</CardTitle>
                      <CardDescription>
                        {currentPlan.name} - {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/month`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Documentation/Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-6">
              {!isSubscribed && (
                /* Call-to-Action for Subscription - Updated Message */
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary">
                        <Zap className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Subscribe to Get Your API Key and Start Using</h3>
                        <p className="text-muted-foreground">
                          Browse the complete documentation below, then subscribe to any plan to get your API key and unlock the interactive testing playground.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => setActiveTab('plans')} variant="outline">
                          View All Plans
                        </Button>
                        <Button onClick={() => handleSubscribe('pro')}>
                          Subscribe to Pro Plan - ${apiDetails.plans.find(p => p.id === 'pro')?.price}/month
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Codes Section */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Error Codes</CardTitle>
                  <CardDescription>
                    Common HTTP status codes and their meanings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiDetails.errorCodes.map((error, index) => (
                      <div key={index} className="border border-border/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className={
                            error.code >= 500 ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                              error.code >= 400 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                'bg-green-500/10 text-green-400 border-green-500/30'
                          }>
                            {error.code}
                          </Badge>
                          <span className="font-medium text-foreground">{error.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{error.description}</p>
                        <div className="text-sm text-foreground bg-muted/50 p-2 rounded">
                          <strong>Solution:</strong> {error.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints - Full Documentation for All Users */}
              <div className="grid gap-4">
                {apiDetails.endpoints.map((endpoint, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm text-foreground bg-muted/50 px-2 py-1 rounded">
                            {apiDetails.basePath}{endpoint.path}
                          </code>
                          {/* Required Plan Badge - prominently displayed next to route */}
                          <Badge variant="outline" className={`${getPlanColor(getRequiredPlan(endpoint.planRestrictions).type)} font-medium`}>
                            {getRequiredPlan(endpoint.planRestrictions).name} Plan
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyEndpoint(endpoint.path)}
                            disabled={!isSubscribed}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {/* User Access Status - shows if current user has access */}
                        {endpoint.planRestrictions.length > 0 && isSubscribed && (
                          <Badge variant="outline" className={
                            endpoint.planRestrictions.includes(currentPlan?.type || 'free')
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          }>
                            {endpoint.planRestrictions.includes(currentPlan?.type || 'free') ? 'Available' : 'Requires Upgrade'}
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>

                    {/* Full Documentation - Available to All Users */}
                    <CardContent className="space-y-4">
                      {/* Parameters */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="flex items-center justify-between p-2 rounded bg-muted/20">
                              <div className="flex items-center space-x-3">
                                <code className="text-sm text-foreground">{param.name}</code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
                                    required
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Response Example */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Response Example</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <pre className="text-sm text-foreground overflow-x-auto">
                            <code>{JSON.stringify(endpoint.response.example, null, 2)}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Plan Requirement Details */}
                      <div className="border-t border-border/50 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Access Requirements</h4>
                            <p className="text-xs text-muted-foreground">
                              This endpoint requires {getRequiredPlan(endpoint.planRestrictions).name} plan or higher
                            </p>
                          </div>
                          <Badge variant="outline" className={`${getPlanColor(getRequiredPlan(endpoint.planRestrictions).type)} font-medium`}>
                            {getRequiredPlan(endpoint.planRestrictions).name} Plan Required
                          </Badge>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Playground Tab */}
            <TabsContent value="playground" className="space-y-6">
              {isSubscribed ? (
                <ApiPlayground apiDetails={finalApiDetails} currentPlan={currentPlan} />
              ) : (
                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-6 py-12">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary">
                        <Play className="h-12 w-12" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">API Playground Available After Subscription</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Test endpoints, configure parameters, and see live responses with our interactive playground.
                        </p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto text-sm">
                        <div className="p-4 rounded-lg bg-muted/20">
                          <div className="text-2xl mb-2">🎯</div>
                          <div className="font-medium text-foreground">Live Testing</div>
                          <div className="text-muted-foreground">Test real endpoints</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/20">
                          <div className="text-2xl mb-2">⚙️</div>
                          <div className="font-medium text-foreground">Parameter Config</div>
                          <div className="text-muted-foreground">Interactive forms</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/20">
                          <div className="text-2xl mb-2">📋</div>
                          <div className="font-medium text-foreground">cURL Generation</div>
                          <div className="text-muted-foreground">Copy commands</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => handleSubscribe('free')} variant="outline" size="lg">
                          Start with Free Plan
                        </Button>
                        <Button onClick={() => handleSubscribe('pro')} size="lg">
                          <Zap className="h-4 w-4 mr-2" />
                          Subscribe to Pro Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Plans & Pricing Tab */}
            <TabsContent value="plans" className="space-y-6">
              {!isSubscribed && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary">
                        <Zap className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Choose Your Plan</h3>
                        <p className="text-muted-foreground">
                          Select a subscription plan to unlock API access, documentation, and testing capabilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-3">
                {apiDetails.plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`backdrop-blur-sm border-border/20 ${plan.isCurrentPlan
                      ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                      : 'bg-card/50'
                      }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">{plan.name}</CardTitle>
                        {plan.isCurrentPlan && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-400">
                            Current Plan
                          </Badge>
                        )}
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                        {plan.price > 0 && <span className="text-lg text-muted-foreground">/month</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Quota</span>
                          <span className="text-foreground">{plan.quota.toLocaleString()} calls</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rate Limit</span>
                          <span className="text-foreground">{plan.rateLimit}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        variant={plan.isCurrentPlan ? "outline" : "default"}
                        disabled={plan.isCurrentPlan}
                        onClick={() => {
                          if (isSubscribed) {
                            handleUpgrade(plan.id);
                          } else {
                            handleSubscribe(plan.id);
                          }
                        }}
                      >
                        {plan.isCurrentPlan ? 'Current Plan' : (isSubscribed ? 'Upgrade to This Plan' : 'Subscribe to This Plan')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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