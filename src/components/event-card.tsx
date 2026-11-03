import Link from 'next/link';
import { EventItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
}

const categoryColors: Record<string, string> = {
  Donation: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Cleanup: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Plantation: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Healthcare: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Education: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Relief: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Other: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

// Helper: Calculate urgency badge
function getUrgencyBadge(dateStr: string) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  const eventDay = Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((eventDay - todayDay) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { text: 'Happening Today', urgent: true };
  if (diffDays === 1) return { text: 'Tomorrow', urgent: true };
  if (diffDays <= 3) return { text: `In ${diffDays} days (Urgent)`, urgent: true };
  if (diffDays <= 7) return { text: 'This Week', urgent: false };
  return { text: 'Upcoming', urgent: false };
}

export function EventCard({ event, viewMode = 'grid' }: EventCardProps) {
  const badgeStyle = categoryColors[event.eventType] || categoryColors.Other;
  const urgency = getUrgencyBadge(event.date);

  // ---------------- LIST VIEW LAYOUT ----------------
  if (viewMode === 'list') {
    return (
      <div className="group flex flex-col sm:flex-row items-stretch rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
        {/* Horizontal Thumbnail */}
        <div className="relative sm:w-64 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${badgeStyle}`}>
              {event.eventType}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md backdrop-blur-md ${urgency.urgent ? 'bg-rose-600 text-white' : 'bg-slate-900/80 text-white'}`}>
              {urgency.text}
            </span>
          </div>
        </div>

        {/* List Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.date)}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {event.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              {event.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {event.attendeesCount || 0} Joined
              </span>
            </div>

            <Link
              href={`/events/${event._id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <span>View Event</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DEFAULT GRID VIEW LAYOUT ----------------
  return (
    <div className="group flex flex-col h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-sm ${badgeStyle}`}>
            {event.eventType}
          </span>
        </div>

        {/* Urgency timing badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md backdrop-blur-md ${
              urgency.urgent
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900/80 dark:bg-slate-800/80 text-white'
            }`}
          >
            {urgency.text}
          </span>
        </div>
      </div>

      {/* Card Content (Equal Heights) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              {event.attendeesCount || 0} Joined
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* View Event Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/events/${event._id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-emerald-600 hover:border-emerald-600 text-slate-700 hover:text-white dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-emerald-600 dark:hover:border-emerald-600 dark:hover:text-white transition-all shadow-sm"
          >
            <span>View Event</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
