'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Settings,
  Zap,
  Menu,
  X,
  Globe,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

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
    title: 'Profile & Settings',
    href: '/profile',
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

  if (!user) return null;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative flex flex-col h-full bg-[#080808] border-r border-white/5 z-40',
        className
      )}
    >
      <div className={cn("flex items-center p-3", isCollapsed ? "justify-center" : "justify-end")}>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-slate-400 hover:text-white hover:bg-white/5 p-1 h-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 text-slate-400 hover:text-white hover:bg-white/5 p-2 h-auto"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <ScrollArea className={cn("flex-1 mt-2", isCollapsed ? "px-2" : "px-3")}>
        <nav className="space-y-1 pt-2">
          {consumerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className="block group">
                <div
                  className={cn(
                    'relative flex items-center h-11 rounded-xl transition-all duration-200 px-3',
                    isActive
                      ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  )}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  )}

                  <Icon className={cn(
                    'h-[18px] w-[18px] transition-transform duration-200',
                    !isCollapsed && 'mr-3.5',
                    isCollapsed && 'mx-auto',
                    isActive && 'scale-110'
                  )} />

                  {!isCollapsed && (
                    <>
                      <span className="text-[14px] font-medium tracking-tight flex-1">
                        {item.title}
                      </span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-white text-black text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-2xl whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </motion.div>
  );
}