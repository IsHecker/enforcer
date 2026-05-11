'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  User,
  Calendar,
  Clock
} from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: string;
  monthlyRevenue: number;
  joinedDate: string;
  renewalDate: string;
  usage: number;
  quota: number;
  status: 'active' | 'cancelled' | 'expired';
}

interface ViewSubscribersModalProps {
  productName: string;
  subscribers: Subscriber[];
  trigger: React.ReactNode;
}

export function ViewSubscribersModal({ productName, subscribers, trigger }: ViewSubscribersModalProps) {
  const totalRevenue = subscribers.reduce((sum, sub) => sum + sub.monthlyRevenue, 0);
  const activeSubscribers = subscribers.filter(sub => sub.status === 'active').length;
  const averageRevenue = activeSubscribers > 0 ? totalRevenue / activeSubscribers : 0;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
      case 'cancelled':
        return {
          icon: AlertCircle,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        };
      case 'expired':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      default:
        return {
          icon: Activity,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          badgeClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
    }
  };



  const getPlanInfo = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free':
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          gradient: 'from-gray-500/10 to-gray-600/10'
        };
      case 'basic':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          gradient: 'from-blue-500/10 to-blue-600/10'
        };
      case 'pro':
        return {
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          gradient: 'from-purple-500/10 to-purple-600/10'
        };
      case 'enterprise':
        return {
          color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          gradient: 'from-orange-500/10 to-orange-600/10'
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          gradient: 'from-muted/50 to-muted/80'
        };
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-gradient-to-br from-background via-background to-muted/20 border-border/50">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {productName}
              </span>
              <span className="text-muted-foreground"> Subscribers</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-600/5 to-emerald-500/10 border-green-500/20 shadow-lg shadow-green-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-green-400">Monthly Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-green-400 mb-1">{formatCurrency(totalRevenue)}</div>
              <p className="text-sm text-green-400/70 flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Recurring revenue</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-cyan-500/10 border-blue-500/20 shadow-lg shadow-blue-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-blue-400">Active Users</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-blue-400 mb-1">{activeSubscribers}</div>
              <p className="text-sm text-blue-400/70 flex items-center space-x-1">
                <Activity className="h-4 w-4" />
                <span>of {subscribers.length} total</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-pink-500/10 border-purple-500/20 shadow-lg shadow-purple-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-purple-400">Avg Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-purple-400 mb-1">{formatCurrency(averageRevenue)}</div>
              <p className="text-sm text-purple-400/70 flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>per subscriber</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Thin Subscriber Details Table */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Subscriber Details</h3>
            <Badge variant="outline" className="bg-muted/50">
              {subscribers.length} total subscribers
            </Badge>
          </div>
          
          <div className="border border-border/50 rounded-lg bg-card/30">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="font-semibold">Subscriber</TableHead>
                    <TableHead className="font-semibold">Plan</TableHead>
                    <TableHead className="font-semibold">Revenue</TableHead>
                    <TableHead className="font-semibold">Usage</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                    <TableHead className="font-semibold">Renewal</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => {
                    const statusInfo = getStatusInfo(subscriber.status);
                    const planInfo = getPlanInfo(subscriber.plan);
                    const StatusIcon = statusInfo.icon;
                    const usagePercentage = Math.round((subscriber.usage / subscriber.quota) * 100);
                    
                    return (
                      <TableRow key={subscriber.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 border border-border/50">
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {getInitials(subscriber.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{subscriber.name}</div>
                              <div className="text-xs text-muted-foreground">{subscriber.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={planInfo.color}>
                            {subscriber.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-400">
                            {formatCurrency(subscriber.monthlyRevenue)}
                          </div>
                          <div className="text-xs text-muted-foreground">monthly</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5 w-40">
                            {/* Quotas used/limit on top */}
                            <div className="text-sm font-medium text-foreground text-left">
                              {subscriber.usage.toLocaleString()}/{subscriber.quota.toLocaleString()}
                            </div>
                            {/* Enhanced Progress bar */}
                            <div className="relative">
                              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    usagePercentage >= 90 ? 'bg-red-500' :
                                    usagePercentage >= 70 ? 'bg-orange-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                            {/* Percentage used underneath - no color coding */}
                            <div className="text-xs text-left font-medium text-muted-foreground">
                              {usagePercentage}% used
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(subscriber.joinedDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(subscriber.renewalDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusInfo.badgeClass}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            <span className="capitalize">{subscriber.status}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{subscribers.length} subscribers</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{activeSubscribers} active</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-green-400">{formatCurrency(totalRevenue)}</span>
              <span className="text-muted-foreground text-sm">total MRR</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}