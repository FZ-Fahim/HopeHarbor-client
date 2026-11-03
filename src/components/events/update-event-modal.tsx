'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { EventItem } from '@/types';
import { toast } from 'sonner';
import { CheckCircle2, Image as ImageIcon, Loader2, Pencil, Sparkles } from 'lucide-react';

interface UpdateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onUpdated: (updatedEvent: EventItem) => void;
}

const categories = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief',
  'Other',
];

export function UpdateEventModal({
  isOpen,
  onClose,
  event,
  onUpdated,
}: UpdateEventModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [eventType, setEventType] = React.useState('Donation');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [thumbnailUrl, setThumbnailUrl] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [thumbnailFailed, setThumbnailFailed] = React.useState(false);

  // Pre-fill form when event changes
  React.useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setEventType(event.eventType || 'Donation');
      setLocation(event.location || '');
      setThumbnailUrl(event.thumbnailUrl || '');
      setThumbnailFailed(false);
      if (event.date) {
        setDate(new Date(event.date).toISOString().split('T')[0]);
      }
    }
  }, [event]);

  // Strict minimum date is tomorrow
  const minDate = React.useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }
    if (description.trim().length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime()) || selectedDate.getTime() <= Date.now()) {
      toast.error('Event date must be in the future');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventType,
        location: location.trim(),
        thumbnailUrl: thumbnailUrl.trim() || event.thumbnailUrl,
        date: selectedDate.toISOString(),
      };

      const res = await fetch(`${apiUrl}/api/events/${event._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Event Updated Successfully!', {
          description: `Changes to "${title}" have been saved.`,
          icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
        });
        onUpdated(data.data);
        onClose();
      } else {
        toast.error('Update Failed', {
          description: data.message || 'Could not update event',
        });
      }
    } catch (err: unknown) {
      toast.error('Network Error', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500"><Sparkles className="h-4 w-4" /><Pencil className="h-3 w-3 -ml-1" /></span><span>Edit Drive Details</span></span>}
      description="Update schedule, venue, or volunteer requirements"
      className="rounded-3xl"
    >
      <form onSubmit={handleUpdate} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date * (Future Only)
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thumbnail URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => { setThumbnailUrl(e.target.value); setThumbnailFailed(false); }}
                className="min-w-0 flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center" aria-label="Thumbnail preview">
                {thumbnailUrl && !thumbnailFailed ? <img src={thumbnailUrl} alt="Thumbnail preview" className="h-full w-full object-cover" onError={() => setThumbnailFailed(true)} /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
