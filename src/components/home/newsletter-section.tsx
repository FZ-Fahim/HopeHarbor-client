'use client';

import * as React from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
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
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    });
    setEmail('');
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          {/* Subtle Background Circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Weekly Local Impact Digest</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Stay Informed on Neighborhood Drives
            </h2>

            <p className="text-sm text-emerald-100 leading-relaxed">
              Get notified whenever a blanket distribution, winter clothes collection, or emergency relief camp is scheduled near you.
            </p>

            {/* Subscription Form */}
            <form
              onSubmit={handleSubmit}
              className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>

            <p className="text-[11px] text-emerald-200/80 pt-1">
              No spam, ever. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}