'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HeartHandshake,
  CalendarDays,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users2,
  MapPin,
  Search,
} from 'lucide-react';

const quickFilters = [
  { label: '❄️ Winter Clothes', href: '/events?category=Donation' },
  { label: '🧤 Blanket Relief', href: '/events?search=Blanket' },
  { label: '🌱 Tree Plantation', href: '/events?category=Plantation' },
  { label: '🧹 Canal Cleanup', href: '/events?category=Cleanup' },
  { label: '🩺 Health Camps', href: '/events?category=Healthcare' },
];

export function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/events?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Winter Relief &amp; Community Drives Live Now</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Turn Compassion Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Neighborhood Action
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            HopeHarbor unites volunteers, neighbors, and grassroots organizers to coordinate blanket distributions in Mohammadpur, winter warmth drives in Mirpur, urban tree plantations, and emergency relief across Bangladesh.
          </p>

          <div className="pt-2">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2 p-2 max-w-3xl mx-auto rounded-2xl sm:rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/85 shadow-xl shadow-emerald-950/5 dark:shadow-black/20 backdrop-blur-xl focus-within:ring-2 focus-within:ring-emerald-500/60"
              role="search"
            >
              <label htmlFor="hero-drive-search" className="sr-only">Search community drives</label>
              <div className="flex items-center flex-1 min-w-0 gap-3 px-4">
                <Search className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <input
                  id="hero-drive-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search neighborhood drives (e.g. Mirpur, blankets, cleanup)..."
                  className="w-full min-w-0 py-3 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Find Drives
              </button>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Popular drive searches">
              {quickFilters.map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className="inline-flex items-center px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/75 dark:bg-slate-900/70 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200/80 dark:border-emerald-800/70 bg-white/65 dark:bg-slate-900/60 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>Active volunteer drives across Dhaka</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <CalendarDays className="w-4 h-4" />
              Explore Upcoming Drives
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/events/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              Host a Community Drive
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5 rounded-2xl border border-white/70 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/55 px-4 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Users2 className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">1,400+</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Active Volunteers</p>
            </div>

            <div className="flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5 rounded-2xl border border-white/70 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/55 px-4 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">18+</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Neighborhoods Served</p>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Mirpur, Mohammadpur, Dhanmondi, Uttara &amp; more</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5 rounded-2xl border border-white/70 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/55 px-4 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">100%</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Community Verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
