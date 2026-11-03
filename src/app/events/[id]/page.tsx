import { Suspense } from 'react';
import EventDetailsClient from './event-details-client';

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<EventDetailsLoading />}>
      <EventDetailsClient />
    </Suspense>
  );
}

function EventDetailsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse" aria-label="Loading event details">
      <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="w-full h-80 sm:h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-40 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
