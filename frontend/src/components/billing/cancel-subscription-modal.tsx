'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Calendar,
  Shield,
  Zap,
  Info,
} from 'lucide-react';

interface ApiSubscription {
  id: string;
  apiName: string;
  planName: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  quota: number;
  rateLimit: string;
  renewalDate: string;
  usage: number;
  status: 'active' | 'cancelled' | 'expired';
  overageCharges: number;
  nextBillingAmount: number;
}

interface CancelSubscriptionModalProps {
  subscription: ApiSubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel?: (subscriptionId: string, cancelType: 'end-of-cycle' | 'immediately') => void;
}

export function CancelSubscriptionModal({ subscription, isOpen, onClose, onCancel }: CancelSubscriptionModalProps) {
  const [cancelType, setCancelType] = useState<'end-of-cycle' | 'immediately'>('end-of-cycle');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  if (!subscription) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancel = (): void => {
    setShowConfirmation(true);
  };

  const handleConfirmCancel = (): void => {
    if (onCancel) {
      onCancel(subscription.id, cancelType);
    }
    setShowConfirmation(false);
    onClose();
  };

  const handleBackToOptions = (): void => {
    setShowConfirmation(false);
  };

  const getEffectiveDate = (): string => {
    if (cancelType === 'immediately') {
      return 'Immediately';
    }
    return formatDate(subscription.renewalDate);
  };

  const getCancellationWarning = (): string => {
    if (cancelType === 'immediately') {
      return 'Your subscription will be cancelled immediately. You will lose access to the API right away and no refund will be provided for the current billing period.';
    }
    return 'Your subscription will be cancelled at the end of your current billing cycle. You will continue to have access until then.';
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Cancellation</span>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please review the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="font-medium">{subscription.apiName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {subscription.planName}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cancellation Type</span>
                <span className="font-medium">
                  {cancelType === 'end-of-cycle' ? 'End of Billing Cycle' : 'Immediate'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Effective Date</span>
                <span className="font-medium">{getEffectiveDate()}</span>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">
                  {getCancellationWarning()}
                </p>
              </div>
            </div>

            {cancelType === 'end-of-cycle' && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-400">
                    You can resubscribe at any time before the cancellation takes effect.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleBackToOptions} className="flex-1">
              Back
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} className="flex-1">
              Confirm Cancellation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-lg flex items-center justify-center border border-border/50">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <div className="text-xl font-bold">Cancel Subscription</div>
              <div className="text-sm text-muted-foreground">{subscription.apiName}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription to <strong>{subscription.apiName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Subscription Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
                <Zap className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="font-medium">{subscription.apiName}</div>
                <div className="text-sm text-muted-foreground">{subscription.planName}</div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Price</span>
                <div className="font-medium">{formatCurrency(subscription.price)}/month</div>
              </div>
              <div>
                <span className="text-muted-foreground">Next Billing</span>
                <div className="font-medium">{formatDate(subscription.renewalDate)}</div>
              </div>
            </div>
          </div>

          {/* Cancellation Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Choose when to cancel:</h3>
            
            <RadioGroup value={cancelType} onValueChange={(value) => setCancelType(value as 'end-of-cycle' | 'immediately')}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                  <RadioGroupItem value="end-of-cycle" id="end-of-cycle" className="mt-1" />
                  <Label htmlFor="end-of-cycle" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Cancel at End of Billing Cycle</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep access until {formatDate(subscription.renewalDate)}. No immediate loss of service.
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                  <RadioGroupItem value="immediately" id="immediately" className="mt-1" />
                  <Label htmlFor="immediately" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-red-400" />
                      <span className="font-medium">Cancel Immediately</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lose access right away. No refund for the current billing period.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-400">
                <p className="font-medium">Before you cancel:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>You will lose access to all API endpoints</li>
                  <li>Your API keys will be deactivated</li>
                  <li>Historical usage data will be retained for 30 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Keep Subscription
          </Button>
          <Button variant="destructive" onClick={handleCancel} className="flex-1">
            Cancel Subscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}