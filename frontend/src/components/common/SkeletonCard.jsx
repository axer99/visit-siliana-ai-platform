export default function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm flex flex-col h-full animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="h-60 bg-dark/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
            <div className="absolute top-4 left-4 w-20 h-5 bg-dark/15 rounded-full" />
            <div className="absolute top-4 right-4 w-16 h-6 bg-dark/15 rounded-full" />
          </div>

          {/* Content Placeholder */}
          <div className="p-6 flex flex-col flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-dark/10 rounded-md" />
              <div className="w-16 h-4 bg-dark/10 rounded-md" />
            </div>

            <div className="w-4/5 h-6 bg-dark/15 rounded-md" />

            <div className="space-y-2 pt-1 flex-1">
              <div className="w-full h-3 bg-dark/10 rounded-md" />
              <div className="w-5/6 h-3 bg-dark/10 rounded-md" />
              <div className="w-2/3 h-3 bg-dark/10 rounded-md" />
            </div>

            <div className="pt-4 border-t border-dark/5 flex items-center justify-between">
              <div className="w-20 h-4 bg-dark/10 rounded-md" />
              <div className="w-24 h-9 bg-dark/15 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
