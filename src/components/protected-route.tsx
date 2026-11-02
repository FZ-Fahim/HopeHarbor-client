'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartHandshake } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Only redirect once session loading has finished AND user is definitively null
    if (!isLoading && !user) {
      // Store current path so login can redirect back
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // While checking auth on initial load or browser refresh (F5),
  // show a clean skeleton loader instead of bouncing to login
  if (isLoading) {
    return (
      <div className="min-h-[70vh] max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
            <HeartHandshake className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {/* Content Placeholder Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // If not authenticated, render nothing while redirect takes effect
  if (!user) {
    return null;
  }

  // User is authenticated
  return <>{children}</>;
}