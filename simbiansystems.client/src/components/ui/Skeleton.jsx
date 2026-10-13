export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
export const TableSkeleton = () => <div className="admin-card p-5"><Skeleton className="h-10 w-full" /><Skeleton className="mt-4 h-48 w-full" /></div>;
