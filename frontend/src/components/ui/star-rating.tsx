'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({
  initialRating = 0,
  maxRating = 5,
  onRate,
  readonly = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(initialRating);

  const starSize = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  const handleRate = (rating: number) => {
    if (readonly) return;
    setCurrentRating(rating);
    if (onRate) onRate(rating);
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[...Array(maxRating)].map((_, i) => {
        const ratingValue = i + 1;
        const isActive = ratingValue <= (hoverRating ?? currentRating);
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={cn(
              'focus:outline-none transition-transform active:scale-95',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            onMouseEnter={() => !readonly && setHoverRating(ratingValue)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            onClick={() => handleRate(ratingValue)}
          >
            <Star
              className={cn(
                starSize[size],
                isActive 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-muted-foreground/30 fill-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
