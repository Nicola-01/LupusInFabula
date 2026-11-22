import { Button } from '@/components/ui/button';
import { MessageSeal } from './lupus/Message.jsx';
import { showMore } from '../utils/message.js';

/*
 * Message popups (port of jsp/utils/{error,info,warning,success}Message.jsp and jsp/include/show-message.jsp).
 * The popups are hidden (style display none) and filled by utils/message.js through their CSS classes
 * (.messageTitle, .messageDetails, .moreDetails, .showMore). Use <Messages /> (all four) or the single
 * components. Look: variant F parchment panel with a seal icon per kind (kind = seal colour and icon).
 */

// Class hooks used by utils/message.js and the callers' selectors (".errorMessage", "#page .infoMessage", ...).
const KINDS = {
    error: { title: 'errorMessage', details: 'errorMessageDetails', moreDetails: 'errorMoreDetails', btn: 'errorShowMore', btnText: 'errorShowMoreText' },
    info: { title: 'infoTitle', details: 'infoMessageDetails', moreDetails: 'infoMoreDetails', btn: 'infoShowMore', btnText: 'infoShowMoreText' },
    warning: { title: 'warningTitle', details: 'warningMessageDetails', moreDetails: 'warningMoreDetails', btn: 'warningShowMore', btnText: 'warningShowMoreText' },
    success: { title: 'successTitle', details: 'successMessageDetails', moreDetails: 'successMoreDetails', btn: 'successShowMore', btnText: 'successShowMoreText' },
};

const ROLES = { error: 'alert', info: 'status', warning: 'alert', success: 'status' };

/** One popup of the given kind ("error" | "info" | "warning" | "success"), hidden until populated. */
function Popup({ kind }) {
    const k = KINDS[kind];
    return (
        <div role={ROLES[kind]} className={`${kind}Message message lf-paper relative my-4 w-full min-[992px]:!w-[70%] py-4 pl-4 pr-14 sm:pl-5 font-lf-body`}
             style={{ display: 'none' }}>
            <button type="button" aria-label="Close message"
                    className={`closebtn ${kind}Message absolute right-1 top-1 flex size-11 cursor-pointer items-center justify-center rounded-full font-lf-heading text-2xl leading-none text-lf-ink2 hover:text-lf-rubric`}
                    onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}>&times;</button>
            <div className="flex items-start gap-4">
                <MessageSeal kind={kind} />
                <div className="min-w-0 flex-1">
                    <h4 className="m-0"><strong className={`messageTitle ${k.title} font-lf-heading text-lg font-bold`}></strong></h4>
                    <p className={`messageDetails ${k.details} mt-1 text-[15px] leading-snug`}></p>
                    <Button type="button" variant="brass" size="touch"
                            className={`showMore ${k.btn} mb-0 not-[.mb-0]:mb-4 min-w-[7.5rem] font-lf-heading`}
                            onClick={(e) => showMore(e.currentTarget)}>
                        <span className={`showMoreText ${k.btnText}`}>Show more</span>
                    </Button>
                    <p className={`moreDetails ${k.moreDetails} m-0 text-[15px]`} style={{ display: 'none' }}></p>
                </div>
            </div>
        </div>
    );
}

/** Error popup (populateErrorMessage). */
export function ErrorMessage() { return <Popup kind="error" />; }
/** Info popup (populateInfoMessage). */
export function InfoMessage() { return <Popup kind="info" />; }
/** Warning popup (populateWarningMessage). */
export function WarningMessage() { return <Popup kind="warning" />; }
/** Success popup (populateSuccessMessage). */
export function SuccessMessage() { return <Popup kind="success" />; }

/** All four popups, like the old pages that imported them all. Do not render it twice on one page. */
export function Messages() {
    return (
        <>
            <ErrorMessage />
            <InfoMessage />
            <WarningMessage />
            <SuccessMessage />
        </>
    );
}

/**
 * Inline message box (jsp/include/show-message.jsp).
 * @param {{message: {error: boolean, message: string}|null}} props - null renders nothing.
 */
export function ShowMessage({ message }) {
    if (!message) return null;
    if (message.error) {
        return (
            <div className="error w-[90%] p-3 h-[50px] mt-[-70px] mx-auto mb-5 flex flex-row items-center justify-start bg-[#EF665B] rounded-lg shadow-[0_0_5px_-3px_#111]"
                 style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}>
                <div className="error__icon w-5 h-5 -translate-y-[2px] mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
                </div>
                <div className="error__title font-medium text-sm text-white">{message.message}</div>
                <div className="error__close w-5 h-5 cursor-pointer ml-auto"
                     onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="#393a37" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg></div>
            </div>
        );
    }
    return <p>{message.message}</p>;
}
