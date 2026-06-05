'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const starSizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <Star
            key={i}
            className={cn(
              starSizes[size],
              'transition-colors',
              filled
                ? 'fill-amber-400 text-amber-400'
                : partial
                ? 'fill-amber-200 text-amber-400'
                : 'fill-gray-200 text-gray-300',
              interactive && 'cursor-pointer hover:fill-amber-400 hover:text-amber-400'
            )}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingDisplay({ rating, count, size = 'md', className }: RatingDisplayProps) {
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <StarRating rating={rating} size={size} />
      <span className={cn('font-semibold text-gray-900', textSizes[size])}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={cn('text-gray-500', textSizes[size])}>
          ({count} {count === 1 ? 'recenzie' : 'recenzii'})
        </span>
      )}
    </div>
  );
}
