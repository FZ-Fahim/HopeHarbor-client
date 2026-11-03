'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { EventItem, EventCategory } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  CalendarPlus,
  Check,
  CheckSquare,
  Copy,
  ExternalLink,
} from 'lucide-react';

// Category-based dynamic guidelines
const volunteerChecklists: Record<EventCategory, string[]> = {
  Donation: [
    'Clean, washed, and size-labeled garments or blankets',
    'Sturdy cardboard cartons or breathable collection bags',
    'Enthusiasm to assist families with respectful distribution',
  ],
  Cleanup: [
    'Thick rubber or protective gardening gloves',
    'Closed-toe durable shoes or rubber boots',
    'Reusable personal water bottle to stay hydrated',
  ],
  Plantation: [
    'Small garden trowel or hand shovel (if available)',
    'Comfortable clothes that can get a little soil on them',
    'Sun protection (cap, hat, or sunscreen)',
  ],
  Healthcare: [
    'Medical or nursing identification (if clinical volunteer)',
    'Personal hand sanitizer and face masks',
    'Notepad and pen for patient vitals record-keeping',
  ],
  Education: [
    'Donation items (children storybooks, stationery, color pencils)',
    'Patience, warm smile, and readiness to read with kids',
    'Comfortable outdoor seating mats (optional)',
  ],
  Relief: [
    'Packing tape, markers, and box cutters for parcel packing',
    'Stamina for assembly line packaging and lifting',
    'Valid government or student ID for warehouse access',
  ],
  Other: [
    'Personal reusable water bottle',
    'Arrival 15 minutes before the scheduled kickoff',
    'Commitment to neighborhood cooperation and safety',
  ],
};

export default function EventDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = React.useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasJoined, setHasJoined] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = React.useState(false);
  const [volunteers, setVolunteers] = React.useState<{ _id: string; userName: string; userEmail: string; joinedAt: string }[]>([]);

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

  // 1. Fetch Event Details
  React.useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await fetch(`${apiUrl}/api/events/${id}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          setEvent(data.data);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchEventDetails();
  }, [id, apiUrl]);

  const fetchVolunteers = React.useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`${apiUrl}/api/events/${id}/volunteers`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVolunteers(data.data);
      }
    } catch (err) {
      console.error('Failed to load confirmed volunteers:', err);
    }
  }, [id, apiUrl]);

  React.useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // 2. Check Join Status for logged-in user
  React.useEffect(() => {
    async function checkJoinStatus() {
      if (!user || !id) return;
      try {
        const res = await fetch(`${apiUrl}/api/events/${id}/join-status`, { credentials: 'include' });
        const data = await res.json();
      if (data.success) setHasJoined(Boolean(data.hasJoined));
      } catch (err) {
        console.error('Error checking join status:', err);
      }
    }
    checkJoinStatus();
  }, [id, user, apiUrl]);

  // 3. Handle Join Event Action
  const handleJoinEvent = async () => {
    if (!user) {
      toast.info('Login required', {
        description: 'Please sign in to join community drives and track your attendance.',
      });
      router.push(`/login?returnUrl=/events/${id}`);
      return;
    }

    if (hasJoined || isOrganizer) return;
    setIsJoining(true);

    try {
      const res = await fetch(`${apiUrl}/api/events/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHasJoined(true);
        if (event) {
          setEvent({ ...event, attendeesCount: (event.attendeesCount || 0) + 1 });
        }
        await fetchVolunteers();
        toast.success('Successfully pledged to volunteer!', {
          description: `You are officially registered for ${event?.title}!`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      } else {
        toast.error('Unable to join', { description: data.message || 'Something went wrong' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to the server';
      toast.error('Network Error', { description: message });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user || !event || !hasJoined || isLeaving) return;
    setIsLeaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/events/${id}/join`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasJoined(false);
        setEvent((current) => current ? { ...current, attendeesCount: Math.max(0, (current.attendeesCount || 0) - 1) } : current);
        await fetchVolunteers();
        toast.success('You have left this initiative');
      } else {
        toast.error('Unable to leave', { description: data.message || 'Something went wrong' });
      }
    } catch (err: unknown) {
      toast.error('Network Error', { description: err instanceof Error ? err.message : 'Failed to connect to the server' });
    } finally {
      setIsLeaving(false);
    }
  };

  // 4. Feature: Generate Google Calendar Link
  const handleAddToCalendar = () => {
    if (!event) return;
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // +3 hours default duration

    const formatGoogleDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&details=${encodeURIComponent(
      `${event.description}\n\nOrganized by: ${event.organizerName} on HopeHarbor`
    )}&location=${encodeURIComponent(event.location)}&dates=${formatGoogleDate(
      startDate
    )}/${formatGoogleDate(endDate)}`;

    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    toast.success('Calendar Link Opened', {
      description: 'Review and save the drive to your Google Calendar.',
    });
  };

  // 5. Feature: Share Controls
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied!', {
        description: 'Share this drive with friends and neighbors.',
      });
      setIsShareMenuOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join this community initiative: ${event.title} at ${event.location}!`,
          url: window.location.href,
        });
        setIsShareMenuOpen(false);
      } catch (err) {
        // User canceled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Skeleton Loader State
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="w-full h-80 sm:h-96 rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Not Found State
  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-2xl font-bold">
          404
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Event Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          This community drive might have been canceled or the link is incorrect.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  const checklistItems = volunteerChecklists[event.eventType] || volunteerChecklists.Other;
  const isOrganizer = Boolean(user && ((event as EventItem & { organizerId?: string }).organizerId === user.id || event.organizerEmail?.toLowerCase() === user.email?.toLowerCase()));

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Bar: Back & Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upcoming Events
        </Link>

        {/* Share & Calendar Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleAddToCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            title="Add this drive to your Google Calendar"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add to Calendar</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Share</span>
            </button>

            {/* Share Popover Menu */}
            {isShareMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-30 space-y-1">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Join me for "${event.title}" at ${event.location}: ${window.location.href}`
                    )}`;
                    window.open(url, '_blank');
                    setIsShareMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                  Share to WhatsApp
                </button>
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  More Options...
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <main className="lg:col-span-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm backdrop-blur-md">
        {/* Banner Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden">
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 shadow-md backdrop-blur-md">
              {event.eventType}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white tracking-[-0.045em] leading-[1.05]">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  {event.attendeesCount || 0} Volunteers Registered
                </span>
              </div>
            </div>

            {/* Organizer and volunteer actions */}
            <div className="shrink-0">
              {isOrganizer ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                    <CheckCircle2 className="w-4 h-4" />
                    You are the Host of this Drive
                  </span>
                  <Link
                    href="/events/manage"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-2.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    Manage Drive
                  </Link>
                </div>
              ) : hasJoined ? (
                <Button
                  onClick={handleLeaveEvent}
                  disabled={isLeaving}
                  isLoading={isLeaving}
                  variant="outline"
                  size="lg"
                  className="group w-full border-emerald-300 bg-emerald-50 text-emerald-700 shadow-md transition-colors hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:border-rose-500 dark:hover:text-rose-400 md:w-auto"
                >
                  <span className="flex items-center gap-2 group-hover:hidden">
                    <CheckCircle2 className="w-5 h-5" />
                    Joined ✓
                  </span>
                  <span className="hidden group-hover:inline">Click to Leave</span>
                </Button>
              ) : (
                <Button
                  onClick={handleJoinEvent}
                  disabled={isJoining}
                  isLoading={isJoining}
                  variant="primary"
                  size="lg"
                  className="w-full bg-amber-500 shadow-md hover:bg-amber-600 focus:ring-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600 md:w-auto"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Join This Event
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              About This Community Initiative
            </h2>
            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Volunteer Guidelines & What to Bring */}
          <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/[0.04] p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <CheckSquare className="w-4 h-4" />
              <h3>Volunteer Checklist & What to Bring ({event.eventType})</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {checklistItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <aside className="lg:col-span-4 space-y-6">
        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm backdrop-blur-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-5">Initiative Organizer</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-lg">
              {(event.organizerName || 'C').trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate">{event.organizerName || 'Community Member'}</p>
              <a href={`mailto:${event.organizerEmail}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 break-all">{event.organizerEmail}</a>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
            <CheckCircle2 className="w-4 h-4" /> Verified Community Organizer
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" />Created {formatDate(event.createdAt)}</p>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Confirmed Volunteers</h2>
            <span className="rounded-full bg-amber-100 dark:bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">{volunteers.length > 0 ? volunteers.length : (event?.attendeesCount || 0)}</span>
          </div>
          {volunteers.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {volunteers.map((volunteer) => (
                <li key={volunteer._id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    {(volunteer.userName || 'V').trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{volunteer.userName || 'Neighbor'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Joined {formatDate(volunteer.joinedAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">No volunteers have pledged yet. Be the first neighbor to join!</p>
          )}
        </section>
      </aside>
      </div>
    </div>
  );
}
