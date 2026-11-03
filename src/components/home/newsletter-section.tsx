'use client';

import * as React from 'react';
import { CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address to receive updates.',
      });
      return;
    }

    // UI-only subscription with toast notification
    setIsSubscribed(true);
    toast.success('Thank you for subscribing!', {
      description: 'You will receive weekly alerts on upcoming relief drives in your area.',
      icon: <CheckCircle2 className="h-5 w-5 text-amber-500" />,
    });
    setEmail('');
  };

  return (
    <section className="bg-white dark:bg-[#0a0e17] transition-colors py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden bg-slate-900 dark:bg-[#111827] border border-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-orange-500/[0.06] blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>📬 Weekly Neighborhood Digest</span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Never Miss an Urgent Relief Drive{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Near You</span>
            </h2>

            <p className="text-sm leading-relaxed text-slate-400">
              Direct notifications for winter blanket collections, medical screening camps, and tree drives in your area.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col items-center gap-2.5 pt-2 sm:flex-row">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-4 h-4 w-4 text-slate-500" aria-hidden="true" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full shrink-0 cursor-pointer rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:bg-amber-400 sm:w-auto"
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>

            <p className="pt-1 text-[11px] text-slate-500">
              No spam, ever. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
