'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { EventItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateEventModal } from '@/components/events/update-event-modal';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import {
  FolderKanban,
  PlusCircle,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Eye,
  AlertTriangle,
  HandHeart,
  Clock3,
} from 'lucide-react';

export default function ManageEventsPage() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Update modal state
  const [selectedEventForEdit, setSelectedEventForEdit] = React.useState<EventItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Delete modal state
  const [eventToDelete, setEventToDelete] = React.useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const upcomingEvent = React.useMemo(() => events
    .filter((event) => new Date(event.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0], [events]);
  const totalPledges = events.reduce((total, event) => total + (event.attendeesCount || 0), 0);

  const fetchMyEvents = React.useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/events/user/my-events`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load my events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMyEvents();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchMyEvents]);

  // Open edit modal
  const handleEditClick = (event: EventItem) => {
    setSelectedEventForEdit(event);
    setIsEditModalOpen(true);
  };

  // Callback when event is updated
  const handleEventUpdated = (updatedEvent: EventItem) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
    );
  };

  // Perform Delete
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${apiUrl}/api/events/${eventToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
        toast.success('Event Deleted', {
          description: `"${eventToDelete.title}" has been deleted.`,
        });
        setEventToDelete(null);
      } else {
        toast.error('Deletion Failed', {
          description: data.message || 'Could not delete event.',
        });
      }
    } catch (err: unknown) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 dark:bg-[#0a0e17] transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>ORGANIZER DASHBOARD</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Community Initiatives
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update details, monitor attendee registration, or cancel drives organized by you.
            </p>
          </div>

          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-sm transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Host Another Event
          </Link>
        </div>

        {!isLoading && (
          <section aria-label="Organizer overview" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><FolderKanban className="w-4 h-4 text-amber-500" /> Total Drives Hosted</div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{events.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><HandHeart className="w-4 h-4 text-amber-500" /> Total Volunteer Pledges</div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{totalPledges}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Clock3 className="w-4 h-4 text-amber-500" /> Next Upcoming Date</div>
              <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">{upcomingEvent ? formatDate(upcomingEvent.date) : 'No upcoming drives'}</p>
            </div>
          </section>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Events Table / Card List */}
        {!isLoading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-sm"
              >
                {/* Event Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-16 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex flex-col items-center justify-center shrink-0 text-center">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img
                      src={event.thumbnailUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        {event.eventType}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {event.attendeesCount || 0} Joined
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: View, Edit, Delete */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/events/${event._id}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleEditClick(event)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Update</span>
                  </button>

                  <button
                    onClick={() => setEventToDelete(event)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Events Created Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven&apos;t created any community events. Organize a clothes distribution or cleanup today!
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Host an Event
            </Link>
          </div>
        )}

        {/* Update Event Modal */}
        <UpdateEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          event={selectedEventForEdit}
          onUpdated={handleEventUpdated}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(eventToDelete)}
          onClose={() => setEventToDelete(null)}
          title="Delete Event Confirmation"
          description="This action cannot be undone. All volunteer join records for this drive will be deleted."
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 dark:text-rose-300">
                Are you sure you want to delete{' '}
                <strong>&quot;{eventToDelete?.title}&quot;</strong>?
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
              >
                Keep Event
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
