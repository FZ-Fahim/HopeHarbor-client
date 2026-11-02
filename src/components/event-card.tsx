import Link from 'next/link';
import { EventItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
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

export function EventCard({ event }: EventCardProps) {
  const badgeStyle = categoryColors[event.eventType] || categoryColors.Other;

  return (
    <div className="group flex flex-col h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
      {/* Thumbnail with Uniform Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image for invalid or broken URLs
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-sm ${badgeStyle}`}
          >
            {event.eventType}
          </span>
        </div>
      </div>

      {/* Card Content - flex-1 for strict equal heights */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Date & Attendees Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {event.attendeesCount || 0} Joined
            </span>
          </div>

          {/* Title - Fixed height with 2-line clamp */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>

          {/* Location */}
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