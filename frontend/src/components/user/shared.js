/*
 * Tailwind class sets and helpers shared by the user pages (replace the Bootstrap 5 classes and the
 * css/user/*, css/friend/*, css/utils/* rules of the JSPs). Breakpoints: min-[576px] / [768px] / [992px] / [1200px].
 */
import { JSON_resource_list } from '../../utils/utils.js';

/** Bootstrap .container (fluid, max width per breakpoint, 12px side padding). */
export const CONTAINER = 'grow w-full mx-auto px-3 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]';

/** Bootstrap .row (negative gutter; direct children get the gutter padding: add px-3 / w-* to them). */
export const ROW = 'flex flex-wrap -mx-3';

/** Bootstrap .table with common.css overrides, light and dark (cells use the body background). */
export const TABLE = 'w-full align-top border-collapse text-[#212529] dark:text-[#dee2e6]';

/** Table cell of a .table: common.css th/td (3px padding, centred, 46px) + Bootstrap bottom border and background. */
const CELL = '!p-[3px] text-center align-middle h-[46px] border-b border-solid border-[#dee2e6] dark:border-[#495057] bg-white dark:bg-[#212529]';
const STRIPE = 'shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.05)]';

/** Class of a cell of a .table-striped table; n is the 1-based position of its row in the tbody (odd rows are striped). */
export const cell = (n) => (n % 2 === 1 ? `${CELL} ${STRIPE}` : CELL);

/** Bootstrap .form-control look (font 18px, padding .5rem) with the focus ring; "form-control" is a hook for userPage.css. */
export const INPUT = 'form-control block w-full p-2 text-[18px] leading-normal bg-inputs-bg-color text-[#212529] dark:text-[#dee2e6] border border-solid border-[#dee2e6] dark:border-[#495057] rounded-md outline-none focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]';

/** Floating label of an input (css/utils/inputFormAnimations.css); the floated state is in styles/userPage.css. */
export const LABEL = 'control-label absolute left-[5px] top-[10px] pointer-events-none text-[18px] font-normal text-[lightslategray] transition-all duration-200 ease-[ease]';

/** The eye button of a password field (css/utils/passwordComplexAndShowPassword.css + user.css sizes). */
export const SHOW_PASSWORD_BTN = 'absolute top-0 right-0 !h-[45px] !w-[45px] border-0 border-l border-solid border-[#ccc] bg-transparent cursor-pointer';

/** Form group: relative, 1.85em bottom margin (css/utils/inputFormAnimations.css). */
export const FORM_GROUP = 'relative mb-[1.85em]';

/** The white-framed box of the credentials and delete sections (css/user/user.css). */
export const SECTION_BOX = 'mx-auto max-w-[700px] box-border flex flex-col rounded-2xl border-2 border-solid border-transparent px-6 py-8 text-text-color [background:linear-gradient(var(--bg-second-color),var(--bg-second-color))_padding-box,linear-gradient(145deg,#e81cff,#40c9ff)_border-box]';

/** Bootstrap <hr class="my-4">. */
export const HR = 'my-6 border-0 border-t border-solid border-current opacity-25';

/**
 * Error list of a failed PUT/DELETE on the user (the loop of updatePutStatus / updateDeleteStatus).
 * Returns null when the response has no resource-list.
 */
export function errorListOf(req) {
    const listMsg = JSON.parse(req.responseText)[JSON_resource_list];
    if (listMsg == null) return null;
    let msgs = '';
    let errorCodes = '';
    let errorDetails = '';
    for (let i = 0; i < listMsg.length; i++) {
        const message = listMsg[i]['message'];
        msgs += message.message + '<br>';
        if (!errorCodes.includes(message['error-code']))
            errorCodes += ', ' + message['error-code'];
        if (!errorDetails.includes(message['error-details']))
            errorDetails += '<br>' + message['error-details'];
    }
    return { msgs, errorCodes, errorDetails };
}
