'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  HeartHandshake,
  Calendar,
  PlusCircle,
  FolderKanban,
  BookmarkCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  React.useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Upcoming Events', href: '/events' },
  ];

  return (
    <header className={cn("fixed top-4 inset-x-3 sm:inset-x-0 z-50 mx-auto max-w-4xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl px-5 py-2.5 shadow-lg", isMobileMenuOpen ? "rounded-3xl" : "rounded-full")}>
      <div className="mx-auto h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Hope<span className="text-amber-500 dark:text-amber-400">Harbor</span>
            </span>
            <span className="hidden sm:block text-[9px] text-slate-600 dark:text-slate-400 tracking-wider font-medium uppercase mt-0.5">
              Community Action
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Conditional Auth Section */}
          {!hasMounted || isLoading ? (
            <div className="w-10 h-10 rounded-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          ) : user ? (
            /* Logged-In User Profile & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group relative flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/60 transition-all focus:outline-none"
                aria-label="User menu"
              >
                {/* Profile Picture Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500/30 bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 font-semibold text-sm">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200" />

                {/* Assignment Requirement: Display Name on Hover Tooltip */}
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:bg-slate-800 z-50">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-0 zoom-in-95">
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Private Route Links */}
                  <Link
                    href="/events/create"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-500" />
                    Create Event
                  </Link>

                  <Link
                    href="/events/manage"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 text-blue-500" />
                    Manage Events
                  </Link>

                  <Link
                    href="/events/joined"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    Joined Events
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    My Profile
                  </Link>

                  {/* Divider & Logout */}
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated: Show Login Button */
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-transparent px-1 pt-3 pb-2 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            {!hasMounted || isLoading ? (
              <div
                className="h-10 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
                aria-hidden="true"
              />
            ) : user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500/40 bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-300 font-semibold text-xs">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/events/create"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <PlusCircle className="w-4 h-4 text-amber-500" />
                  Create Event
                </Link>
                <Link
                  href="/events/manage"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <FolderKanban className="w-4 h-4 text-blue-500" />
                  Manage Events
                </Link>
                <Link
                  href="/events/joined"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <BookmarkCheck className="w-4 h-4 text-amber-500" />
                  Joined Events
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <UserIcon className="w-4 h-4 text-indigo-500" />
                  My Profile
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
