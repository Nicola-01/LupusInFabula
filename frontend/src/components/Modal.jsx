import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Generic modal in variant F style (gilded parchment), built on the shadcn Dialog (Radix):
 * focus trap, Escape, backdrop click and the X / footer buttons call onClose; the title labels the dialog.
 * Renders nothing when closed.
 *
 * @param {object} props
 * @param {boolean} props.open - whether the modal is shown.
 * @param {function} props.onClose - called when the modal asks to close (X, backdrop, Escape, footer buttons).
 * @param {string} [props.title] - title text.
 * @param {React.ReactNode} [props.children] - body.
 * @param {React.ReactNode} [props.footer] - footer buttons. If omitted a single "Close" button is shown.
 * @param {string} [props.id="modal"] - id of the dialog content (callers style it by id, e.g. "#rolesModal").
 * @param {boolean} [props.centered=false] - vertically centered; otherwise 10em from the top as before.
 * @param {string} [props.footerClassName='justify-end'] - footer alignment (rolesModal used justify-center).
 */
export default function Modal({ open, onClose, title, children, footer, id = 'modal', centered = false, footerClassName = 'justify-end' }) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
            <DialogContent id={id} showCloseButton={false} aria-describedby={undefined}
                           className={cn(
                               'lf-paper max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] gap-0 overflow-y-auto border-[3px] border-double border-lf-brass bg-lf-paper p-0 text-lf-ink sm:max-w-[500px]',
                               !centered && 'top-[calc(10em+1.75rem)] translate-y-0',
                           )}>
                <div className="flex items-center gap-3 border-b-2 border-double border-lf-brass px-4 py-3">
                    <DialogTitle className="m-0 flex-1 font-lf-heading text-lg font-bold leading-normal">{title}</DialogTitle>
                    <DialogClose asChild>
                        <button type="button" aria-label="Close"
                                className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-lf-ink2 hover:text-lf-rubric">
                            <X className="size-5" aria-hidden="true" />
                        </button>
                    </DialogClose>
                </div>
                <div className="flex-auto px-4 py-4 font-lf-body text-[15px]">{children}</div>
                <div className={cn('flex flex-wrap gap-2 border-t-2 border-double border-lf-brass px-4 py-3', footerClassName)}>
                    {footer ?? (
                        <Button type="button" variant="brass" size="touch" className="min-w-[7rem] font-lf-heading" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
