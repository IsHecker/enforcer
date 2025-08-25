'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo,
  fallback
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role as UserRole)) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Default redirect based on role
        switch (user.role) {
          case 'creator':
            router.push('/dashboard');
            break;
          case 'consumer':
            router.push('/dashboard');
            break;
          case 'admin':
            router.push('/admin');
            break;
          default:
            router.push('/dashboard');
        }
      }
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}