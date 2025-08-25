'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ApiDocumentation } from '@/components/docs/api-documentation';
import { useAuth } from '@/contexts/auth-context';

export default function DocsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            API Documentation
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive guides and examples for integrating with our APIs
          </p>
        </div>

        <ApiDocumentation />
      </div>
    </DashboardLayout>
  );
}