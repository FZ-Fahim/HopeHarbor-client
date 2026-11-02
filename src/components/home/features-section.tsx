import {
  Users,
  CalendarCheck2,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';

const features = [
  {
    icon: CalendarCheck2,
    title: 'Strict Future-Date Verification',
    description:
      'Every event is strictly scheduled for future dates with real-time countdowns, ensuring volunteers always know when and where to mobilize.',
  },
  {
    icon: Users,
    title: 'One-Click RSVP & Join Tracking',
    description:
      'Seamlessly join community cleanups, tree plantings, and donation camps. Keep track of all your joined causes directly in your personal dashboard.',
  },
  {
    icon: PackageCheck,
    title: 'Organized Social Logistics',
    description:
      'Coordinate warm clothes, blanket donations, saplings, and food parcels with clear location coordinates in Mirpur, Mohammadpur, and beyond.',
  },
  {
    icon: ShieldAlert,
    title: 'Organizer Ownership & Safety',
    description:
      'Verified community members can manage, update, or cancel their hosted events with strict permission guards and live attendee counters.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Built for Real Neighborhood Impact
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Everything grassroots changemakers need to gather community power, coordinate volunteers, and create lasting change.
          </p>
        </div>

        {/* Feature Cards Grid (Equal Heights) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-1 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}