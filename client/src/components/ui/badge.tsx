import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50',
        secondary: 'border-transparent bg-slate-100 text-slate-900',
        destructive: 'border-transparent bg-red-100 text-red-700',
        outline: 'text-slate-950 border border-slate-200',
        // Lead Status Badges
        new: 'bg-blue-50 text-blue-700 border border-blue-200/60 font-medium',
        contacted: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-medium',
        qualified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium',
        lost: 'bg-rose-50 text-rose-700 border border-rose-200/60 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
