import Link from 'next/link';
import {
  HeartHandshake,
  CalendarDays,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users2,
  MapPin,
} from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Cause Highlight Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Winter Relief & Community Drives Live Now</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Turn Compassion Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Neighborhood Action
            </span>
          </h1>

          {/* Realistic Community Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            HopeHarbor unites volunteers, neighbors, and grassroot organizers to coordinate blanket distributions in Mohammadpur, winter warmth drives in Mirpur, urban tree plantations, and emergency relief across Bangladesh.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <CalendarDays className="w-4 h-4" />
              Explore Upcoming Drives
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/events/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              Host a Community Drive
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="pt-10 grid grid-cols-3 gap-4 border-t border-slate-200/60 dark:border-slate-800/60 mt-10">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Users2 className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  1,400+
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Active Volunteers
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  18+
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                City Locations
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Direct Impact
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}