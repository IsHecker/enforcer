'use client';

import { SecuritySettings } from '@/components/products/security-settings';
import type { ApiProduct } from '@/types/api';
import { Shield } from 'lucide-react';

interface SecurityTabProps {
  apiProduct: ApiProduct;
  isNewProduct: boolean;
}

export function SecurityTab({ apiProduct, isNewProduct }: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Security Settings</h2>
      </div>
      <SecuritySettings product={apiProduct} isNewProduct={isNewProduct} />
    </div>
  );
}
