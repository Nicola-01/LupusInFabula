import { useEffect } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Panel } from './Panel';

// role: live-region role; seal: classes of the seal disc; label: screen-reader text.
export const MESSAGE_KINDS = {
  error: { Icon: CircleAlert, seal: 'bg-lf-wax text-lf-wax-text', role: 'alert', label: 'Error' },
  info: { Icon: Info, seal: 'bg-lf-seal-info text-lf-seal-info-text', role: 'status', label: 'Info' },
  warning: { Icon: TriangleAlert, seal: 'bg-lf-seal-warn text-lf-seal-warn-text', role: 'alert', label: 'Warning' },
  success: { Icon: CircleCheck, seal: 'bg-lf-seal-ok text-lf-seal-ok-text', role: 'status', label: 'Success' },
};

/** Wax-style seal icon shared by MessageBox and the toasts. */
export function MessageSeal({ kind = 'info', small = false }) {
  const { Icon, seal, label } = MESSAGE_KINDS[kind];
  return (
    <span className={cn('lf-seal', small && 'lf-seal-sm', seal)}>
      <Icon className={small ? 'size-4' : 'size-6'} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Popup message: gilded parchment with a wax seal icon. `code` (error-code) is debug-only: logged, not shown. */
export function MessageBox({ kind = 'info', title, details, code }) {
  const { role } = MESSAGE_KINDS[kind];
  useEffect(() => {
    if (code) console.warn(`[${kind}] ${title} (code ${code})`, details);
  }, [kind, title, details, code]);
  return (
    <Panel role={role} className="flex max-w-md gap-4 p-5">
      <MessageSeal kind={kind} />
      <div className="min-w-0 flex-1">
        <p className="font-lf-heading text-lg font-bold">{title}</p>
        {details && <p className="mt-1 text-[15px] leading-snug">{details}</p>}
      </div>
    </Panel>
  );
}
