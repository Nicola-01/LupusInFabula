import { cn } from '@/lib/utils';

/** Gilded double-border parchment: content container and popup base. `as` sets the element tag. */
export function Panel({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={cn('lf-paper relative p-6', className)} {...props}>
      {children}
    </Tag>
  );
}
