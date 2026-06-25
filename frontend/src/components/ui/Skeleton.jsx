export default function Skeleton({ className = "", variant = "rect" }) {
  const baseClass = "skeleton rounded-xl animate-shimmer";

  if (variant === "circle") {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }

  if (variant === "text") {
    return <div className={`${baseClass} h-4 ${className}`} />;
  }

  return <div className={`${baseClass} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="ethereal-card space-y-4">
      <Skeleton className="h-6 w-1/3" variant="text" />
      <Skeleton className="h-4 w-2/3" variant="text" />
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10" variant="circle" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" variant="text" />
        <Skeleton className="h-3 w-1/2" variant="text" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
