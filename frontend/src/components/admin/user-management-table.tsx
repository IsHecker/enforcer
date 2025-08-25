'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Settings,
  Shield,
  Crown,
  Users,
} from 'lucide-react';
import type { User } from '@/types/auth';

const mockUsers: (User & { stats: { apiCalls: number; revenue: number; lastActive: string } })[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'creator',
    plan: 'pro',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-01-25T10:30:00Z',
    stats: {
      apiCalls: 45000,
      revenue: 1250.50,
      lastActive: '2024-01-25T10:30:00Z',
    },
  },
  {
    id: '2',
    email: 'bob@startup.com',
    name: 'Bob Smith',
    role: 'consumer',
    plan: 'pro',
    createdAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-01-25T09:15:00Z',
    stats: {
      apiCalls: 8900,
      revenue: 89.99,
      lastActive: '2024-01-25T09:15:00Z',
    },
  },
  {
    id: '3',
    email: 'carol@corp.com',
    name: 'Carol Davis',
    role: 'consumer',
    plan: 'enterprise',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-25T14:20:00Z',
    stats: {
      apiCalls: 125000,
      revenue: 999.99,
      lastActive: '2024-01-25T14:20:00Z',
    },
  },
  {
    id: '4',
    email: 'dave@dev.io',
    name: 'Dave Wilson',
    role: 'creator',
    plan: 'free',
    createdAt: '2024-01-22T00:00:00Z',
    lastLogin: '2024-01-24T16:45:00Z',
    stats: {
      apiCalls: 850,
      revenue: 0,
      lastActive: '2024-01-24T16:45:00Z',
    },
  },
];

export function UserManagementTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'creator':
        return <Crown className="h-4 w-4" />;
      case 'consumer':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'creator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'consumer':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesRole && matchesPlan;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user:`, userId);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">User Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage platform users, roles, and permissions
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {filteredUsers.length} users
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50 border-border/50"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Plan</TableHead>
                <TableHead className="text-muted-foreground">API Calls</TableHead>
                <TableHead className="text-muted-foreground">Revenue</TableHead>
                <TableHead className="text-muted-foreground">Last Active</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadge(user.role)}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPlanBadge(user.plan || 'free')}>
                        {user.plan || 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {user.stats.apiCalls.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatCurrency(user.stats.revenue)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.stats.lastActive)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                            <Settings className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            className="text-destructive"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              Showing {filteredUsers.length} of {mockUsers.length} users
            </span>
            <div className="flex items-center space-x-4">
              <span>
                Total Revenue: {formatCurrency(filteredUsers.reduce((sum, user) => sum + user.stats.revenue, 0))}
              </span>
              <span>
                Total API Calls: {filteredUsers.reduce((sum, user) => sum + user.stats.apiCalls, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}