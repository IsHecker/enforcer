'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, AlertTriangle, Trash2, Edit, Save, Settings } from 'lucide-react';
import type { ApiProduct } from '@/types/api';
import { useState, useEffect } from 'react';

const editProductSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.()]+$/, 'Product name contains invalid characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  basePath: z.string()
    .min(1, 'Base path is required')
    .regex(/^\/[a-zA-Z0-9_/-]*$/, 'Base path must start with / and contain only letters, numbers, underscores, and hyphens')
    .refine(path => !path.includes('?'), 'Base path cannot contain query parameters')
    .refine(path => !path.includes('#'), 'Base path cannot contain fragments')
    .refine(path => !path.includes('{'), 'Base path cannot contain path parameters like {id}')
    .refine(path => path.length <= 100, 'Base path must be less than 100 characters'),
  backendUrl: z.string()
    .min(1, 'Backend URL is required')
    .url('Backend URL must be a valid URL')
    .refine(url => {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.search !== '' || parsedUrl.hash !== '') {
          return false;
        }
        if (parsedUrl.pathname.includes('{') || parsedUrl.pathname.includes('}')) {
          return false;
        }
        if (parsedUrl.pathname.match(/[^a-zA-Z0-9\/_.-]/)) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }, 'Backend URL must be a clean URL without query parameters, fragments, path parameters, or special characters'),
  logo: z.string().url('Logo must be a valid URL').optional().or(z.literal('')),
  version: z.string()
    .min(1, 'Version is required')
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.0.0)'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'inactive', 'maintenance']),
  isPublic: z.boolean(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

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

interface ProductSettingsProps {
  apiProduct: ApiProduct;
  isNewProduct: boolean;
  onSave: (data: EditProductFormData) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}

export function ProductSettingsForm({ apiProduct, isNewProduct, onSave, onDelete, isLoading }: ProductSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    if (apiProduct) {
      form.reset({
        name: apiProduct.name || '',
        description: apiProduct.description || '',
        basePath: apiProduct.basePath || '',
        backendUrl: apiProduct.backendUrl || '',
        logo: apiProduct.logo || '',
        version: apiProduct.version || '1.0.0',
        category: apiProduct.category || '',
        status: apiProduct.status || 'active',
        isPublic: apiProduct.isPublic ?? true,
      });
    }
  }, [apiProduct, form]);

  const handleSubmit = async (data: EditProductFormData) => {
    await onSave(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">General Settings</h2>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (apiProduct) {
                  form.reset({
                    name: apiProduct.name || '',
                    description: apiProduct.description || '',
                    basePath: apiProduct.basePath || '',
                    backendUrl: apiProduct.backendUrl || '',
                    logo: apiProduct.logo || '',
                    version: apiProduct.version || '1.0.0',
                    category: apiProduct.category || '',
                    status: apiProduct.status || 'active',
                    isPublic: apiProduct.isPublic ?? true,
                  });
                }
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(handleSubmit)}
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
          )}
        </div>
      </div>

      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Basic Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-500" />
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>Technical Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="basePath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Key *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/api/v1"
                          {...field}
                          disabled={!isEditing}
                          className="bg-background/50 font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        The service key for all endpoints in this API (must start with /)
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
                      <FormLabel>Target Base URL *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://api.example.com"
                          {...field}
                          disabled={!isEditing}
                          className="bg-background/50 font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        The server URL where requests will be forwarded (no query parameters, fragments, or path parameters allowed)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
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
                            disabled={!isEditing}
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

            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
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
                          disabled={!isEditing}
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Current Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subscribers</span>
                  <span className="font-medium">{apiProduct?.totalSubscribers || 0}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API Calls</span>
                  <span className="font-medium">{(apiProduct?.totalCalls || 0).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">{(apiProduct?.successRate || 0).toFixed(1)}%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Endpoints</span>
                  <span className="font-medium">{apiProduct?.endpoints?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-500/5 backdrop-blur-sm border-red-500/20">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Once you delete an API product, there is no going back. Please be certain.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete API Product
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete API Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{apiProduct?.name}"? This action cannot be undone.
                          All associated endpoints, subscription plans, and analytics data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Product'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}
