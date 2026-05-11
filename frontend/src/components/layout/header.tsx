'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Palette,
  Wallet,
  ChevronDown,
  Zap,
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async (): Promise<void> => {
    try {
      if (!logout) return;
      logout();
      setTimeout(() => {
        toast.success('You have been logged out successfully');
      }, 100);
      router.replace('/auth/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isInStudio = pathname?.startsWith('/studio');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-16 items-center px-6 gap-6">

        {/* Left Side: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Zap className="h-6 w-6 text-black fill-black" />
          </div>
          <span className={`${inter.className} text-xl font-bold text-white tracking-tight hidden sm:block`}>
            Enforcer
          </span>
        </div>

        <div className="flex-1" />

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">

          {/* View Toggle */}
          <div className="bg-white/5 p-1 rounded-2xl flex items-center gap-1 border border-white/5">
            <Button
              size="sm"
              variant={!isInStudio ? 'secondary' : 'ghost'}
              onClick={() => router.push('/dashboard')}
              className={cn(
                "h-8 px-4 rounded-xl text-[12px] font-bold transition-all",
                !isInStudio ? "bg-white text-black hover:bg-slate-100 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              Consumer
            </Button>
            <Button
              size="sm"
              variant={isInStudio ? 'secondary' : 'ghost'}
              onClick={() => router.push('/studio')}
              className={cn(
                "h-8 px-4 rounded-xl text-[12px] font-bold transition-all",
                isInStudio ? "bg-white text-black hover:bg-slate-100 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              Studio
            </Button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          {/* Theme & Notifications */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-indigo-500 rounded-full border-2 border-background shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </Button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 p-1 px-2 rounded-2xl hover:bg-white/5 transition-all group focus:outline-none">
                <div className="relative">
                  <Avatar className="h-8 w-8 rounded-xl border border-white/10 group-hover:border-white/30 transition-colors">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-bold">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <p className="text-[13px] font-bold text-white leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 capitalize leading-none">{user?.role || 'Member'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 p-2 bg-[#0C0C0C]/90 backdrop-blur-2xl border-white/5 rounded-2xl shadow-2xl" align="end">
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-[14px] font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 leading-none">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl p-2.5 focus:bg-white/10 group">
                  <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[13px] font-medium">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl p-2.5 focus:bg-white/10 group">
                  <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[13px] font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/wallet')} className="rounded-xl p-2.5 focus:bg-white/10 group">
                  <Wallet className="mr-3 h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[13px] font-medium">Wallet</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400 group">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-[13px] font-semibold">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}

