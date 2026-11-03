'use client';

import * as React from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';
import { EventCard } from '@/components/event-card';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { CalendarDays, ArrowRight, HeartHandshake } from 'lucide-react';

export function RecentEventsSection() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRecentEvents() {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const apiUrl = rawUrl.replace(/\/+$/, '');
        const res = await fetch(`${apiUrl}/api/events/recent`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success) {
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load recent events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentEvents();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Immediate Needs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Upcoming Events
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Nearest community drives scheduled by local organizers. Step forward to donate, volunteer, or lead.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shrink-0"
          >
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons State (6 Skeletons) */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Loaded Events Grid */}
        {!isLoading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* Empty State if No Events Added Yet */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Upcoming Drives Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Be the first community leader to organize a winter clothes drive, cleanup, or medical camp!
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              Create First Event
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}