'use client';

import * as React from 'react';
import { Search, Filter, X, LayoutGrid, List, CalendarDays } from 'lucide-react';

interface EventFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  totalCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
}

const categories = [
  'All',
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief',
  'Other',
];

export function EventFilterBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  totalCount,
  viewMode,
  setViewMode,
}: EventFilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drives by title, area (e.g. Mirpur, Mohammadpur)..."
            className="w-full pl-10 pr-9 py-3 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-2xl text-sm transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="inline-flex self-end sm:self-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-1" role="group" aria-label="Event view mode">
          <button type="button" onClick={() => setViewMode('grid')} className="hidden sm:inline-flex items-center gap-1.5 px-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"><CalendarDays className="w-4 h-4"/>Calendar</button>
          <button type="button" onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'} className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setViewMode('list')} aria-label="List view" aria-pressed={viewMode === 'list'} className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Category Dropdown (Mobile View) */}
        <div className="sm:hidden relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills (Tablet & Desktop) */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-bold">{totalCount}</strong> upcoming community {totalCount === 1 ? 'drive' : 'drives'}
        </span>
        {(search || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="text-amber-400 hover:text-amber-300 font-medium hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
