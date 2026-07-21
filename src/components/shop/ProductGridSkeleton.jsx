export default function ProductGridSkeleton({ count = 8, view = 'grid' }) {
  return (
    <div
      className={
        view === 'grid'
          ? 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4'
          : 'flex flex-col gap-5'
      }
    >
      {Array.from({ length: count }).map((_, i) =>
        view === 'grid' ? (
          <div key={i} className="animate-pulse">
            <div className="aspect-4/5 rounded-2xl bg-beige" />
            <div className="mt-4 h-3.5 w-3/4 rounded bg-beige" />
            <div className="mt-2 h-3 w-1/3 rounded bg-beige" />
            <div className="mt-2 h-3.5 w-1/2 rounded bg-beige" />
          </div>
        ) : (
          <div key={i} className="flex animate-pulse gap-4">
            <div className="h-32 w-32 shrink-0 rounded-2xl bg-beige sm:h-40 sm:w-40" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-3.5 w-2/3 rounded bg-beige" />
              <div className="h-3 w-1/4 rounded bg-beige" />
              <div className="h-3.5 w-1/3 rounded bg-beige" />
              <div className="h-3 w-full max-w-sm rounded bg-beige" />
            </div>
          </div>
        )
      )}
    </div>
  );
}
