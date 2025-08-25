'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  Globe,
  Zap,
} from 'lucide-react';

interface RequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  apiName: string;
  statusCode: number;
  responseTime: number;
  userAgent: string;
  ipAddress: string;
  apiKey: string;
  quotaUsed: boolean;
  errorMessage?: string;
  requestSize: number;
  responseSize: number;
}

const mockRequestLogs: RequestLog[] = [
  {
    id: '1',
    timestamp: '2024-01-30T14:32:15Z',
    method: 'GET',
    endpoint: '/weather/current',
    apiName: 'Weather API',
    statusCode: 200,
    responseTime: 245,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_live_123...abc',
    quotaUsed: true,
    requestSize: 0,
    responseSize: 1024,
  },
  {
    id: '2',
    timestamp: '2024-01-30T14:31:42Z',
    method: 'GET',
    endpoint: '/crypto/prices',
    apiName: 'Crypto API',
    statusCode: 200,
    responseTime: 189,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_test_456...def',
    quotaUsed: true,
    requestSize: 0,
    responseSize: 2048,
  },
  {
    id: '3',
    timestamp: '2024-01-30T14:30:18Z',
    method: 'POST',
    endpoint: '/news/articles',
    apiName: 'News API',
    statusCode: 400,
    responseTime: 156,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_live_123...abc',
    quotaUsed: false,
    errorMessage: 'Invalid query parameter: category',
    requestSize: 256,
    responseSize: 512,
  },
  {
    id: '4',
    timestamp: '2024-01-30T14:29:55Z',
    method: 'GET',
    endpoint: '/weather/forecast',
    apiName: 'Weather API',
    statusCode: 429,
    responseTime: 12,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_live_123...abc',
    quotaUsed: false,
    errorMessage: 'Rate limit exceeded',
    requestSize: 0,
    responseSize: 128,
  },
  {
    id: '5',
    timestamp: '2024-01-30T14:28:33Z',
    method: 'GET',
    endpoint: '/weather/current',
    apiName: 'Weather API',
    statusCode: 200,
    responseTime: 298,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_live_123...abc',
    quotaUsed: true,
    requestSize: 0,
    responseSize: 1024,
  },
  {
    id: '6',
    timestamp: '2024-01-30T14:27:21Z',
    method: 'GET',
    endpoint: '/crypto/prices',
    apiName: 'Crypto API',
    statusCode: 500,
    responseTime: 5000,
    userAgent: 'MyApp/1.0.0',
    ipAddress: '192.168.1.100',
    apiKey: 'pk_test_456...def',
    quotaUsed: false,
    errorMessage: 'Internal server error',
    requestSize: 0,
    responseSize: 256,
  },
];

export default function RequestLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apiFilter, setApiFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const { user } = useAuth();

  if (!user) return null;

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    } else if (statusCode >= 500) {
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
    return 'bg-muted/10 text-muted-foreground border-muted/30';
  };

  const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <CheckCircle className="h-4 w-4" />;
    } else if (statusCode >= 400) {
      return <XCircle className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredLogs = mockRequestLogs.filter(log => {
    const matchesSearch = log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.apiKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'success' && log.statusCode >= 200 && log.statusCode < 300) ||
      (statusFilter === 'error' && log.statusCode >= 400);

    const matchesApi = apiFilter === 'all' || log.apiName.toLowerCase().includes(apiFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesApi;
  });

  const stats = {
    total: filteredLogs.length,
    successful: filteredLogs.filter(log => log.statusCode >= 200 && log.statusCode < 300).length,
    errors: filteredLogs.filter(log => log.statusCode >= 400).length,
    avgResponseTime: Math.round(filteredLogs.reduce((acc, log) => acc + log.responseTime, 0) / filteredLogs.length),
    quotaUsed: filteredLogs.filter(log => log.quotaUsed).length,
  };

  return (
    <RoleGuard allowedRoles={['consumer']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Request Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Detailed logs of all your API requests with response times, status codes, and error information
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.total}
                </div>
                <p className="text-sm text-muted-foreground">
                  in selected period
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Successful
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {stats.successful}
                </div>
                <p className="text-sm text-muted-foreground">
                  {((stats.successful / stats.total) * 100).toFixed(1)}% success rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  {stats.errors}
                </div>
                <p className="text-sm text-muted-foreground">
                  {((stats.errors / stats.total) * 100).toFixed(1)}% error rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Avg Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.avgResponseTime}ms
                </div>
                <p className="text-sm text-muted-foreground">
                  average response time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Quota Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.quotaUsed}
                </div>
                <p className="text-sm text-muted-foreground">
                  calls counted
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs by endpoint, API, or key..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success (2xx)</SelectItem>
                      <SelectItem value="error">Errors (4xx, 5xx)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={apiFilter} onValueChange={setApiFilter}>
                    <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                      <Globe className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="API" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All APIs</SelectItem>
                      <SelectItem value="weather">Weather API</SelectItem>
                      <SelectItem value="crypto">Crypto API</SelectItem>
                      <SelectItem value="news">News API</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Logs */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-foreground">Request History</CardTitle>
              <CardDescription className="text-muted-foreground">
                Showing {filteredLogs.length} requests from the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg border border-border/50 bg-background/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={getMethodColor(log.method)}>
                            {log.method}
                          </Badge>
                          <code className="text-sm text-foreground bg-muted/50 px-2 py-1 rounded">
                            {log.endpoint}
                          </code>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                            {log.apiName}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={getStatusColor(log.statusCode)}>
                            {getStatusIcon(log.statusCode)}
                            <span className="ml-1">{log.statusCode}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Time:</span>
                          <span className={`font-medium ${log.responseTime > 1000 ? 'text-red-400' : log.responseTime > 500 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {log.responseTime}ms
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">API Key:</span>
                          <code className="text-foreground">{log.apiKey}</code>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quota Used:</span>
                          <span className={`font-medium ${log.quotaUsed ? 'text-red-400' : 'text-green-400'}`}>
                            {log.quotaUsed ? 'Yes' : 'No'}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Transfer:</span>
                          <span className="text-foreground">
                            ↑{formatBytes(log.requestSize)} ↓{formatBytes(log.responseSize)}
                          </span>
                        </div>
                      </div>

                      {log.errorMessage && (
                        <>
                          <Separator className="my-3" />
                          <div className="flex items-start space-x-2 text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Error:</span>
                              <span className="ml-1">{log.errorMessage}</span>
                            </div>
                          </div>
                        </>
                      )}

                      <Separator className="my-3" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span>IP: {log.ipAddress}</span>
                          <span>User-Agent: {log.userAgent}</span>
                        </div>

                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No request logs found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No requests match your current filter criteria
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setApiFilter('all');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}