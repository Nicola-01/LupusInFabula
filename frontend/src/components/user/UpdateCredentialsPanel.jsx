import { useState } from 'react';
import { ErrorMessage, SuccessMessage } from '../Messages.jsx';
import { contextPath, genericPUTRequest, getMessage, HTTP_STATUS_OK } from '../../utils/utils.js';
import { populateErrorMessage, populateSuccessMessage } from '../../utils/message.js';
import { invalidateSession } from '../../utils/session.js';
import {
    passwordComplexHint, showPassword, showPasswordHint,
} from '../../utils/passwordComplexAndShowPassword.js';
import { errorListOf } from './shared.js';
import GradientButton from './GradientButton.jsx';

/*
 * Port of jsp/user/updateCredential.jsp + js/user/updateCredentials.js ("Change Credentials" tab).
 * The button is enabled by the same rules as checkFormCompletionPut(), derived from the field values.
 */
const EMPTY = { currentEmail: '', newEmail: '', oldPassword: '', newPassword: '', confirmPassword: '' };

// Password complexity hint (same ids as before: the helpers mark the criteria by id and toggle "hidden" on #passwordComplex).
function PasswordHint() {
    return (
        <div id="passwordComplex" className="hidden up-rules">
            <p>The password must contain:</p>
            <ul>
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
                invalidateSession(); // the e-mail may have changed: the next page load must not reuse the cached session
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
        <div id="changeCredentialsPage" className={show ? 'up-section' : 'hidden'}>
            <h2 className="up-h2">Change credentials</h2>
            <p className="up-hint">Change the e-mail, the password, or both.</p>
            {user && (
                <>
                    <div id="liveAlertPlaceholderPut"></div>
                    <SuccessMessage />
                    <ErrorMessage />

                    <form id="updateForm" className="flex w-full flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="up-field">
                            <label htmlFor="namePut" className="up-label">Username</label>
                            <input id="namePut" type="text" name="name" className="up-input" value={user.username} disabled readOnly />
                        </div>
                        <hr className="up-divider" />

                        <div className="up-field">
                            <label htmlFor="currentEmail" className="up-label">Current E-mail</label>
                            <input id="currentEmail" type="text" name="CurrentEmail" className="up-input" autoComplete="email"
                                   value={v.currentEmail} onChange={set('currentEmail')} onKeyPress={onEnter} />
                        </div>

                        <div className="up-field">
                            <label htmlFor="newEmail" className="up-label">New E-mail</label>
                            <input id="newEmail" type="text" name="NewEmail" className="up-input" autoComplete="email"
                                   value={v.newEmail} onChange={set('newEmail')} onKeyPress={onEnter} />
                        </div>
                        <hr className="up-divider" />

                        <div className="up-field">
                            <label htmlFor="oldPassword" className="up-label">Current Password</label>
                            <div className="up-pw">
                                <input type="password" name="CurrentPassword" id="oldPassword" className="up-input" autoComplete="current-password"
                                       value={v.oldPassword} onChange={set('oldPassword')} onKeyPress={onEnter} />
                                <button type="button" id="oldPassword_ShowPassword" className="up-eye" aria-label="Show password" tabIndex={-1}
                                        onClick={(e) => { e.preventDefault(); showPassword("oldPassword"); }}>
                                    <i id="oldPassword_eyeIcon" className="fas fa-eye" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="up-field">
                            <label htmlFor="newPassword" className="up-label">New Password</label>
                            <div className="up-pw">
                                <input type="password" name="NewPassword" id="newPassword" className="up-input" autoComplete="new-password"
                                       value={v.newPassword}
                                       onChange={(e) => { set('newPassword')(e); passwordComplexHint(e.target.value); }}
                                       onFocus={() => showPasswordHint(true)}
                                       onBlur={() => showPasswordHint(false)}
                                       onKeyPress={onEnter} />
                                <button type="button" id="newPassword_ShowPassword" className="up-eye" aria-label="Show password" tabIndex={-1}
                                        onClick={(e) => { e.preventDefault(); showPassword("newPassword"); }}>
                                    <i id="newPassword_eyeIcon" className="fas fa-eye" aria-hidden="true" />
                                </button>
                            </div>
                            <PasswordHint />
                        </div>

                        <div className="up-field">
                            <label htmlFor="confirm-password" className="up-label">Repeat New Password</label>
                            <div className="up-pw">
                                <input type="password" name="ConfirmPassword" id="confirm-password" className="up-input" autoComplete="new-password"
                                       value={v.confirmPassword} onChange={set('confirmPassword')} onKeyPress={onEnter} />
                                <button type="button" id="confirm-password_ShowPassword" className="up-eye" aria-label="Show password" tabIndex={-1}
                                        onClick={(e) => { e.preventDefault(); showPassword("confirm-password"); }}>
                                    <i id="confirm-password_eyeIcon" className="fas fa-eye" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 flex justify-center">
                            <GradientButton id="updateButton" disabled={!enabled} onClick={sendPutUpdate}>Update Credentials</GradientButton>
                        </div>
                    </form>
                </>
            )}
            {!user && !loading && <div><strong>NOT LOGGED IN</strong></div>}
        </div>
    );
}
