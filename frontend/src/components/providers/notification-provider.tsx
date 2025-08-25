'use client';

import { Toaster } from '@/components/ui/sonner';

export function NotificationProvider() {
  return (
    <Toaster 
      theme="dark"
      position="top-right"
      expand={false}
      richColors
      closeButton
    />
  );
}