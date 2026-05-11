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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { 
  Package, 
  Save, 
  X,
  Upload,
  Globe,
  Lock,
  AlertCircle 
} from 'lucide-react';
import type { ApiProduct } from '@/types/api';

const editProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  basePath: z.string().min(1, 'Base path is required').regex(/^\/[a-zA-Z0-9_/-]*$/, 'Base path must start with / and contain only letters, numbers, underscores, and hyphens'),
  backendUrl: z.string().url('Backend URL must be a valid URL'),
  logo: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'inactive', 'maintenance']),
  isPublic: z.boolean(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

interface EditProductModalProps {
  product: ApiProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ApiProduct) => void;
}

const categories = [
  'Weather & Environment',
  'Finance & Crypto', 
  'News & Media',
  'AI & Machine Learning',
  'Maps & Location',
  'Communication',
  'E-commerce',
  'Social Media',
  'Healthcare',
  'Education',
  'Gaming',
  'Entertainment',
  'Security',
  'Analytics',
  'Other'
];

export function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      description: '',
      basePath: '',
      backendUrl: '',
      logo: '',
      version: '',
      category: '',
      status: 'active',
      isPublic: true,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        basePath: product.basePath || '',
        backendUrl: product.backendUrl || '',
        logo: product.logo || '',
        version: product.version || '1.0.0',
        category: product.category || '',
        status: product.status || 'active',
        isPublic: product.isPublic ?? true,
      });
    }
  }, [product, form]);

  const handleSave = async (data: EditProductFormData) => {
    if (!product) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedProduct: ApiProduct = {
        ...product,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      onSave(updatedProduct);
      toast.success('API product updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-border/50">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold">Edit API Product</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(form.watch('status'))}>
                  {form.watch('status')}
                </Badge>
                <Badge variant="outline" className={form.watch('isPublic') ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {form.watch('isPublic') ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Update your API product details and settings
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter product name..."
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your API product..."
                              className="min-h-[100px] bg-background/50"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a clear and concise description of your API's functionality
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Version *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1.0.0"
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
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Technical Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="basePath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Path *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="/api/v1"
                              {...field}
                              className="bg-background/50 font-mono"
                            />
                          </FormControl>
                          <FormDescription>
                            The base path for all endpoints in this API (must start with /)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="backendUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backend URL *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://api.example.com"
                              {...field}
                              className="bg-background/50 font-mono"
                            />
                          </FormControl>
                          <FormDescription>
                            The backend server URL where requests will be forwarded
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Settings & Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Product Logo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-20 w-20 border-2 border-border/50">
                        <AvatarImage src={form.watch('logo')} alt={form.watch('name')} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {form.watch('name').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/logo.png"
                                {...field}
                                className="bg-background/50 text-xs"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Logo URL (optional). Leave empty to use initials.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Visibility & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Public API</FormLabel>
                            <FormDescription className="text-xs">
                              Make this API discoverable in the marketplace
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            Control the current operational status of your API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Current Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Current Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subscribers</span>
                      <span className="font-medium">{product.totalSubscribers || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">API Calls</span>
                      <span className="font-medium">{(product.totalCalls || 0).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{(product.successRate || 0).toFixed(1)}%</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Endpoints</span>
                      <span className="font-medium">{product.endpoints?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

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