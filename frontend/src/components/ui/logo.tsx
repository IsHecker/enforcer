import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'icon' | 'full' | 'text'
}

const sizeClasses = {
  sm: { icon: 'w-6 h-6', text: 'text-lg' },
  md: { icon: 'w-8 h-8', text: 'text-xl' },
  lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  xl: { icon: 'w-16 h-16', text: 'text-3xl' }
}

export function Logo({ className, size = 'md', variant = 'full' }: LogoProps) {
  const iconSize = sizeClasses[size].icon
  const textSize = sizeClasses[size].text

  const LogoIcon = () => (
    <svg
      className={cn(iconSize, 'flex-shrink-0')}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shield */}
      <path
        d="M32 4L48 12V28C48 40 40 50 32 56C24 50 16 40 16 28V12L32 4Z"
        fill="url(#gradient1)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Inner hexagonal pattern */}
      <path
        d="M32 12L40 16V32C40 36 36 40 32 42C28 40 24 36 24 32V16L32 12Z"
        fill="url(#gradient2)"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.9"
      />
      
      {/* Central gear/enforcement symbol */}
      <circle cx="32" cy="28" r="8" fill="currentColor" opacity="0.8" />
      <circle cx="32" cy="28" r="4" fill="url(#gradient3)" />
      
      {/* Enforcement lines */}
      <path d="M26 24L38 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 28L38 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 32L38 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  )

  const LogoText = () => (
    <span className={cn(
      textSize,
      'font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent'
    )}>
      Enforcer
    </span>
  )

  if (variant === 'icon') {
    return <LogoIcon />
  }

  if (variant === 'text') {
    return <LogoText />
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoIcon />
      <LogoText />
    </div>
  )
}