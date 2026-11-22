import { useState } from 'react';
import { ErrorMessage, SuccessMessage } from '../Messages.jsx';
import { contextPath, genericPUTRequest, getMessage, HTTP_STATUS_OK } from '../../utils/utils.js';
import { populateErrorMessage, populateSuccessMessage } from '../../utils/message.js';
import {
    passwordComplexHint, showPassword, showPasswordHint,
} from '../../utils/passwordComplexAndShowPassword.js';
import { SECTION_BOX, INPUT, LABEL, SHOW_PASSWORD_BTN, FORM_GROUP, HR, errorListOf } from './shared.js';
import GradientButton from './GradientButton.jsx';

/*
 * Port of jsp/user/updateCredential.jsp + js/user/updateCredentials.js ("Change Credentials" tab).
 * The button is enabled by the same rules as checkFormCompletionPut(), derived from the field values.
 */
const EMPTY = { currentEmail: '', newEmail: '', oldPassword: '', newPassword: '', confirmPassword: '' };

// Password complexity hint (same markup as the old #passwordComplex list; criteria marked by the shared helper).
function PasswordHint() {
    return (
        <div id="passwordComplex" className="hidden absolute w-full p-2 px-3 bg-[#ade4f8] text-[#0D324D] rounded-[.6em] -translate-y-[115%]">
            The password must contain:
            <ul className="m-0 list-disc pl-8">
                <li id="passwordLength" className="text-red-600">From 8 to 20 characters.</li>
                <li id="passwordUppercase" className="text-red-600">An uppercase letter.</li>
                <li id="passwordLowercase" className="text-red-600">A lowercase letter.</li>
                <li id="passwordNumber" className="text-red-600">A number.</li>
                <li id="passwordSymbol" className="text-red-600">A symbol (!@#$%^&*)</li>
            </ul>
        </div>
    );
}

export default function UpdateCredentialsPanel({ show, user, loading }) {
    const [v, setV] = useState(EMPTY);
    const set = (key) => (e) => setV((prev) => ({ ...prev, [key]: e.target.value }));

    const ce = v.currentEmail.trim() !== '';
    const ne = v.newEmail.trim() !== '';
    const op = v.oldPassword.trim() !== '';
    const np = v.newPassword.trim() !== '';
    const cp = v.confirmPassword.trim() !== '';
    // checkFormCompletionPut(): emails only, passwords only, or everything filled
    const enabled = (ce && ne && !op && !np && !cp)
        || (op && np && cp && !ce && !ne)
        || (op && np && cp && ce && ne);

    const sendPutUpdate = () => {
        const json = {
            userUpdate: {
                oldEmail: v.currentEmail,
                newEmail: v.newEmail,
                oldPassword: v.oldPassword,
                newPassword: v.newPassword,
                repeatNewPassword: v.confirmPassword,
            },
        };
        genericPUTRequest(contextPath + "user/me", JSON.stringify(json), updatePutStatus);
    };

    const updatePutStatus = (req) => {
        const message = getMessage(req);
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === HTTP_STATUS_OK) {
                populateSuccessMessage("#changeCredentialsPage .successMessage", "UPDATE DONE:", message.message);
                setV(EMPTY); // form.reset()
            } else if (message != null) {
                populateErrorMessage("#changeCredentialsPage .errorMessage", message.message, message.errorCode, message.errorDetails);
            } else {
                const errors = errorListOf(req);
                if (errors != null)
                    populateErrorMessage("#changeCredentialsPage .errorMessage", errors.msgs, errors.errorCodes, errors.errorDetails);
            }
        }
    };

    const onEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!enabled) return;
            sendPutUpdate();
        }
    };

    return (
        <div id="changeCredentialsPage" className={show ? SECTION_BOX : 'hidden'}>
            {user && (
                <>
                    <div id="liveAlertPlaceholderPut"></div>
                    <SuccessMessage />
                    <ErrorMessage />

                    <form id="updateForm" className="w-full px-3" onSubmit={(e) => e.preventDefault()}>
                        <div className={FORM_GROUP}>
                            <label className="inline-block">Username</label>
                            <div className="form-input">
                                <input id="namePut" type="text" name="name" className={INPUT} placeholder=""
                                       value={user.username} disabled readOnly />
                            </div>
                        </div>
                        <hr className={HR} />

                        <div className={FORM_GROUP}>
                            <input id="currentEmail" type="text" name="CurrentEmail" className={INPUT} placeholder=""
                                   value={v.currentEmail} onChange={set('currentEmail')} onKeyPress={onEnter} />
                            <label className={LABEL}>Current E-mail</label>
                        </div>

                        <div className={FORM_GROUP}>
                            <input id="newEmail" type="text" name="NewEmail" className={INPUT} placeholder=""
                                   value={v.newEmail} onChange={set('newEmail')} onKeyPress={onEnter} />
                            <label className={LABEL}>New E-mail</label>
                        </div>
                        <hr className={HR} />

                        <div className={FORM_GROUP}>
                            <input type="password" name="CurrentPassword" id="oldPassword" className={INPUT} placeholder=""
                                   value={v.oldPassword} onChange={set('oldPassword')} onKeyPress={onEnter} />
                            <label className={LABEL}>Current Password</label>
                            <button type="button" id="oldPassword_ShowPassword" className={SHOW_PASSWORD_BTN} tabIndex={-1}
                                    onClick={(e) => { e.preventDefault(); showPassword("oldPassword"); }}>
                                <i id="oldPassword_eyeIcon" className="fas fa-eye" />
                            </button>
                        </div>

                        <div className={FORM_GROUP}>
                            <PasswordHint />
                            <input type="password" name="NewPassword" id="newPassword" className={INPUT} placeholder=""
                                   value={v.newPassword}
                                   onChange={(e) => { set('newPassword')(e); passwordComplexHint(e.target.value); }}
                                   onFocus={() => showPasswordHint(true)}
                                   onBlur={() => showPasswordHint(false)}
                                   onKeyPress={onEnter} />
                            <label className={LABEL}>New Password</label>
                            <button type="button" id="newPassword_ShowPassword" className={SHOW_PASSWORD_BTN} tabIndex={-1}
                                    onClick={(e) => { e.preventDefault(); showPassword("newPassword"); }}>
                                <i id="newPassword_eyeIcon" className="fas fa-eye" />
                            </button>
                        </div>

                        <div className={FORM_GROUP}>
                            <input type="password" name="ConfirmPassword" id="confirm-password" className={INPUT} placeholder=""
                                   value={v.confirmPassword} onChange={set('confirmPassword')} onKeyPress={onEnter} />
                            <label className={LABEL}>Repeat New Password</label>
                            <button type="button" id="confirm-password_ShowPassword" className={SHOW_PASSWORD_BTN} tabIndex={-1}
                                    onClick={(e) => { e.preventDefault(); showPassword("confirm-password"); }}>
                                <i id="confirm-password_eyeIcon" className="fas fa-eye" />
                            </button>
                        </div>

                        <div className="flex justify-center mb-0 mt-12">
                            <GradientButton id="updateButton" disabled={!enabled} onClick={sendPutUpdate}>Update Credentials</GradientButton>
                        </div>
                    </form>
                </>
            )}
            {!user && !loading && <div><strong>NOT LOGGED IN</strong></div>}
        </div>
    );
}
