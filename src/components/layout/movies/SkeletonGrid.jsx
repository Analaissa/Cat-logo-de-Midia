import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] rounded-xl bg-secondary" />
          <div className="px-1">
            <Skeleton className="h-4 w-3/4 bg-secondary" />
            <Skeleton className="h-3 w-1/3 mt-1.5 bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}