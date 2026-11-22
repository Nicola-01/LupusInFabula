import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { MessageSeal } from './Message';

const TOAST_CLASSES = {
  toast: 'lf-paper flex w-full items-center gap-3 p-4',
  title: 'font-lf-heading text-base font-bold',
  description: 'mt-1 text-[15px] leading-snug',
};

/** Toaster in the MessageBox look. Mount once per page. */
export function LfToaster() {
  return <Toaster position="bottom-right" toastOptions={{ unstyled: true, classNames: TOAST_CLASSES }} />;
}

/** Pop a toast: kind 'error' | 'info' | 'warning' | 'success'. Pass the same id to replace an existing toast. */
export function lfToast(kind, title, details, id) {
  toast[kind](title, { id, description: details, icon: <MessageSeal kind={kind} small /> });
}
