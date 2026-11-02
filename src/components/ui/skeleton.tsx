import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

/**
 * Pre-built skeleton loader matching the exact proportions of our Event Card.
 * Solves Bonus Requirement: "Add proper loading skeletons where needed"
 */
export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Thumbnail Skeleton */}
      <Skeleton className="w-full h-48 rounded-none" />

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Badge & Date */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title lines */}
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-4 w-3/4" />

          {/* Location */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="pt-2">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}