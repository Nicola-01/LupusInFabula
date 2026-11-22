import { showMore } from '../utils/message.js';

/*
 * Message popups (port of jsp/utils/{error,info,warning,success}Message.jsp and jsp/include/show-message.jsp).
 * The popups are hidden (style display none) and filled by utils/message.js through their CSS classes
 * (.messageTitle, .messageDetails, .moreDetails, .showMore). Use <Messages /> (all four) or the single
 * components. Colors = Bootstrap 5.3 "subtle" palette (light / dark), as in css/utils/message.css.
 */

const KINDS = {
    error: {
        root: 'errorMessage bg-[#f8d7da] text-[#58151c] border-[#f1aeb5] dark:bg-[#2c0b0e] dark:text-[#f1aeb5] dark:border-[#842029]',
        btn: 'errorShowMore bg-[#f1aeb5] dark:bg-[#842029]',
        close: 'hover:text-[#f1aeb5] dark:hover:text-[#842029]',
        title: 'errorMessage',
        details: 'errorMessageDetails',
        moreDetails: 'errorMoreDetails',
        btnText: 'errorShowMoreText',
    },
    info: {
        root: 'infoMessage bg-[#cff4fc] text-[#055160] border-[#9eeaf9] dark:bg-[#032830] dark:text-[#6edff6] dark:border-[#087990]',
        btn: 'infoShowMore bg-[#9eeaf9] dark:bg-[#087990]',
        close: 'hover:text-[#9eeaf9] dark:hover:text-[#087990]',
        title: 'infoTitle',
        details: 'infoMessageDetails',
        moreDetails: 'infoMoreDetails',
        btnText: 'infoShowMoreText',
    },
    warning: {
        root: 'warningMessage bg-[#fff3cd] text-[#664d03] border-[#ffe69c] dark:bg-[#332701] dark:text-[#ffda6a] dark:border-[#997404]',
        btn: 'warningShowMore bg-[#ffe69c] dark:bg-[#997404]',
        close: 'hover:text-[#ffe69c] dark:hover:text-[#997404]',
        title: 'warningTitle',
        details: 'warningMessageDetails',
        moreDetails: 'warningMoreDetails',
        btnText: 'warningShowMoreText',
    },
    success: {
        root: 'successMessage bg-[#d1e7dd] text-[#0a3622] border-[#a3cfbb] dark:bg-[#051b11] dark:text-[#75b798] dark:border-[#0f5132]',
        btn: 'successShowMore bg-[#a3cfbb] dark:bg-[#0f5132]',
        close: 'hover:text-[#a3cfbb] dark:hover:text-[#0f5132]',
        title: 'successTitle',
        details: 'successMessageDetails',
        moreDetails: 'successMoreDetails',
        btnText: 'successShowMoreText',
    },
};

const POPUP_BASE = 'message rounded-[.6em] border border-solid w-full min-[992px]:!w-[70%] my-4 p-[15px]';
const CLOSE_BASE = 'closebtn float-right font-bold text-[22px] leading-5 cursor-pointer transition-[0.3s]';
const BTN_BASE = 'showMore font-[Helvetica,sans-serif] cursor-pointer font-bold transition-all duration-200 px-2.5 py-[5px] rounded-full border border-transparent flex items-center text-[15px] w-[105px] active:scale-95 not-[.mb-0]:mb-4 m-0';

/** One popup of the given kind ("error" | "info" | "warning" | "success"), hidden until populated. */
function Popup({ kind }) {
    const k = KINDS[kind];
    return (
        <div className={`${POPUP_BASE} ${k.root}`} style={{ display: 'none' }}>
            <span className={`${CLOSE_BASE} ${kind}Message`}
                  onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}>&times;</span>
            <h4><strong className={`messageTitle ${k.title}`}></strong></h4>
            <p className={`messageDetails ${k.details}`}></p>
            <button className={`${BTN_BASE} ${k.btn} mb-0`} onClick={(e) => showMore(e.currentTarget)}>
                <span className={`showMoreText ${k.btnText} m-auto`}>Show more</span>
            </button>
            <p className={`moreDetails ${k.moreDetails}`} style={{ display: 'none' }}></p>
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
