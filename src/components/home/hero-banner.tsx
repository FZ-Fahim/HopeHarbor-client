'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { EventItem } from '@/types';
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';

const defaultThumbnail =
  'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=85';
const communityThumbnail =
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85';

function getCountdown(date: string) {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  if (!Number.isFinite(days) || days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

const quickFilters = [
  { label: '🧥 Winter Clothes', href: '/events?category=Donation' },
  { label: '🧣 Blanket Relief', href: '/events?search=Blanket' },
  { label: '🌱 Tree Plantation', href: '/events?category=Plantation' },
  { label: '🩺 Medical Camps', href: '/events?category=Healthcare' },
];

export function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [featuredEvent, setFeaturedEvent] = React.useState<EventItem | null>(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = React.useState(true);
  const [thumbnailFailed, setThumbnailFailed] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchFeaturedEvent() {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
      try {
        const response = await fetch(`${apiUrl}/api/events/recent`, { cache: 'no-store' });
        const data = await response.json();
        if (isMounted && data.success) {
          setFeaturedEvent(data.data?.[0] || null);
        }
      } catch (error) {
        console.error('Failed to load featured event:', error);
      } finally {
        if (isMounted) setIsLoadingFeatured(false);
      }
    }

    fetchFeaturedEvent();
    return () => { isMounted = false; };
  }, []);

  React.useEffect(() => setThumbnailFailed(false), [featuredEvent?.thumbnailUrl]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/events?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-white dark:bg-[#0a0e17] transition-colors px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12),transparent_68%)]" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07),transparent_68%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[58fr_42fr] lg:gap-10 xl:gap-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 sm:text-sm">
              <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span>☀️ Grassroots Social Care &amp; Winter Relief</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Turn Compassion Into{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Community Action.
              </span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Bring neighbors together for winter clothes and blanket relief in
              Mohammadpur and Mirpur 10, plant trees across the city, and make
              care easier to find where it is needed most.
            </p>

            <div className="space-y-4 pt-1">
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2 shadow-2xl shadow-black/10 dark:shadow-black/20 backdrop-blur-xl focus-within:ring-2 focus-within:ring-amber-500 sm:flex-row sm:items-center sm:rounded-full"
                role="search"
              >
                <label htmlFor="hero-drive-search" className="sr-only">
                  Search community drives
                </label>
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                  <Search className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                  <input
                    id="hero-drive-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search drives, neighborhoods, causes..."
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Find Drives
                </button>
              </form>

              <div className="flex flex-wrap gap-2" aria-label="Popular drive searches">
                {quickFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    href={filter.href}
                    className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:text-sm"
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/20 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Browse All Events
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/events/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:border-amber-500/40 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <HeartHandshake className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Host a Community Drive
              </Link>
            </div>
          </div>

          <article className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-500/30 sm:p-5">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="relative">
              {isLoadingFeatured ? (
                <div className="relative aspect-[16/9] animate-pulse overflow-hidden rounded-2xl bg-slate-800" aria-label="Loading featured event">
                  <div className="absolute left-3 top-3 h-7 w-36 rounded-full bg-slate-700" />
                  <div className="absolute bottom-3 right-3 h-7 w-20 rounded-full bg-slate-700" />
                  <div className="absolute inset-x-5 bottom-5 h-5 rounded bg-slate-700/70" />
                </div>
              ) : <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-800">
                <img
                  src={thumbnailFailed ? communityThumbnail : (featuredEvent?.thumbnailUrl || defaultThumbnail)}
                  onError={(event) => {
                    if (!thumbnailFailed) setThumbnailFailed(true);
                    else event.currentTarget.src = defaultThumbnail;
                  }}
                  alt={featuredEvent?.title || 'Community relief campaign'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  {featuredEvent?.eventType || 'Active Relief Campaign'}
                </div>
                <div className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  {featuredEvent ? getCountdown(featuredEvent.date) : 'In 3 days'}
                </div>
              </div>}

              {isLoadingFeatured ? (
                <div className="animate-pulse space-y-4 pt-5" aria-hidden="true">
                  <div className="h-4 w-2/3 rounded bg-slate-700/60" />
                  <div className="h-3 w-1/3 rounded bg-slate-700/60" />
                  <div className="h-12 rounded bg-slate-700/60" />
                  <div className="h-2 rounded-full bg-slate-700/60" />
                  <div className="h-11 rounded-full bg-slate-700/60" />
                </div>
              ) : <div className="space-y-4 pt-5">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <span>{featuredEvent?.eventType || 'Donation'}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{featuredEvent?.location || 'Mohammadpur, Dhaka'}</span>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
                    Featured Drive of the Week
                  </p>
                  <h2 className="text-xl font-bold leading-snug text-slate-900 dark:text-white sm:text-2xl">
                    {featuredEvent?.title || 'Winter Blanket Distribution for Homeless Families'}
                  </h2>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    <span>{featuredEvent ? `${featuredEvent.attendeesCount || 0} of 30 volunteers pledged` : '22 of 30 volunteers pledged'}</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-300">{featuredEvent ? Math.min(100, Math.round(((featuredEvent.attendeesCount || 0) / 30) * 100)) : 73}%</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-slate-800"
                    role="progressbar"
                    aria-label="Volunteer pledges"
                    aria-valuemin={0}
                    aria-valuemax={30}
                    aria-valuenow={featuredEvent ? Math.min(30, featuredEvent.attendeesCount || 0) : 22}
                  >
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-700" style={{ width: `${featuredEvent ? Math.min(100, Math.round(((featuredEvent.attendeesCount || 0) / 30) * 100)) : 73}%` }} />
                  </div>
                </div>

                <Link
                  href={featuredEvent ? `/events/${featuredEvent._id}` : '/events'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-bold text-amber-300 transition-colors hover:bg-amber-500 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  View Drive Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>}
            </div>
          </article>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800/80 pt-6 sm:mt-14 sm:pt-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <Users2 className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-600 dark:text-slate-400"><strong className="mr-1.5 text-lg font-bold text-amber-600 dark:text-amber-300">1,400+</strong>Active Volunteers</p>
            </div>
            <div className="flex items-center justify-center gap-3 sm:justify-center">
              <MapPin className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-600 dark:text-slate-400"><strong className="mr-1.5 text-lg font-bold text-amber-600 dark:text-amber-300">18+</strong>City Neighborhoods</p>
            </div>
            <div className="flex items-center justify-center gap-3 sm:justify-end">
              <ShieldCheck className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-600 dark:text-slate-400"><strong className="mr-1.5 text-lg font-bold text-amber-600 dark:text-amber-300">100%</strong>Direct Community Verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
