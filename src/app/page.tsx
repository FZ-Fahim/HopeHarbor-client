'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';
import { HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const handleTestToast = () => {
    toast.success('Welcome to HopeHarbor!', {
      description: 'Toast notification system is working without native alerts.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 text-center">
        {/* Brand Icon & Heading */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <HeartHandshake className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            HopeHarbor Setup Check
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Verifying Component C-01: Next.js App Router, Tailwind CSS, Theme Toggle & Sonner.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Theme Toggle Button */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Theme:</span>
            <ThemeToggle />
          </div>

          {/* Test Toast Button */}
          <button
            onClick={handleTestToast}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Test Toast
          </button>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Click the theme toggle to test dark mode, or click Test Toast to trigger a notification!
          </p>
        </div>
      </div>
    </main>
  );
}