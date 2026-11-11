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
  const [isInitializing, setIsInitializing] = React.useState(true);

  // Give Better Auth a short buffer to complete its initial session resolution from cookies
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Only redirect if initialization and session loading are settled, and user is still null
    if (!isInitializing && !isLoading && !user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isInitializing, isLoading, user, router, pathname]);

  // Show loading skeleton while checking session
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-[70vh] max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
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
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}