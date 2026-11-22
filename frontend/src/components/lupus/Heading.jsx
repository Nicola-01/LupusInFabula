import { cn } from '@/lib/utils';

/** Brass ornament divider (decorative, hidden from assistive tech). */
export function Ornament({ className = '' }) {
  return (
    <div className={cn('flex items-center gap-3 text-lf-brass', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <span className="text-sm">&#10022;</span>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

/** Page title in Cinzel Decorative, optional rubric subtitle, centred ornament. */
export function PageTitle({ children, sub, className = '' }) {
  return (
    <header className={cn('text-center', className)}>
      <h1 className="font-lf-title text-3xl font-bold tracking-[.02em] sm:text-4xl">{children}</h1>
      {sub && <p className="mt-2 italic text-lf-rubric">{sub}</p>}
      <Ornament className="mx-auto mt-4 max-w-md" />
    </header>
  );
}
