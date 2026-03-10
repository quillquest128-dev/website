export default function ProductSkeleton() {
  return (
    <div className="card-glass overflow-hidden animate-pulse">
      <div className="aspect-video shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-3 shimmer rounded-full w-20" />
        <div className="h-5 shimmer rounded-full w-3/4" />
        <div className="h-4 shimmer rounded-full w-full" />
        <div className="h-4 shimmer rounded-full w-2/3" />
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-[rgba(255,255,255,0.04)]">
          <div className="h-6 shimmer rounded-full w-16" />
          <div className="h-8 shimmer rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
