import Link from 'next/link';
import { EventItem } from '@/types';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
}

function getUrgencyBadge(dateStr: string) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  const eventDay = Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((eventDay - todayDay) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { text: 'Happening Today', urgent: true };
  if (diffDays === 1) return { text: 'Tomorrow', urgent: true };
  if (diffDays <= 3) return { text: `In ${diffDays} days`, urgent: true };
  if (diffDays <= 7) return { text: 'This Week', urgent: false };
  return { text: 'Upcoming', urgent: false };
}

export function EventCard({ event, viewMode = 'grid' }: EventCardProps) {
  const urgency = getUrgencyBadge(event.date);
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleDateString('en', { month: 'short' }).toUpperCase();
  const day = eventDate.toLocaleDateString('en', { day: '2-digit' });

  return (
    <article
      className={`group overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-black/20 ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex h-full flex-col'
      }`}
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-slate-800 ${viewMode === 'list' ? 'sm:aspect-auto sm:w-64 sm:shrink-0' : 'w-full'}`}>
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        <div className="absolute right-3 top-3">
          <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold shadow-md backdrop-blur-md ${urgency.urgent ? 'bg-orange-600 text-white' : 'border border-amber-500/30 bg-slate-900/80 text-amber-300'}`}>
            {urgency.text}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-white text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">{month}</span>
            <span className="text-lg font-extrabold leading-none">{day}</span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="mb-1.5 inline-flex max-w-full truncate rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              {event.eventType}
            </span>
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-300 sm:text-lg">
              {event.title}
            </h3>
          </div>
        </div>

        {viewMode === 'list' && event.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{event.description}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="truncate">{event.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-amber-700 dark:text-amber-400">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {event.attendeesCount || 0} Joined
            </span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span>View Event</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
