'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Zap,
  Save, 
  X,
  DollarSign,
  Activity,
  Settings,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import type { Plan } from '@/types/api';

const editPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100, 'Plan name must be less than 100 characters'),
  type: z.enum(['free', 'pro', 'enterprise']),
  price: z.number().min(0, 'Price must be a positive number'),
  billingPeriod: z.enum(['monthly', 'yearly']),
  quotaLimit: z.number().min(1, 'Quota limit must be greater than 0'),
  quotaPeriod: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  rateLimit: z.number().min(1, 'Rate limit must be greater than 0'),
  rateLimitPeriod: z.enum(['second', 'minute', 'hour']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isActive: z.boolean(),
  overageEnabled: z.boolean(),
  overagePrice: z.number().optional(),
  overageMaxOverage: z.number().optional(),
});

type EditPlanFormData = z.infer<typeof editPlanSchema>;

interface EditPlanModalProps {
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
}

export function EditPlanModal({ plan, isOpen, onClose, onSave }: EditPlanModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentFeatureInput, setCurrentFeatureInput] = useState<string>('');

  const form = useForm<EditPlanFormData>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      name: '',
      type: 'free',
      price: 0,
      billingPeriod: 'monthly',
      quotaLimit: 1000,
      quotaPeriod: 'monthly',
      rateLimit: 10,
      rateLimitPeriod: 'second',
      features: [],
      isActive: true,
      overageEnabled: false,
      overagePrice: 0.001,
      overageMaxOverage: 0,
    },
  });

  // Reset form when plan changes
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        type: plan.type,
        price: plan.price,
        billingPeriod: plan.billingPeriod,
        quotaLimit: plan.quotaLimit,
        quotaPeriod: plan.quotaPeriod,
        rateLimit: plan.rateLimit,
        rateLimitPeriod: plan.rateLimitPeriod,
        features: [...plan.features],
        isActive: plan.isActive,
        overageEnabled: plan.overage?.enabled || false,
        overagePrice: plan.overage?.pricePerRequest || 0.001,
        overageMaxOverage: plan.overage?.maxOverage || 0,
      });
    }
  }, [plan, form]);

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'free':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'pro':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'enterprise':
        return <Shield className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-orange-500" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'text-green-400';
      case 'pro':
        return 'text-blue-400';
      case 'enterprise':
        return 'text-purple-400';
      default:
        return 'text-primary';
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const addFeature = () => {
    if (currentFeatureInput.trim()) {
      const currentFeatures = form.getValues('features');
      form.setValue('features', [...currentFeatures, currentFeatureInput.trim()]);
      setCurrentFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  const handleSave = async (data: EditPlanFormData) => {
    if (!plan) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedPlan: Plan = {
        ...plan,
        name: data.name,
        type: data.type,
        price: data.price,
        billingPeriod: data.billingPeriod,
        quotaLimit: data.quotaLimit,
        quotaPeriod: data.quotaPeriod,
        rateLimit: data.rateLimit,
        rateLimitPeriod: data.rateLimitPeriod,
        features: data.features,
        isActive: data.isActive,
        overage: data.overageEnabled ? {
          enabled: true,
          pricePerRequest: data.overagePrice || 0.001,
          maxOverage: data.overageMaxOverage || undefined,
        } : undefined,
      };

      onSave(updatedPlan);
      toast.success(`${updatedPlan.name} plan updated successfully!`);
      onClose();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setCurrentFeatureInput('');
    onClose();
  };

  if (!plan) return null;

  const watchedType = form.watch('type');
  const watchedIsActive = form.watch('isActive');
  const watchedOverageEnabled = form.watch('overageEnabled');
  const watchedFeatures = form.watch('features');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold">Edit Subscription Plan</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(watchedIsActive)}>
                  {watchedIsActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {watchedType}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Update your subscription plan details, pricing, and features
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <ScrollArea className="h-[65vh] pr-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} data-scrollbar-hidden>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>Plan Identity</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plan Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Pro Plan, Enterprise"
                                    {...field}
                                    className="bg-background/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plan Type *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="free">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Free</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="pro">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Pro</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="enterprise">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Enterprise</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pricing & Billing - Only show for paid plans */}
                    {watchedType !== 'free' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>Pricing & Billing</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price per Billing Cycle *</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        className="pl-10 bg-background/50"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billingPeriod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Billing Period</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-background/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="monthly">Monthly Billing</SelectItem>
                                      <SelectItem value="yearly">Yearly Billing</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Usage Limits */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-orange-500" />
                          <span>Usage Limits & Controls</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Quota Configuration */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h6 className="text-sm font-medium">API Request Quota</h6>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="quotaLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quota Limit *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="1000"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="bg-background/50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="quotaPeriod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quota Reset Period</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-background/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="daily">Daily Reset</SelectItem>
                                      <SelectItem value="weekly">Weekly Reset</SelectItem>
                                      <SelectItem value="monthly">Monthly Reset</SelectItem>
                                      <SelectItem value="yearly">Yearly Reset</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t border-border/20 pt-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <h6 className="text-sm font-medium">Rate Limiting</h6>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="rateLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rate Limit *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="10"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="bg-background/50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="rateLimitPeriod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rate Limit Window</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-background/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="second">Requests per Second</SelectItem>
                                      <SelectItem value="minute">Requests per Minute</SelectItem>
                                      <SelectItem value="hour">Requests per Hour</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plan Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Plan Features</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {watchedFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/5 rounded-lg border border-border/20"
                            >
                              <span className="text-foreground flex-1 pr-2">{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFeature(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <Input
                              value={currentFeatureInput}
                              onChange={(e) => setCurrentFeatureInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addFeature();
                                }
                              }}
                              placeholder="e.g., Advanced analytics, Priority support..."
                              className="bg-background/50"
                            />
                            <Button 
                              type="button" 
                              onClick={addFeature} 
                              disabled={!currentFeatureInput.trim()}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Settings & Preview */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Plan Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col items-center space-y-3">
                          <Avatar className="h-16 w-16 border-2 border-border/50">
                            <AvatarFallback className={`${getPlanColor(watchedType)} bg-muted/20 font-semibold`}>
                              {getPlanIcon(watchedType)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{form.watch('name') || 'Plan Name'}</div>
                            <div className="text-sm text-muted-foreground capitalize">{watchedType} Plan</div>
                            <div className="text-lg font-bold text-foreground mt-1">
                              {form.watch('price') === 0 ? 'Free' : 
                                `$${form.watch('price')}${form.watch('billingPeriod') === 'yearly' ? '/yr' : '/mo'}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Plan Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Plan</FormLabel>
                                <FormDescription className="text-xs">
                                  Allow new subscriptions to this plan
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="overageEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Overage Billing</FormLabel>
                                <FormDescription className="text-xs">
                                  Allow usage beyond quota with additional charges
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {watchedOverageEnabled && (
                          <div className="space-y-4 p-4 bg-muted/10 rounded-lg border border-border/20">
                            <FormField
                              control={form.control}
                              name="overagePrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Overage Price per Request</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        placeholder="0.001"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        className="pl-10 bg-background/50"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="overageMaxOverage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Maximum Overage Requests</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="Leave empty for unlimited"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="bg-background/50"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Leave empty for unlimited overage requests
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}