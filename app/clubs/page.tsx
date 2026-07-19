"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { ClubCard } from "@/components/clubs";
import type { Club } from "@/lib/types/club";
import { useClubs, useClubFilterOptions } from "@/lib/api";

// Per-card entrance animation is defined inline on each `motion.div` card.
// We intentionally do NOT rely on parent-driven `staggerChildren`/variant
// inheritance: when the result set grows (e.g. clearing a filter or picking
// "All" while the unfiltered query is cached), newly-added cards would inherit
// an already-completed parent stagger and never receive an "animate" trigger,
// leaving them invisible (opacity: 0) while still occupying grid space —
// showing the previously-filtered clubs plus empty boxes for the rest.
// Explicit `initial`/`animate` on every card guarantees it animates to visible
// on mount, regardless of when it is added (filter change, search, infinite scroll).

const LIMIT = 16;

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [division, setDivision] = useState("");

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useClubs(LIMIT, {
    district: district || undefined,
    area: area || undefined,
    division: division || undefined,
  });

  const { data: filterOptions } = useClubFilterOptions();

  const clubs: Club[] = data?.pages.flat() ?? [];

  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.description?.toLowerCase().includes(query) ||
      club.district?.toLowerCase().includes(query) ||
      club.division?.toLowerCase().includes(query) ||
      club.area?.toLowerCase().includes(query)
    );
  });

  const districtOptions = filterOptions?.districts ?? [];
  const areaOptions = filterOptions?.areas ?? [];
  const divisionOptions = filterOptions?.divisions ?? [];

  const hasActiveFilters = Boolean(
    district || area || division || searchQuery,
  );

  const clearFilters = () => {
    setDistrict("");
    setArea("");
    setDivision("");
    setSearchQuery("");
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading clubs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load clubs
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Explore Clubs
          </h1>
          <p className="text-slate-400">
            Discover Toastmasters clubs and start your public speaking journey
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs by name, district, or location..."
            className="w-full h-12 pl-12 pr-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mb-8">
          <FilterSelect
            label="District"
            value={district}
            options={districtOptions}
            placeholder="All Districts"
            onChange={setDistrict}
          />
          <FilterSelect
            label="Division"
            value={division}
            options={divisionOptions}
            placeholder="All Divisions"
            onChange={setDivision}
          />
          <FilterSelect
            label="Area"
            value={area}
            options={areaOptions}
            placeholder="All Areas"
            onChange={setArea}
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-4 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredClubs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
              >
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-slate-400">No clubs found</div>
        )}

        {/* Infinite scroll sentinel */}
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-10"
        >
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          )}
          {!hasNextPage && filteredClubs.length > 0 && (
            <span className="text-slate-500 text-sm">
              You&apos;ve reached the end
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 min-w-[150px] px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
