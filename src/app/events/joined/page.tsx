'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { JoinedEventRecord } from '@/types';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookmarkCheck,
  Calendar,
  MapPin,
  ArrowUpRight,
  Clock,
  Compass,
} from 'lucide-react';

export default function JoinedEventsPage() {
  const [joinedEvents, setJoinedEvents] = React.useState<JoinedEventRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  React.useEffect(() => {
    async function fetchJoinedEvents() {
      try {
        const res = await fetch(`${apiUrl}/api/events/joined/me`, {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success) {
          setJoinedEvents(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load joined events:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJoinedEvents();
  }, [apiUrl]);

  // Helper to calculate days remaining until event
  const getDaysRemainingText = (eventDateStr: string) => {
    const eventDate = new Date(eventDateStr);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Happening Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 dark:bg-[#0a0e17] transition-colors">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Volunteer Schedule</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Joined Community Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All social drives and relief camps you have registered to attend, chronologically sorted by date.
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        )}

        {/* Joined Events Grid */}
        {!isLoading && joinedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((record) => {
              const event = record.event;
              if (!event) return null;

              const daysRemaining = getDaysRemainingText(event.date);

              return (
                <div
                  key={record._id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden hover:border-amber-500/40 transition-all duration-200 group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={event.thumbnailUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-amber-600 dark:text-amber-400 shadow-sm backdrop-blur-sm">
                          {event.eventType}
                        </span>
                      </div>

                      {/* Countdown Pill */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${new Date(event.date).getTime() - Date.now() <= 3 * 86400000 ? 'bg-orange-600 text-white' : 'bg-slate-900/80 border border-amber-500/30 text-amber-300'}`}>
                          {daysRemaining}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center shrink-0 text-center">
                          <span className="text-[10px] font-black text-amber-500 dark:text-amber-400 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {event.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>RSVP on {formatDate(record.joinedAt)}</span>
                      </div>

                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && joinedEvents.length === 0 && (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Drives Joined Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven&apos;t joined any social events yet. Discover upcoming blanket drives, cleanups, and tree plantation events near you!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              Explore Upcoming Events
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
