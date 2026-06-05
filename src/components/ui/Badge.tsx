'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'free' | 'plus' | 'pro' | 'elite' | 'verified' | 'invited' | 'independent' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  free:        'bg-gray-100 text-gray-700 border border-gray-200',
  plus:        'bg-blue-100 text-blue-700 border border-blue-200',
  pro:         'bg-indigo-100 text-indigo-700 border border-indigo-200',
  elite:       'bg-amber-100 text-amber-700 border border-amber-200',
  verified:    'bg-green-100 text-green-700 border border-green-200',
  invited:     'bg-purple-100 text-purple-700 border border-purple-200',
  independent: 'bg-teal-100 text-teal-700 border border-teal-200',
  default:     'bg-gray-100 text-gray-700 border border-gray-200',
};

export function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
