import { cn } from '@/lib/utils';

/** Wax seal badge (red by default), for counts, stamps and destructive markers. */
export function Seal({ children, className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-[48%_52%_50%_50%] bg-lf-wax font-lf-heading text-sm font-bold text-lf-wax-text shadow-[inset_0_0_0_2px_rgba(212,178,90,.4),0_2px_4px_rgba(0,0,0,.35)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
