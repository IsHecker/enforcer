'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api-service';
import { toast } from 'sonner';
import { Package, ArrowLeft, AlertTriangle, Info, Sparkles } from 'lucide-react';
import type { CreateApiServiceRequest } from '@/types/backend-api';

const createProductSchema = z.object({
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
  isPublic: z.boolean(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

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

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      basePath: '/',
      backendUrl: '',
      logo: '',
      version: '1.0.0',
      category: '',
      isPublic: true,
    },
  });

  if (!user) return null;

  const handleCreateProduct = async (data: CreateProductFormData) => {
    setIsLoading(true);
    
    try {
      // Map form data to backend API request
      const createRequest: CreateApiServiceRequest = {
        name: data.name,
        description: data.description,
        category: data.category,
        serviceKey: data.basePath,
        targetBaseUrl: data.backendUrl,
        logoUrl: data.logo || null,
        isPublic: data.isPublic,
        status: 'active',
      };

      // Call backend API to create the product
      const response = await api.apiServices.create(createRequest);

      if (response.success && response.data) {
        const newProductId = response.data;
        
        toast.success('API product created successfully!');
        
        // Navigate to products list page
        router.push('/studio/products');
      } else {
        const errorMsg = response.error?.message || 'Failed to create product';
        toast.error(errorMsg);
        console.error('Failed to create product:', response.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/studio/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create New API Product
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new API product and start managing your backend service
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-500/10 border-blue-500/30">
        <Sparkles className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-sm text-muted-foreground ml-2">
          After creating your API product, you'll be able to add endpoints, configure subscription plans, and set up security controls.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateProduct)}>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Basic Info */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>
                    Provide the essential details about your API product
                  </CardDescription>
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
                        <FormDescription>
                          Choose a clear, descriptive name for your API
                        </FormDescription>
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
                            className="min-h-[120px] bg-background/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a clear and concise description of your API's functionality (10-500 characters)
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
                          <FormDescription>
                            Semantic versioning (major.minor.patch)
                          </FormDescription>
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
                          <FormDescription>
                            Help users discover your API
                          </FormDescription>
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
                  <CardDescription>
                    Configure how requests are routed and proxied
                  </CardDescription>
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
                          The backend server URL where requests will be forwarded (no query parameters, fragments, or path parameters allowed)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert className="bg-yellow-500/10 border-yellow-500/30">
                    <Info className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-xs text-muted-foreground ml-2">
                      Make sure your backend URL is accessible and properly configured to accept requests from the proxy service.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Preview */}
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Product Logo</CardTitle>
                  <CardDescription>
                    Optional visual identifier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-20 w-20 border-2 border-border/50">
                      <AvatarImage src={form.watch('logo')} alt={form.watch('name')} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {form.watch('name') ? form.watch('name').substring(0, 2).toUpperCase() : 'AP'}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Visibility</CardTitle>
                  <CardDescription>
                    Control who can discover your API
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Separator />

              <div className="space-y-3">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Create API Product
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/studio/products')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
