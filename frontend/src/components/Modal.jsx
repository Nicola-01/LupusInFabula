import { useEffect } from 'react';

/**
 * Reusable Bootstrap-like modal (port of jsp/utils/modal.jsp and the Bootstrap modal behaviour).
 * Closes on the X button, the Close/Cancel button, Escape and a click on the backdrop (like Bootstrap defaults).
 * Renders nothing when closed.
 *
 * @param {object} props
 * @param {boolean} props.open - whether the modal is shown.
 * @param {function} props.onClose - called when the modal asks to close (X, backdrop, Escape, footer buttons).
 * @param {string} [props.title] - title text (h1 #modalLabel-like).
 * @param {React.ReactNode} [props.children] - body (div#modalBodyText-like).
 * @param {React.ReactNode} [props.footer] - footer buttons. If omitted a single "Close" button is shown.
 * @param {string} [props.id="modal"] - id of the dialog root (the old trigger uses data-bs-target="#modal" style ids).
 * @param {boolean} [props.centered=false] - vertically centered dialog (Bootstrap .modal-dialog-centered); otherwise 10em from the top as css/utils/modal.css did.
 * @param {string} [props.footerClassName='justify-end'] - footer alignment (rolesModal.jsp used justify-content-center).
 */
export default function Modal({ open, onClose, title, children, footer, id = 'modal', centered = false, footerClassName = 'justify-end' }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div id={id} className="fixed inset-0 z-[1055] flex items-start justify-center bg-black/50 px-2"
             role="dialog" aria-modal="true" aria-labelledby={`${id}Label`}
             onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className={`relative w-full min-[576px]:max-w-[500px] ${centered ? 'my-auto' : 'mt-[calc(10em+1.75rem)]'}`}>
                <div className="flex flex-col rounded-[.3rem] border border-solid border-[rgba(0,0,0,0.2)] bg-bg-first-color text-text-color dark:border-[rgba(255,255,255,0.15)] shadow-lg">
                    <div className="flex justify-center relative py-2 px-4 border-b border-solid border-[#dee2e6] dark:border-[#495057]">
                        <h1 id={`${id}Label`} className="leading-normal m-0 mx-auto pl-8">{title}</h1>
                        <button type="button" aria-label="Close" onClick={onClose}
                                className="absolute right-2 top-1/2 -translate-y-1/2 m-0 w-4 h-4 opacity-50 hover:opacity-100 bg-[url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%20fill=%27%23000%27%3e%3cpath%20d=%27M.293.293a1%201%200%20011.414%200L8%206.586%2014.293.293a1%201%200%20111.414%201.414L9.414%208l6.293%206.293a1%201%200%2001-1.414%201.414L8%209.414l-6.293%206.293a1%201%200%2001-1.414-1.414L6.586%208%20.293%201.707a1%201%200%20010-1.414z%27/%3e%3c/svg%3e)] bg-[length:1em] bg-center bg-no-repeat dark:invert" />
                    </div>
                    <div className="py-2 px-4 flex-auto">{children}</div>
                    <div className={`flex flex-wrap ${footerClassName} gap-2 py-2 px-4 border-t border-solid border-[#dee2e6] dark:border-[#495057]`}>
                        {footer ?? (
                            <button type="button" className="rounded bg-[#6c757d] text-white px-3 py-1.5 w-[100px]" onClick={onClose}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
