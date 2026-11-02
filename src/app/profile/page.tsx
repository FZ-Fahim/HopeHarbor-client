'use client';

import * as React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  FolderKanban,
  BookmarkCheck,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  stats: {
    organizedEvents: number;
    joinedEvents: number;
  };
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [name, setName] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${apiUrl}/api/users/profile`, {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
          setName(data.data.name || '');
          setImageUrl(data.data.image || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [apiUrl]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetch(`${apiUrl}/api/users/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Profile Updated Successfully!', {
          description: 'Your changes are now live across HopeHarbor.',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
        // Immediately sync with Navbar and Auth Context
        await refreshUser();
        if (profile) {
          setProfile({
            ...profile,
            name: name.trim(),
            image: imageUrl.trim(),
          });
        }
      } else {
        toast.error('Update Failed', {
          description: data.message || 'Could not update profile',
        });
      }
    } catch (err: unknown) {
      toast.error('Network Error', {
        description: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Volunteer Profile</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account & Impact
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile and view your community contributions.
          </p>
        </div>

        {/* Profile Card & Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Overview Card */}
          <div className="md:col-span-1 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-4 shadow-sm">
            {/* Avatar Preview */}
            <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500/20 bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-2xl font-bold">
              {imageUrl || user?.image ? (
                <img
                  src={imageUrl || user?.image}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                  }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {profile?.name || user?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-all mt-0.5">
                {profile?.email || user?.email}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Volunteer</span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Joined {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
              </span>
            </div>
          </div>

          {/* Impact Stats Counters */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile?.stats.organizedEvents || 0}
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Drives Organized
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Events hosted and managed by you
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile?.stats.joinedEvents || 0}
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Drives Joined
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Social drives you have pledged to attend
              </p>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Profile Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Update your display name and public avatar photo.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Email (Read Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Primary account emails cannot be modified.
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Paste any valid image URL (e.g. from Unsplash or GitHub avatar).
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" isLoading={isUpdating} size="md">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
