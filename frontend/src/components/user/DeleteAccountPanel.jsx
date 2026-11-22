import { useState } from 'react';
import { ErrorMessage, SuccessMessage } from '../Messages.jsx';
import { contextPath, genericDELETERequest, getMessage, HTTP_STATUS_OK } from '../../utils/utils.js';
import { populateErrorMessage, populateSuccessMessage } from '../../utils/message.js';
import { showPassword } from '../../utils/passwordComplexAndShowPassword.js';
import { SECTION_BOX, INPUT, LABEL, SHOW_PASSWORD_BTN, FORM_GROUP, HR, errorListOf } from './shared.js';
import GradientButton from './GradientButton.jsx';

/*
 * Port of jsp/user/deleteAccount.jsp + js/user/deleteAccount.js ("Delete Account" tab).
 */
export default function DeleteAccountPanel({ show, user, loading }) {
    const [password, setPassword] = useState('');

    const email = user?.email ?? '';
    const enabled = email.trim() !== '' && password.trim() !== '';

    const sendDeleteUpdate = () => {
        const json = {
            userUpdate: {
                // The original reads formData.get('email') from the form, but the #email input is disabled and
                // disabled controls are not in FormData, so it sends null. Kept as is (bug reported).
                oldEmail: null,
                newEmail: '',
                oldPassword: password,
                newPassword: '',
                repeatNewPassword: '',
            },
        };
        genericDELETERequest(contextPath + "user/me", JSON.stringify(json), updateDeleteStatus);
    };

    const updateDeleteStatus = (req) => {
        const message = getMessage(req);
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === HTTP_STATUS_OK) {
                populateSuccessMessage("#deleteAccountPage .successMessage", "DELETE DONE:", message.message);
                setPassword(''); // form.reset()
            } else if (message != null) {
                populateErrorMessage("#deleteAccountPage .errorMessage", message.message, message.errorCode, message.errorDetails);
            } else {
                const errors = errorListOf(req);
                if (errors != null)
                    populateErrorMessage("#deleteAccountPage .errorMessage", errors.msgs, errors.errorCodes, errors.errorDetails);
            }
        }
    };

    const onEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!enabled) return;
            sendDeleteUpdate();
        }
    };

    return (
        <div id="deleteAccountPage" className={show ? SECTION_BOX : 'hidden'}>
            {user && (
                <>
                    <div id="liveAlertPlaceholderDelete"></div>
                    <SuccessMessage />
                    <ErrorMessage />

                    <form id="deleteForm" className="w-full px-3" onSubmit={(e) => e.preventDefault()}>
                        <div className={FORM_GROUP}>
                            <label className="inline-block">Username</label>
                            <div className="form-input">
                                <input id="nameDelete" type="text" name="name" className={INPUT} placeholder=""
                                       value={user.username} disabled readOnly />
                            </div>
                        </div>
                        <hr className={HR} />

                        <div className={FORM_GROUP}>
                            <label className="inline-block">E-mail</label>
                            <input id="email" type="text" name="email" className={INPUT} placeholder=""
                                   value={email} disabled readOnly />
                        </div>

                        <div className={FORM_GROUP}>
                            <input type="password" name="password" id="password" className={INPUT} placeholder=""
                                   value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={onEnter} />
                            <label className={LABEL}>Password</label>
                            <button type="button" id="password_ShowPassword" className={SHOW_PASSWORD_BTN} tabIndex={-1}
                                    onClick={(e) => { e.preventDefault(); showPassword("password"); }}>
                                <i id="password_eyeIcon" className="fas fa-eye" />
                            </button>
                        </div>

                        {/* The original class list is "button-container mb-0 mt-5\" (stray backslash), so mt-5 never applied. */}
                        <div className="flex justify-center mb-0">
                            <GradientButton id="deleteButton" disabled={!enabled} onClick={sendDeleteUpdate}>Delete Account</GradientButton>
                        </div>
                    </form>
                </>
            )}
            {!user && !loading && <div><strong>NOT LOGGED IN</strong></div>}
        </div>
    );
}
