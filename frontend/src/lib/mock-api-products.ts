import type { ApiProduct } from '@/types/api';

// Mock data for all API products
export const mockApiProducts: Record<string, ApiProduct> = {
  // Weather API (ID: 1)
  '1': {
    id: '1',
    name: 'Weather API',
    description: 'Real-time weather data and forecasts for any location worldwide with historical data access',
    basePath: '/weather',
    backendUrl: 'https://api.weather.com',
    logo: '',
    isPublic: true,
    status: 'active',
    version: '1.2.1',
    category: 'Weather & Environment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
    totalSubscribers: 1247,
    totalRevenue: 12400,
    totalCalls: 145023,
    successRate: 99.8,
    createdBy: 'creator-1',
    plans: ['free', 'pro', 'enterprise'],
    endpoints: [
      {
        id: '1',
        path: '/current',
        method: 'GET' as const,
        title: 'Current Weather',
        description: 'Get current weather',
        parameters: [],
        pathParameters: [],
        responseSchema: '{}',
        requiredPlan: 'free',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: [],
        rateLimit: { enabled: true, value: 100, period: 'minute' },
        quota: { enabled: true, value: 1000, period: 'month' },
        backendUrl: 'https://api.weather.com/v1/current',
        responseTime: 120,
        errorRate: 0.5,
        callsToday: 1240,
      },
      {
        id: '2',
        path: '/forecast',
        method: 'GET' as const,
        title: '7-Day Forecast',
        description: 'Get weather forecast',
        parameters: [],
        pathParameters: [],
        responseSchema: '{}',
        requiredPlan: 'pro',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['pro', 'enterprise'],
        rateLimit: { enabled: true, value: 50, period: 'minute' },
        quota: { enabled: true, value: 500, period: 'month' },
        backendUrl: 'https://api.weather.com/v1/forecast',
        responseTime: 180,
        errorRate: 0.8,
        callsToday: 650,
      },
    ],
  },
  
  // Crypto Prices API (ID: 2)
  '2': {
    id: '2',
    name: 'Crypto Prices API',
    description: 'Real-time cryptocurrency prices, market data, and trading information',
    basePath: '/crypto',
    backendUrl: 'https://api.crypto.com',
    logo: '',
    isPublic: true,
    status: 'active',
    version: '2.1.0',
    category: 'Finance & Crypto',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    totalSubscribers: 892,
    totalRevenue: 18650,
    totalCalls: 89456,
    successRate: 99.5,
    createdBy: 'creator-1',
    plans: ['free', 'pro', 'enterprise'],
    endpoints: [
      {
        id: '3',
        path: '/prices',
        method: 'GET' as const,
        title: 'Get Crypto Prices',
        description: 'Get real-time cryptocurrency prices for major coins',
        parameters: [
          {
            id: '1',
            name: 'symbols',
            type: 'string',
            required: true,
            description: 'Comma-separated cryptocurrency symbols (e.g., BTC,ETH,SOL)',
            example: 'BTC,ETH'
          },
          {
            id: '2',
            name: 'currency',
            type: 'enum',
            required: false,
            description: 'Fiat currency for pricing (USD, EUR, GBP)',
            example: 'USD'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"data\": [\\n    {\\n      \"symbol\": \"BTC\",\\n      \"price\": 45000.50,\\n      \"change_24h\": 2.5,\\n      \"volume_24h\": 28000000000\\n    }\\n  ]\\n}',
        requiredPlan: 'free',
        exampleRequests: [
          {
            id: '1',
            language: 'curl',
            code: 'curl -X GET \"https://api.proxyapi.dev/crypto/prices?symbols=BTC,ETH\" \\\\\\n  -H \"Authorization: Bearer YOUR_API_KEY\"'
          }
        ],
        exampleResponses: [
          {
            id: '1',
            language: 'json',
            code: '{\\n  \"data\": [\\n    {\\n      \"symbol\": \"BTC\",\\n      \"price\": 45000.50,\\n      \"change_24h\": 2.5\\n    }\\n  ]\\n}'
          }
        ],
        isActive: true,
        planRestrictions: [],
        rateLimit: { enabled: true, value: 60, period: 'minute' },
        quota: { enabled: true, value: 5000, period: 'month' },
        backendUrl: 'https://api.crypto.com/v1/prices',
        responseTime: 95,
        errorRate: 0.3,
        callsToday: 2145,
      },
      {
        id: '4',
        path: '/market-data/{symbol}',
        method: 'GET' as const,
        title: 'Market Data',
        description: 'Get detailed market data for a specific cryptocurrency',
        parameters: [],
        pathParameters: [],
        responseSchema: '{\\n  \"symbol\": \"BTC\",\\n  \"price\": 45000.50,\\n  \"market_cap\": 880000000000,\\n  \"volume_24h\": 28000000000,\\n  \"high_24h\": 46000,\\n  \"low_24h\": 44000\\n}',
        requiredPlan: 'pro',
        exampleRequests: [
          {
            id: '1',
            language: 'curl',
            code: 'curl -X GET \"https://api.proxyapi.dev/crypto/market-data/BTC\" \\\\\\n  -H \"Authorization: Bearer YOUR_API_KEY\"'
          }
        ],
        exampleResponses: [
          {
            id: '1',
            language: 'json',
            code: '{\\n  \"symbol\": \"BTC\",\\n  \"price\": 45000.50,\\n  \"market_cap\": 880000000000\\n}'
          }
        ],
        isActive: true,
        planRestrictions: ['pro', 'enterprise'],
        rateLimit: { enabled: true, value: 30, period: 'minute' },
        quota: { enabled: true, value: 2000, period: 'month' },
        backendUrl: 'https://api.crypto.com/v1/market',
        responseTime: 110,
        errorRate: 0.4,
        callsToday: 876,
      },
      {
        id: '5',
        path: '/historical',
        method: 'GET' as const,
        title: 'Historical Prices',
        description: 'Access historical cryptocurrency price data for analysis',
        parameters: [
          {
            id: '1',
            name: 'symbol',
            type: 'string',
            required: true,
            description: 'Cryptocurrency symbol',
            example: 'BTC'
          },
          {
            id: '2',
            name: 'start',
            type: 'date',
            required: true,
            description: 'Start date (YYYY-MM-DD)',
            example: '2024-01-01'
          },
          {
            id: '3',
            name: 'end',
            type: 'date',
            required: true,
            description: 'End date (YYYY-MM-DD)',
            example: '2024-01-31'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"symbol\": \"BTC\",\\n  \"data\": [\\n    {\\n      \"date\": \"2024-01-01\",\\n      \"open\": 42000,\\n      \"close\": 43000,\\n      \"high\": 43500,\\n      \"low\": 41800\\n    }\\n  ]\\n}',
        requiredPlan: 'enterprise',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['enterprise'],
        rateLimit: { enabled: true, value: 10, period: 'minute' },
        quota: { enabled: true, value: 500, period: 'month' },
        backendUrl: 'https://api.crypto.com/v1/historical',
        responseTime: 250,
        errorRate: 0.6,
        callsToday: 123,
      },
    ],
  },

  // Maps & Geocoding API (ID: 3)
  '3': {
    id: '3',
    name: 'Maps & Geocoding API',
    description: 'Location services including geocoding, reverse geocoding, and mapping data',
    basePath: '/maps',
    backendUrl: 'https://api.maps.com',
    logo: '',
    isPublic: false,
    status: 'maintenance',
    version: '1.5.2',
    category: 'Maps & Location',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    totalSubscribers: 234,
    totalRevenue: 8900,
    totalCalls: 23156,
    successRate: 97.2,
    createdBy: 'creator-1',
    plans: ['pro', 'enterprise'],
    endpoints: [
      {
        id: '6',
        path: '/geocode',
        method: 'GET' as const,
        title: 'Geocode Address',
        description: 'Convert addresses into geographic coordinates',
        parameters: [
          {
            id: '1',
            name: 'address',
            type: 'string',
            required: true,
            description: 'Street address to geocode',
            example: '1600 Amphitheatre Parkway, Mountain View, CA'
          },
          {
            id: '2',
            name: 'format',
            type: 'enum',
            required: false,
            description: 'Response format (json, xml)',
            example: 'json'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"address\": \"1600 Amphitheatre Parkway\",\\n  \"latitude\": 37.4224764,\\n  \"longitude\": -122.0842499,\\n  \"formatted_address\": \"1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA\"\\n}',
        requiredPlan: 'pro',
        exampleRequests: [
          {
            id: '1',
            language: 'curl',
            code: 'curl -X GET \"https://api.proxyapi.dev/maps/geocode?address=1600+Amphitheatre+Parkway\" \\\\\\n  -H \"Authorization: Bearer YOUR_API_KEY\"'
          }
        ],
        exampleResponses: [
          {
            id: '1',
            language: 'json',
            code: '{\\n  \"latitude\": 37.4224764,\\n  \"longitude\": -122.0842499\\n}'
          }
        ],
        isActive: false,
        planRestrictions: ['pro', 'enterprise'],
        rateLimit: { enabled: true, value: 50, period: 'minute' },
        quota: { enabled: true, value: 3000, period: 'month' },
        backendUrl: 'https://api.maps.com/v1/geocode',
        responseTime: 145,
        errorRate: 2.1,
        callsToday: 0,
      },
      {
        id: '7',
        path: '/reverse-geocode',
        method: 'GET' as const,
        title: 'Reverse Geocode',
        description: 'Convert coordinates into addresses',
        parameters: [
          {
            id: '1',
            name: 'lat',
            type: 'number',
            required: true,
            description: 'Latitude',
            example: '37.4224764'
          },
          {
            id: '2',
            name: 'lng',
            type: 'number',
            required: true,
            description: 'Longitude',
            example: '-122.0842499'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"latitude\": 37.4224764,\\n  \"longitude\": -122.0842499,\\n  \"address\": \"1600 Amphitheatre Pkwy\",\\n  \"city\": \"Mountain View\",\\n  \"state\": \"CA\",\\n  \"country\": \"USA\"\\n}',
        requiredPlan: 'pro',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['pro', 'enterprise'],
        rateLimit: { enabled: true, value: 50, period: 'minute' },
        quota: { enabled: true, value: 3000, period: 'month' },
        backendUrl: 'https://api.maps.com/v1/reverse',
        responseTime: 135,
        errorRate: 1.8,
        callsToday: 456,
      },
      {
        id: '8',
        path: '/directions',
        method: 'POST' as const,
        title: 'Get Directions',
        description: 'Calculate routes and directions between locations',
        parameters: [
          {
            id: '1',
            name: 'origin',
            type: 'string',
            required: true,
            description: 'Starting location',
            example: 'New York, NY'
          },
          {
            id: '2',
            name: 'destination',
            type: 'string',
            required: true,
            description: 'Destination location',
            example: 'Boston, MA'
          },
          {
            id: '3',
            name: 'mode',
            type: 'enum',
            required: false,
            description: 'Travel mode (driving, walking, bicycling, transit)',
            example: 'driving'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"distance\": \"215 miles\",\\n  \"duration\": \"3 hours 45 minutes\",\\n  \"steps\": []\\n}',
        requiredPlan: 'enterprise',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['enterprise'],
        rateLimit: { enabled: true, value: 20, period: 'minute' },
        quota: { enabled: true, value: 1000, period: 'month' },
        backendUrl: 'https://api.maps.com/v1/directions',
        responseTime: 280,
        errorRate: 3.2,
        callsToday: 78,
      },
    ],
  },

  // AI & ML API (ID: 4)
  '4': {
    id: '4',
    name: 'Advanced Machine Learning & AI Analytics Platform API with Extended Enterprise Features',
    description: 'Comprehensive artificial intelligence and machine learning platform providing advanced analytics, predictive modeling, natural language processing, computer vision capabilities, and enterprise-grade features for large-scale data processing and analysis workflows.',
    basePath: '/ai-ml',
    backendUrl: 'https://api.aiplatform.com',
    logo: '',
    isPublic: true,
    status: 'active',
    version: '3.0.1',
    category: 'AI & Machine Learning',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
    totalSubscribers: 2156,
    totalRevenue: 45890,
    totalCalls: 312789,
    successRate: 98.9,
    createdBy: 'creator-1',
    plans: ['starter', 'professional', 'enterprise', 'custom'],
    endpoints: [
      {
        id: '9',
        path: '/predict',
        method: 'POST' as const,
        title: 'Make Predictions',
        description: 'Make predictions using trained AI models',
        parameters: [
          {
            id: '1',
            name: 'model_id',
            type: 'string',
            required: true,
            description: 'ID of the trained model to use',
            example: 'model_abc123'
          },
          {
            id: '2',
            name: 'input_data',
            type: 'object',
            required: true,
            description: 'Input data for prediction',
            example: '{}'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"prediction\": 0.89,\\n  \"confidence\": 0.95,\\n  \"model_id\": \"model_abc123\"\\n}',
        requiredPlan: 'starter',
        exampleRequests: [
          {
            id: '1',
            language: 'curl',
            code: 'curl -X POST \"https://api.proxyapi.dev/ai-ml/predict\" \\\\\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\\\\n  -H \"Content-Type: application/json\" \\\\\\n  -d \"{\\\"model_id\\\": \\\"model_abc123\\\", \\\"input_data\\\": {}}\"'
          }
        ],
        exampleResponses: [
          {
            id: '1',
            language: 'json',
            code: '{\\n  \"prediction\": 0.89,\\n  \"confidence\": 0.95\\n}'
          }
        ],
        isActive: true,
        planRestrictions: [],
        rateLimit: { enabled: true, value: 100, period: 'minute' },
        quota: { enabled: true, value: 10000, period: 'month' },
        backendUrl: 'https://api.aiplatform.com/v1/predict',
        responseTime: 450,
        errorRate: 0.9,
        callsToday: 5432,
      },
      {
        id: '10',
        path: '/analyze',
        method: 'POST' as const,
        title: 'Analyze Data',
        description: 'Perform advanced data analysis using ML algorithms',
        parameters: [
          {
            id: '1',
            name: 'data',
            type: 'array',
            required: true,
            description: 'Data to analyze',
            example: '[]'
          },
          {
            id: '2',
            name: 'analysis_type',
            type: 'enum',
            required: true,
            description: 'Type of analysis (clustering, classification, regression)',
            example: 'clustering'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"analysis_id\": \"analysis_xyz789\",\\n  \"results\": {},\\n  \"insights\": []\\n}',
        requiredPlan: 'professional',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['professional', 'enterprise', 'custom'],
        rateLimit: { enabled: true, value: 50, period: 'minute' },
        quota: { enabled: true, value: 2000, period: 'month' },
        backendUrl: 'https://api.aiplatform.com/v1/analyze',
        responseTime: 890,
        errorRate: 1.2,
        callsToday: 1876,
      },
      {
        id: '11',
        path: '/nlp/sentiment',
        method: 'POST' as const,
        title: 'Sentiment Analysis',
        description: 'Analyze sentiment of text using natural language processing',
        parameters: [
          {
            id: '1',
            name: 'text',
            type: 'string',
            required: true,
            description: 'Text to analyze',
            example: 'This product is amazing!'
          },
          {
            id: '2',
            name: 'language',
            type: 'string',
            required: false,
            description: 'Language code (en, es, fr, etc.)',
            example: 'en'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"sentiment\": \"positive\",\\n  \"score\": 0.92,\\n  \"language\": \"en\"\\n}',
        requiredPlan: 'professional',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['professional', 'enterprise', 'custom'],
        rateLimit: { enabled: true, value: 100, period: 'minute' },
        quota: { enabled: true, value: 5000, period: 'month' },
        backendUrl: 'https://api.aiplatform.com/v1/nlp/sentiment',
        responseTime: 320,
        errorRate: 0.7,
        callsToday: 3210,
      },
      {
        id: '12',
        path: '/vision/detect',
        method: 'POST' as const,
        title: 'Object Detection',
        description: 'Detect objects in images using computer vision',
        parameters: [
          {
            id: '1',
            name: 'image_url',
            type: 'string',
            required: true,
            description: 'URL of image to analyze',
            example: 'https://example.com/image.jpg'
          },
          {
            id: '2',
            name: 'confidence_threshold',
            type: 'number',
            required: false,
            description: 'Minimum confidence score (0-1)',
            example: '0.5'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"objects\": [\\n    {\\n      \"label\": \"person\",\\n      \"confidence\": 0.95,\\n      \"bounding_box\": {}\\n    }\\n  ]\\n}',
        requiredPlan: 'enterprise',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: ['enterprise', 'custom'],
        rateLimit: { enabled: true, value: 30, period: 'minute' },
        quota: { enabled: true, value: 1000, period: 'month' },
        backendUrl: 'https://api.aiplatform.com/v1/vision/detect',
        responseTime: 1240,
        errorRate: 1.5,
        callsToday: 567,
      },
      {
        id: '13',
        path: '/models',
        method: 'GET' as const,
        title: 'List Models',
        description: 'Get list of available ML models',
        parameters: [
          {
            id: '1',
            name: 'category',
            type: 'enum',
            required: false,
            description: 'Filter by model category',
            example: 'nlp'
          }
        ],
        pathParameters: [],
        responseSchema: '{\\n  \"models\": [\\n    {\\n      \"id\": \"model_abc123\",\\n      \"name\": \"Sentiment Analyzer\",\\n      \"category\": \"nlp\",\\n      \"accuracy\": 0.94\\n    }\\n  ]\\n}',
        requiredPlan: 'starter',
        exampleRequests: [],
        exampleResponses: [],
        isActive: true,
        planRestrictions: [],
        rateLimit: { enabled: true, value: 60, period: 'minute' },
        quota: { enabled: true, value: 10000, period: 'month' },
        backendUrl: 'https://api.aiplatform.com/v1/models',
        responseTime: 85,
        errorRate: 0.2,
        callsToday: 892,
      },
    ],
  },
};
