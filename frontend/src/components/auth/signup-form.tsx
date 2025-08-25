'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['creator', 'consumer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'consumer',
    },
  });

  const password = watch('password');
  const role = watch('role');

  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    if (!password) return { score: 0, text: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strength = [
      { text: 'Very Weak', color: 'text-red-500' },
      { text: 'Weak', color: 'text-orange-500' },
      { text: 'Fair', color: 'text-yellow-500' },
      { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' },
    ];

    return { score, ...strength[Math.min(score, 4)] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data): Promise<void> => {
    try {
      await signup(data);
      toast.success('Account created successfully! Welcome to the platform.');

      // Redirect to dashboard after successful signup
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Create Account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Join our authentication proxy platform
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 px-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {password && (
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${passwordStrength.score >= 1 ? 'bg-red-500' : 'bg-transparent'}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 px-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Account Type</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setValue('role', value as 'creator' | 'consumer')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consumer" id="consumer" />
                <Label htmlFor="consumer" className="text-sm cursor-pointer flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Consumer</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creator" id="creator" />
                <Label htmlFor="creator" className="text-sm cursor-pointer flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Creator</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              {role === 'creator'
                ? 'Create and manage API products with full dashboard access'
                : 'Browse and subscribe to API products'
              }
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}