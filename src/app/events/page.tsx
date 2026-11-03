'use client';

import * as React from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';
import { EventCard } from '@/components/event-card';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { EventFilterBar } from '@/components/events/event-filter-bar';
import { CalendarDays, PlusCircle, SearchX } from 'lucide-react';

export default function UpcomingEventsPage() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Fetch upcoming events from backend
  const fetchEvents = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await fetch(`${apiUrl}/api/events/upcoming?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load upcoming events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory]);

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Community Service Schedule</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore and participate in active social service drives across Dhaka and surrounding neighborhoods. Only verified future events are listed.
          </p>
        </div>

        <Link
          href="/events/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Host an Event
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <EventFilterBar
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalCount={events.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && events.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch' : 'flex flex-col gap-4'}>
          {events.map((event) => (
            <EventCard key={event._id} event={event} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* No Events Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Upcoming Events Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {search || selectedCategory !== 'All'
              ? 'No events match your current filter criteria. Try clearing filters or searching another keyword.'
              : 'There are currently no upcoming events scheduled. Be the first to create one!'}
          </p>
          {(search || selectedCategory !== 'All') ? (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create an Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
