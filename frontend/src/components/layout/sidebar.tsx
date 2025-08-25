'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Key,
  Zap,
  Menu,
  X,
  Shield,
  Wallet,
  Globe,
  Activity,
} from 'lucide-react';

const creatorNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My API Products',
    href: '/products',
    icon: Package,
  },
  {
    title: 'Plans & Pricing',
    href: '/plans',
    icon: CreditCard,
  },
  {
    title: 'Revenue Dashboard',
    href: '/revenue',
    icon: BarChart3,
  },
  {
    title: 'Consumer Management',
    href: '/consumers',
    icon: Users,
  },
  {
    title: 'Documentation',
    href: '/docs',
    icon: FileText,
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: Wallet,
  },
  {
    title: 'Profile & Settings',
    href: '/profile',
    icon: Settings,
  },
];

const consumerNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'API Marketplace',
    href: '/marketplace',
    icon: Globe,
  },
  {
    title: 'My Subscriptions',
    href: '/subscriptions',
    icon: Package,
  },
  {
    title: 'Usage & Analytics',
    href: '/usage',
    icon: BarChart3,
  },
  {
    title: 'Request Logs',
    href: '/request-logs',
    icon: Activity,
  },
  {
    title: 'API Keys',
    href: '/keys',
    icon: Key,
  },
  {
    title: 'Documentation',
    href: '/docs',
    icon: FileText,
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: Wallet,
  },
];

const adminNavItems = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: Shield,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Platform Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Content Management',
    href: '/admin/content',
    icon: Settings,
  },
  {
    title: 'Platform Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'creator':
        return creatorNavItems;
      case 'consumer':
        return consumerNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return consumerNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className={cn(
      'flex flex-col h-full bg-sidebar-background border-r border-sidebar-border',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      <div className="flex items-center justify-between p-4">
        <div className={cn(
          'flex items-center space-x-2',
          isCollapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">
              ProxyAPI
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-10',
                    isCollapsed ? 'px-2' : 'px-3',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {!isCollapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="bg-sidebar-accent/20 rounded-lg p-3 text-center">
              <h3 className="text-sm font-medium text-sidebar-foreground mb-1">
                {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </h3>
              <p className="text-xs text-sidebar-foreground/60 mb-2">
                {user?.plan === 'pro'
                  ? 'Unlimited API calls'
                  : '1,000 API calls/month'
                }
              </p>
              {user?.plan !== 'pro' && (
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}