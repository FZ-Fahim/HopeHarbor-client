'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlignLeft,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Type,
  Users,
} from 'lucide-react';

const categories = ['Donation', 'Cleanup', 'Plantation', 'Healthcare', 'Education', 'Relief', 'Other'];
const fallbackImage = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';

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
  const [tomorrow, setTomorrow] = React.useState('');
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    setTomorrow(`${year}-${month}-${day}`);
  }, []);

  React.useEffect(() => setImageFailed(false), [thumbnailUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error('Title too short', { description: 'Event title must be at least 5 characters long.' });
      return;
    }
    if (!description.trim() || description.length < 20) {
      toast.error('Description too short', { description: 'Please describe the event in at least 20 characters.' });
      return;
    }
    if (!location.trim() || location.length < 3) {
      toast.error('Location required', { description: 'Please specify where this drive will take place.' });
      return;
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime()) || selectedDate.getTime() <= Date.now()) {
      toast.error('Invalid Event Date', { description: 'Event date must be in the future. Past dates cannot be added.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnailUrl: thumbnailUrl.trim() || fallbackImage,
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
          icon: <CheckCircle2 className="h-5 w-5 text-amber-500" />,
        });
        router.push('/events');
      } else {
        toast.error('Failed to create event', { description: data.message || 'Please check your inputs and try again.' });
      }
    } catch (err: unknown) {
      toast.error('Network Error', {
        description: err instanceof Error ? err.message : 'Could not communicate with the server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage = imageFailed || !thumbnailUrl.trim() ? fallbackImage : thumbnailUrl;
  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en', { month: 'short', day: '2-digit', year: 'numeric' })
    : 'Upcoming Date';
  const organizerInitial = user?.name?.trim().charAt(0).toUpperCase() || 'O';

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100';
  const labelClass = 'mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300';

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 transition-colors dark:bg-[#0a0e17] sm:pt-32">
        <div className="mx-auto max-w-7xl py-8 sm:py-12">
          <header className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-8 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                <CalendarPlus className="h-3.5 w-3.5" /> Organizer Studio
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Create a Community Drive</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Bring people together around a cause. Shape the details and see how your drive will appear to volunteers.
              </p>
            </div>
            <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex">
              <Sparkles className="h-4 w-4 text-amber-500" /> Made for meaningful local action
            </div>
          </header>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 sm:p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">01 / Event brief</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">The essentials</h2>
                  </div>
                  <span className="text-xs text-slate-400">* Required</span>
                </div>

                <div>
                  <label className={labelClass} htmlFor="event-title">Event title <span className="text-amber-600">*</span></label>
                  <div className="relative">
                    <Type className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input id="event-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Winter essentials for every family" className={`${inputClass} pl-11`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Choose a category <span className="text-amber-600">*</span></label>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Event category">
                    {categories.map((category) => (
                      <button key={category} type="button" onClick={() => setEventType(category)} aria-pressed={eventType === category}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${eventType === category ? 'border-amber-500 bg-amber-500 font-semibold text-slate-950 shadow-sm shadow-amber-500/20' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:text-white'}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="event-location">Location / venue <span className="text-amber-600">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <input id="event-location" type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Community hall, Dhaka" className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="event-date">Event date <span className="text-amber-600">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <input id="event-date" type="date" required min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} pl-11`} />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">Choose a date in the future.</p>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="thumbnail-url">Cover image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input id="thumbnail-url" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://…" className={`${inputClass} pl-11`} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">A community photo helps volunteers recognize your drive.</p>
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <label className={`${labelClass} mb-0`} htmlFor="event-description">Description & volunteer instructions <span className="text-amber-600">*</span></label>
                    <span className="shrink-0 text-xs text-slate-400">{description.length} characters</span>
                  </div>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <textarea id="event-description" required rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share the cause, what volunteers can expect, what to bring, and where to meet…" className={`${inputClass} resize-y pl-11 leading-relaxed`} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {user?.image ? <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-950">{organizerInitial}</span>}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Publishing as</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Community Organizer'}</p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-amber-500/20 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-slate-950/50 dark:text-amber-300">Verified organizer</span>
                </div>

                <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full rounded-full bg-amber-500 px-8 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 sm:w-auto sm:min-w-64">
                  <Sparkles className="mr-2 h-4 w-4" /> Publish community drive
                </Button>
              </form>
            </section>

            <aside className="lg:sticky lg:top-24 lg:col-span-5">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">02 / Preview</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Live Event Card Preview</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">What volunteers will see on the explore page</p>
                </div>
                <span className="mb-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" aria-label="Live preview" />
              </div>

              <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                  <img src={previewImage} alt="Community drive preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImageFailed(true)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex rounded-full border border-amber-500/30 bg-slate-950/75 px-3 py-1.5 text-[10px] font-bold text-amber-300 shadow-md backdrop-blur-md">{eventType}</span>
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">Community drive</span>
                </div>
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center text-slate-900 dark:text-white">
                      {date ? <><span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">{new Date(`${date}T12:00:00`).toLocaleDateString('en', { month: 'short' })}</span><span className="text-lg font-extrabold leading-none">{new Date(`${date}T12:00:00`).getDate()}</span></> : <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="mb-1.5 inline-flex rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">{eventType}</span>
                      <h3 className="break-words text-lg font-bold leading-snug text-slate-900 dark:text-white">{title.trim() || 'Untitled Community Drive'}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-600 dark:text-slate-400"><MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" /><span className="truncate">{location.trim() || 'Location to be announced'}</span></span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400"><Users className="h-3.5 w-3.5" /> 0 joined</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                    <div className="flex min-w-0 items-center gap-3">
                      {user?.image ? <img src={user.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-950">{organizerInitial}</span>}
                      <div className="min-w-0"><p className="text-[10px] text-slate-500 dark:text-slate-400">Hosted by</p><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Community Organizer'}</p></div>
                    </div>
                    <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">{dateLabel}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Volunteer spots</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Open to join</span>
                  </div>
                  <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-3 py-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">Community pledge welcome</span>
                </div>
              </article>
              <p className="mt-4 text-center text-xs text-slate-400">Your card updates as you edit the event details.</p>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
