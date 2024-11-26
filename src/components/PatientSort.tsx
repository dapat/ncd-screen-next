"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function PatientSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'recent';

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/patients?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        id="sort"
        name="sort"
        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 appearance-none"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="recent">Sort by Recent Activity</option>
        <option value="name">Sort by Name</option>
        <option value="risk">Sort by Risk Level</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
