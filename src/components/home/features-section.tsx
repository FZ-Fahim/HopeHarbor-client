import {
  CalendarCheck2,
  Check,
  Clock3,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';

const neighborhoods = ['Mirpur 10', 'Mohammadpur', 'Dhanmondi', 'Uttara'];

export function FeaturesSection() {
  return (
    <section className="bg-slate-50/60 dark:bg-[#0d131f] border-y border-slate-200/80 dark:border-slate-800 transition-colors px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            ☀️ Community Architecture
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Engineered for Real Grassroots Impact
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Everything volunteers and organizers need to coordinate drives without logistical friction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 sm:p-8 md:col-span-2">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-500/[0.06] blur-3xl transition-colors group-hover:bg-amber-500/10" />
            <div className="relative grid h-full gap-7 md:grid-cols-[1fr_0.95fr] md:items-center">
              <div className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Strict Future-Date Verification</h3>
                <p className="max-w-[48ch] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Drives are locked to upcoming timestamps, with real-time countdowns so every volunteer knows when it is time to show up.
                </p>
              </div>
              <div aria-label="Upcoming drive dates: November 6, November 8, and November 12" className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <span>Upcoming drives</span><span className="text-amber-400">Verified</span>
                </div>
                <div className="relative flex items-center justify-between gap-2">
                  <div className="absolute left-5 right-5 top-1/2 h-px bg-gradient-to-r from-amber-500/30 via-amber-400 to-orange-500/30" />
                  {['Nov 06', 'Nov 08', 'Nov 12'].map((date, index) => (
                    <div key={date} className="relative flex flex-col items-center gap-3">
                      <span className={`flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-slate-50 dark:ring-slate-950 ${index === 1 ? 'bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,.8)]' : 'bg-amber-500'}`} />
                      <span className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 sm:p-8">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">1-Click RSVP &amp; Join Tracking</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Join in an instant with duplicate prevention and a live count of the people showing up.
              </p>
            </div>
            <div className="mt-7 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4">
              <div className="flex -space-x-2.5" aria-hidden="true">
                {['bg-amber-300', 'bg-orange-400', 'bg-sky-400', 'bg-violet-400'].map((color, index) => <span key={index} className={`h-9 w-9 rounded-full border-[3px] border-slate-50 dark:border-slate-950 ${color}`} />)}
              </div>
              <span className="text-xs font-semibold text-slate-200">+22 Volunteers</span>
              <span className="relative flex h-2.5 w-2.5" aria-label="Active">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 sm:p-8">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Organizer Ownership &amp; Safety</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Strict creator-only editing and deletion guards keep each community drive in the right hands.
              </p>
            </div>
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">Organizer verified</p>
                <p className="mt-1 text-[11px] text-slate-500">Ownership protected</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-amber-300">
                <LockKeyhole className="h-3 w-3" /> <Check className="h-3 w-3" /> Verified
              </span>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 sm:p-8 md:col-span-2">
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-orange-500/[0.05] blur-3xl transition-colors group-hover:bg-orange-500/10" />
            <div className="relative grid h-full gap-7 md:grid-cols-[1fr_0.95fr] md:items-center">
              <div className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Grassroots Neighborhood Logistics</h3>
                <p className="max-w-[48ch] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Coordinate people and supplies with neighborhood details for Mirpur 10, Mohammadpur, Dhanmondi, and Uttara.
                </p>
              </div>
              <div className="flex flex-wrap content-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 sm:p-6">
                {neighborhoods.map((place) => (
                  <span key={place} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors group-hover:border-amber-500/20">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />{place}
                  </span>
                ))}
                <div className="mt-1 flex w-full items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <Clock3 className="h-3.5 w-3.5 text-amber-500" /> Local drives, coordinated together
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
