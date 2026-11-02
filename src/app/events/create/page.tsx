'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  CalendarPlus,
  Type,
  AlignLeft,
  Tag,
  Image as ImageIcon,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const categories = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief',
  'Other',
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [eventType, setEventType] = React.useState('Donation');
  const [thumbnailUrl, setThumbnailUrl] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Set the minimum date after mount so the current time is not read during prerendering.
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    if (dateInputRef.current) {
      dateInputRef.current.min = `${year}-${month}-${day}`;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-Side Validations
    if (!title.trim() || title.length < 5) {
      toast.error('Title too short', {
        description: 'Event title must be at least 5 characters long.',
      });
      return;
    }

    if (!description.trim() || description.length < 20) {
      toast.error('Description too short', {
        description: 'Please describe the event in at least 20 characters.',
      });
      return;
    }

    if (!location.trim() || location.length < 3) {
      toast.error('Location required', {
        description: 'Please specify where this drive will take place.',
      });
      return;
    }

    // STRICT ASSIGNMENT REQUIREMENT: Future date verification
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime()) || selectedDate.getTime() <= Date.now()) {
      toast.error('Invalid Event Date', {
        description: 'Event date must be in the future. Past dates cannot be added.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnailUrl:
          thumbnailUrl.trim() ||
          'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
        location: location.trim(),
        date: selectedDate.toISOString(),
      };

      const res = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Event Created Successfully!', {
          description: `"${title}" has been published to Upcoming Events.`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
        // Assignment requirement: Redirect to Upcoming Events page
        router.push('/events');
      } else {
        toast.error('Failed to create event', {
          description: data.message || 'Please check your inputs and try again.',
        });
      }
    } catch (err: unknown) {
      toast.error('Network Error', {
        description: err instanceof Error ? err.message : 'Could not communicate with the server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Organizer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Host a Community Drive
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Fill in the details below to publish your winter clothing drive, canal cleanup, or medical camp.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Event Title *
              </label>
              <div className="relative">
                <Type className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Blanket Distribution for the Needy"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event Type Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Event Category *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Location / Venue *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Event Date & Strict Future Date Lock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Event Date * (Must be in the future)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    ref={dateInputRef}
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Past dates cannot be selected.
                </p>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Thumbnail Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave blank to use a default high-quality community photo.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Description & Volunteer Instructions *
              </label>
              <div className="relative">
                <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the cause, what volunteers should bring, target beneficiary count, and assembly point instructions (min 20 characters)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Creator Attribution Note */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>
                Publishing as: <strong className="text-emerald-700 dark:text-emerald-300">{user?.name}</strong> ({user?.email})
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                Verified Organizer
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Publish Community Event
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
